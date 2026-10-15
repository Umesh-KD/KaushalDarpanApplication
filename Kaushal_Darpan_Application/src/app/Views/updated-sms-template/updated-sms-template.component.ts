
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { AppsettingService } from '../../Common/appsetting.service';
import { EnumDepartment, EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';

import { LoaderService } from '../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { SMSMailService } from '../../Services/SMSMail/smsmail.service';

@Component({
  selector: 'app-updated-sms-template',
  standalone: false,
  templateUrl: './updated-sms-template.component.html',
  styleUrl: './updated-sms-template.component.css'
})
export class UpdatedSMSTemplateComponent implements OnInit {

  // Reactive Form
  public SMSTemplateForm!: FormGroup;

  // Login Information
  public sSOLoginDataModel = new SSOLoginDataModel();

  // Search Request
  public searchRequest: any = {};

  // SMS Template Request
  public request: any = {};

  // SMS Template List
  public SMSTemplateDataList: any[] = [];

  // Dropdown Lists
  public DepartmentList: any[] = [];
  public RoleMasterList: any[] = [];
  public DivisionMasterList: any[] = [];
  public DistrictMasterList: any[] = [];
  public filteredDistricts: any[] = [];
  public filteredInstituteList: any[] = [];
  public ManagementTypeList: any[] = [];
  public InstituteList: any[] = [];
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public _EnumDepartment = EnumDepartment;
  public isLoading: boolean = false;

  // Modal
  public modalReference: NgbModalRef | undefined;

  // Form State
  public isSubmitted: boolean = false;
  public isEditMode: boolean = false;

  // Search
  public searchText: string = '';

  // Pagination / Page Size
  public pageSize: number = 50;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
    private commonMasterService: CommonFunctionService,
    private SMSMailService: SMSMailService
  ) { }

  async ngOnInit(): Promise<void> {

    // Initialize Reactive Form
    this.SMSTemplateForm = this.formBuilder.group({
      ID: [''],

      DepartmentID: ['0', Validators.required],

      RoleID: ['0', Validators.required],

      DivisionID: ['0'],

      DistrictID: ['0'],

      ManagementTypeID: ['0'],

      InstituteID: [''],

      SMSText: [
        '',
        [
          Validators.required,
          Validators.maxLength(200)
        ]
      ],

      TemplateID: [
        '',
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ]

    });

    // Get Logged-in User Details
    const loginData = localStorage.getItem('SSOLoginUser');

    if (loginData) {
      this.sSOLoginDataModel = JSON.parse(loginData);
    }

    // Load Initial Data
    await this.GetSMSTemplateData();

    // Load Dropdowns
    // await this.GetDepartmentList();
    // await this.GetRoleList();
    await this.GetDivisionMasterList();
    // await this.GetDistrictMasterList();
    await this.GetManagementTypeList();
    await this.GetInstituteList();
  }

  // Convenient Form Controls Accessor
  get _SMSTemplateForm() {
    return this.SMSTemplateForm.controls;
  }

  // =====================================================
  // OPEN ADD / EDIT MODAL
  // =====================================================

  async ViewandUpdate(content: any, item?: any): Promise<void> {
    debugger
    this.isSubmitted = false;
    this.isEditMode = !!item;
    if(item.IsSend){
      this.toastr.error('This template has already been sent and cannot be edited.');
      return;
    }
    // Reset Form
    this.SMSTemplateForm.reset({
      DepartmentID: '',
      RoleID: '',
      DivisionID: '',
      DistrictID: '',
      ManagementTypeID: '',
      InstituteID: '',
      SMSText: '',
      TemplateID: ''
    });

    this.request = {};

    // Edit Existing Template
    if (item) {

      this.request = { ...item };

      this.SMSTemplateForm.patchValue({
        ID: item.AID ?? '',
        DepartmentID: item.DepartmentID ?? '',
        DivisionID: item.DivisionID ?? '',
        ManagementTypeID: item.ManagementTypeID ?? '',
        SMSText: item.SMSText ?? '',
        TemplateID: item.TemplateID ?? ''
      });

      
    await this.GetRoleList(0,this.SMSTemplateForm.get('DepartmentID')?.value);
    this.SMSTemplateForm.patchValue({
        RoleID: item.RoleID ?? '',
      });

    if(this.SMSTemplateForm.get('DivisionID')?.value){
      await this.onDivisionChange();
      this.SMSTemplateForm.patchValue({
        DistrictID: item.DistrictID ?? '',
      });
    }

    if(this.SMSTemplateForm.get('ManagementTypeID')?.value){      
      await this.GetInstituteList();
      this.SMSTemplateForm.patchValue({
          InstituteID: item.InstituteID ?? '',
        });
    }

    }


    this.modalReference = this.modalService.open(content, {
      backdrop: 'static',
      size: 'xl',
      keyboard: true,
      centered: true,
      scrollable: true
    });
  }

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  CloseModalPopup(): void {

    if (this.modalReference) {
      this.modalReference.dismiss();
      this.modalReference = undefined;
    }

    this.isSubmitted = false;
    this.isEditMode = false;
    this.request = {};

    if (this.SMSTemplateForm) {
      this.SMSTemplateForm.reset({
        DepartmentID: '',
        RoleID: '',
        DivisionID: '',
        DistrictID: '',
        ManagementTypeID: '',
        InstituteID: '',
        SMSText: '',
        TemplateID: ''
      });
    }
  }

  // =====================================================
  // GET SMS TEMPLATE LIST
  // =====================================================

  private parseResponse(response: any): any {
    if (response == null) {
      return {};
    }
    if (typeof response === 'string') {
      try {
        return JSON.parse(response);
      } catch {
        return {};
      }
    }
    return response;
  }

async GetSMSTemplateData(): Promise<void> {
  try {
    this.loaderService.requestStarted();
    this.isLoading = true;

    const searchText = this.searchText || '';
    debugger
    const response = await this.SMSMailService.GetSMSTemplateList(
      0,
      searchText
    );

    const data = this.parseResponse(response);
debugger
    if (data.State === EnumStatus.Success) {
      this.SMSTemplateDataList = data.Data || [];
    } else {
      this.SMSTemplateDataList = [];
      this.toastr.error(
        data.ErrorMessage || 'Failed to load SMS templates.'
      );
    }

  } catch (error) {
    console.error('GetSMSTemplateData error:', error);
    this.SMSTemplateDataList = [];
    this.toastr.error('Failed to load SMS templates.');

  } finally {
    this.isLoading = false;
    this.loaderService.requestEnded();
  }
}


async SendMessage_TemplateWise(templateID: string): Promise<void> {
  if (!templateID) {
    this.toastr.error('Template ID is missing.');
    return;
  }
debugger
  try {
    this.loaderService.requestStarted();

    const response = await this.SMSMailService.SendMessage_TemplateWise(
      templateID
    );

    const data = this.parseResponse(response);

    if (data.State === EnumStatus.Success) {
      this.toastr.success(data.Message || 'SMS processing completed.');
      await this.GetSMSTemplateData();
    } else {
      this.toastr.error(
        data.ErrorMessage || data.Message || 'Unable to send SMS.'
      );
    }

  } catch (error) {
    console.error('SendMessage_TemplateWise error:', error);
    this.toastr.error('An error occurred while sending SMS.');

  } finally {
    this.loaderService.requestEnded();
  }
}



  // =====================================================
  // LOAD DEPARTMENT DROPDOWN
  // =====================================================

  // async GetDepartmentList(): Promise<void> {

  //   try {

  //     /*
  //       TODO:
  //       Call the Department Master API.

  //       Expected item properties:
  //       DepartmentID
  //       DepartmentName

  //       Assign the response to:
  //       this.DepartmentList
  //     */

  //   } catch (error) {
  //     console.error('Error loading departments:', error);
  //   }
  // }

  // =====================================================
  // LOAD ROLE DROPDOWN
  // =====================================================

    async GetRoleList( event: any,DepartmentID: number = 0){
    try {
    debugger
    this.SMSTemplateForm.get('RoleID')?.setValue(''); // Reset RoleID when Department changes
    // const departmentID = this.SMSTemplateForm.get('DepartmentID')?.value;
    let departmentID = 0;
    if (DepartmentID === 0) {
         departmentID = event.target.value;
    }
    else{
       departmentID = DepartmentID;
    }

    // const departmentID = this.SMSTemplateForm.get('DepartmentID')?.value;
    this._SMSTemplateForm['RoleID'].setValue('');
      this.loaderService.requestStarted();
      await this.commonMasterService.GetRoleMasterDDL(departmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.RoleMasterList = data.Data;
        console.log("RoleMasterList", this.RoleMasterList);
      })


    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  // =====================================================
  // LOAD DIVISION DROPDOWN
  // =====================================================

  // async GetDivisionMasterList(): Promise<void> {

  //   try {

  //     /*
  //       TODO:
  //       Call the Division Master API.

  //       Expected item properties:
  //       DivisionID
  //       DivisionName

  //       Assign the response to:
  //       this.DivisionMasterList
  //     */

  //   } catch (error) {
  //     console.error('Error loading divisions:', error);
  //   }
  // }

    async GetDivisionMasterList() {
    try {
      debugger
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDivisionMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DivisionMasterList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  // =====================================================
  // LOAD DISTRICT DROPDOWN
  // =====================================================

  // async GetDistrictMasterList(): Promise<void> {

  //   try {

  //     /*
  //       TODO:
  //       Call the District Master API.

  //       Expected item properties:
  //       DistrictID
  //       DistrictName

  //       Assign the response to:
  //       this.DistrictMasterList
  //     */

  //   } catch (error) {
  //     console.error('Error loading districts:', error);
  //   }
  // }

  async onDivisionChange() {
   debugger
   const selectedDivisionID = this.SMSTemplateForm.get('DivisionID')?.value;

   await this.commonMasterService.DistrictMaster_DivisionIDWise(selectedDivisionID)
           .then((data: any) => {
             data = JSON.parse(JSON.stringify(data));
             this.State = data['State'];
             this.Message = data['Message'];
             this.ErrorMessage = data['ErrorMessage'];
             this.DistrictMasterList = data['Data'];
             console.log(this.DistrictMasterList)
             // console.log(this.DivisionMasterList)
           }, error => console.error(error));


    // this.filteredDistricts = this.DistrictMasterList.filter((district: any) => district.ID == selectedDivisionID);

  }

  // =====================================================
  // LOAD MANAGEMENT TYPE DROPDOWN
  // =====================================================

  // async GetManagementTypeList(): Promise<void> {

  //   try {

  //     /*
  //       TODO:
  //       Call the Management Type Master API.

  //       Expected item properties:
  //       ManagementTypeID
  //       ManagementTypeName

  //       Assign the response to:
  //       this.ManagementTypeList
  //     */

  //   } catch (error) {
  //     console.error('Error loading management types:', error);
  //   }
  // }

    async GetManagementTypeList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetManagType(EnumDepartment.BTER)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ManagementTypeList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  // =====================================================
  // LOAD INSTITUTE DROPDOWN
  // =====================================================

  // async GetInstituteList(): Promise<void> {

  //   try {

  //     /*
  //       TODO:
  //       Call the Institute Master API.

  //       Expected item properties:
  //       InstituteID
  //       InstituteName

  //       Assign the response to:
  //       this.InstituteList
  //     */

  //   } catch (error) {
  //     console.error('Error loading institutes:', error);
  //   }
  // }

   async GetInstituteList() {
      // console.log("formdata in institute", this.formData)
      try {
        debugger
        let departmentID=this.SMSTemplateForm.get('DepartmentID')?.value;
        let managementTypeID=this.SMSTemplateForm.get('ManagementTypeID')?.value;
        let selectedDistrictID = this.SMSTemplateForm.get('DistrictID')?.value;
        console.log("selectedDistrictID", selectedDistrictID, "departmentID", departmentID, "managementTypeID", managementTypeID)
        // this.collegeSearchRequest.College_TypeID = this.formData.College_TypeID
        // this.collegeSearchRequest.DistrictID = this.formData.DistrictID
        // this.collegeSearchRequest.ApplicationID = this.formData.ApplicationID
  
        // this.collegeSearchRequest.InstituteID = this.formData.InstituteID
        // this.collegeSearchRequest.StreamType = this.formData.CourseType
  
        // if (this.formData.CourseType == EnumCourseType.Non_Engineering) {
        //   this.collegeSearchRequest.action = '_getfemalecollege'
        // } else {
        //   this.collegeSearchRequest.action = '_getDatabyDistrict'
        // }
  
        // this.collegeSearchRequest.EndTermId = this.SSOLoginDataModel.EndTermID;
  
        this.loaderService.requestStarted();
         await this.commonMasterService.InstituteMaster(departmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID, managementTypeID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteList = data.Data;
        console.log("InstituteMasterDDLList", this.InstituteList);

        // this.filteredInstituteList = this.InstituteList.filter((item: any) => Number(item.DistrictID) == selectedDistrictID);
         if (data?.Data) {
            this.InstituteList = data.Data;

            this.filteredInstituteList = this.InstituteList.filter(
              (item: any) =>
                Number(item.DistrictID) === Number(selectedDistrictID)
            );

            console.log('Selected District ID:', selectedDistrictID);
            console.log('All Institutes:', this.InstituteList);
            console.log('Filtered Institutes:', this.filteredInstituteList);
          } else {
            this.InstituteList = [];
            this.filteredInstituteList = [];
        }

      })
      } catch (error) {
        console.error(error)
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    }

  // =====================================================
  // SAVE / UPDATE SMS TEMPLATE
  // =====================================================

  async SaveSMSTemplate() {

    this.isSubmitted = true;
    debugger

    if(this.SMSTemplateForm.get('DepartmentID')?.value === '0' || this.SMSTemplateForm.get('DepartmentID')?.value === '') {
      this.toastr.error(
        'Please select department.'
      );
      return;
    }
    if(this.SMSTemplateForm.get('RoleID')?.value === '0' || this.SMSTemplateForm.get('RoleID')?.value === '') {
      this.toastr.error(
        'Please select Role.'
      );
      return;
    }
    if(this.SMSTemplateForm.get('TemplateID')?.value === '0' || this.SMSTemplateForm.get('TemplateID')?.value === '') {
      this.toastr.error(
        'Please select Template.'
      );
      return;
    }
    if(this.SMSTemplateForm.get('SMSText')?.value === '0' || this.SMSTemplateForm.get('SMSText')?.value === '') {
      this.toastr.error(
        'Please enter SMS texts.'
      );
      return;
    }
    //     if (this.SMSTemplateForm.invalid) {

    //   this.SMSTemplateForm.markAllAsTouched();

    //   this.toastr.error(
    //     'Please fill in all required fields correctly.'
    //   );

    //   return;
    // }

    this.loaderService.requestStarted();

    try {

      // Prepare Request
      this.request = {
        ...this.SMSTemplateForm.getRawValue(),

        // Logged-in User
        CreatedBy: this.sSOLoginDataModel.UserID,
        UserID: this.sSOLoginDataModel.UserID,

        // Financial year, if required by your backend
        FinancialYearID: this.sSOLoginDataModel.FinancialYearID,
        EndTermID: this.sSOLoginDataModel.EndTermID
      };

      /*
        TODO: Connect your SMS Template Save/Update API here.

        Example:
      */
        await this.SMSMailService.SaveSMSTemplate(this.request)
          .then(async (data: any) => {
            if (data.State === EnumStatus.Success) {
              this.toastr.success(data.Message);
              this.CloseModalPopup();
              await this.GetSMSTemplateData();
            } else {
              this.toastr.error(data.ErrorMessage);
            }
          });


      console.log('SMS Template Request:', this.request);

      // this.toastr.info(
      //   'Form validated. Connect the SMS Template Save API to persist the data.'
      // );

    } catch (error) {

      console.error('Error saving SMS template:', error);
      this.toastr.error('Unable to save SMS template.');

    } finally {

      this.loaderService.requestEnded();

    }
  }

  // =====================================================
  // DELETE SMS TEMPLATE
  // =====================================================

  async onDeleteClick(item: any): Promise<void> {

    try {

      /*
        TODO:
        Connect your SMS Template Delete API here.

        Use the actual primary key of the SMS Template
        and the logged-in UserID.

        After successful deletion:
        await this.GetSMSTemplateData();
      */

      console.log('SMS Template selected for deletion:', item);

      this.toastr.info(
        'Connect the SMS Template Delete API to delete this record.'
      );

    } catch (error) {

      console.error('Error deleting SMS template:', error);
      this.toastr.error('Unable to delete SMS template.');

    }
  }

  // =====================================================
  // RESET SEARCH
  // =====================================================

  async onResetSearch(): Promise<void> {

    this.searchRequest = {};
    this.searchText = '';
    this.pageSize = 50;

    await this.GetSMSTemplateData();
  }

  // =====================================================
  // SEARCH FILTER
  // =====================================================

  get FilteredSMSTemplateData(): any[] {

    const search = (this.searchText || '').trim().toLowerCase();

    if (!search) {
      return this.SMSTemplateDataList;
    }

    return this.SMSTemplateDataList.filter((item: any) => {

      return [
        item.DepartmentName,
        item.RoleName,
        item.DivisionName,
        item.DistrictName,
        item.ManagementTypeName,
        item.InstituteName,
        item.SMSText,
        item.TemplateID
      ].some(value =>
        String(value ?? '').toLowerCase().includes(search)
      );

    });
  }

}
