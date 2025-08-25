import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ITIDispatchFormDataModel, ITIBundelDataModel, ITIDispatchSearchModel, ITICompanyDispatchMasterSearchModel } from '../../../../Models/ITIDispatchFormDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

import { ToastrService } from 'ngx-toastr';
import { EnumCourseType, EnumDepartment, EnumLateralCourse, EnumStatus, EnumDispatchDDlValue } from '../../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { max } from 'rxjs';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { ITIDispatchService } from '../../../../Services/ITIDispatch/ITIDispatch.service';

@Component({
  selector: 'app-ITI-DispatchSuperintendent-form',
  templateUrl: './ITI-DispatchSuperintendent-form.component.html',
  styleUrls: ['./ITI-DispatchSuperintendent-form.component.css'],
  standalone: false
})
export class ITIDispatchSuperintendentFormComponent implements OnInit {
  public DispatchForm!: FormGroup
  public BundelForm!: FormGroup
  public SearchForm!: FormGroup

  public RadioForm!: FormGroup
  public CompanyMasterDDLList: any[] = [];
  public BoardList: any = []
  public request = new ITIDispatchFormDataModel();
  public Searchrequest = new ITIDispatchSearchModel();
  public SearchCompanyDispatch = new ITICompanyDispatchMasterSearchModel();
  public SearchBundelrequest = new ITIBundelDataModel();

  public isLoadingDate: boolean = false;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public HrMasterFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public stateMasterDDL: any = []
  public PassingYearList: any = []
  public marktypelist: any = []
  public isSupplement: boolean = false
  calculatedPercentage: number = 0;
  public settingsMultiselect: object = {};
  public DispatchMasterList: any = [];
  public AllInTableSelect: boolean = false;

  public ApplicationID: number = 0;

  public _EnumCourseType = EnumCourseType

  public action: string = ''
  public SubjectMasterDDLList: any = []

  public errormessage: string = ''
  public CenterCodeInstituteWiseDetails: any = []
  public IsDisplay: boolean = false;
  public CheckDispatchId: number = 0;
  public CheckDispatchDate: string = '';
  public CheckDispatchChallanNo: string = '';
  public CheckExamDate: string = '';
  public DispatchID: number = 0;
  isAllSelected: boolean = false;
  isUpdateMode: boolean = false;
  Isremaining: boolean = false;
  public CompanyDispatchList: any[] = [];
  public CompanyWiseDispatchList: any[] = [];
  public validationList: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private dispatchService: ITIDispatchService, 
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private Swal2: SweetAlert2,
    private encryptionService: EncryptionService,
    private router: Router,
  ) { }

  async ngOnInit() {
    
    this.settingsMultiselect = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      IsVerified: false,
    };

    this.DispatchForm = this.formBuilder.group({
      /* txtCompanyName: ['', Validators.required],*/
      DDlCompanyName: ['', [DropdownValidators]],
    
      txtChallanNo: ['', Validators.required],
      txtSupplierName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s'-]+$/)]],
      txtSupplierVehicleNo: ['', Validators.required],
      txtSupplierMobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      txtSupplierDate: ['', Validators.required],
      txtRecipientName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s'-]+$/)]],
      txtRecipientPost: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s'-]+$/)]],
      txtRecipientMobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
    this.SearchForm = this.formBuilder.group(
      {
        txtSearchDate: [''],
      });

    this.BundelForm = this.formBuilder.group(
      {
        txtBundelNo: [''],
      });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
    this.SearchBundelrequest.SearchDate = this.activatedRoute.snapshot.queryParamMap.get('ExamDate') || '';

    this.SearchBundelrequest.CCCode = this.activatedRoute.snapshot.queryParamMap.get('CCCode') || '';
    this.SearchBundelrequest.SubjectCode = this.activatedRoute.snapshot.queryParamMap.get('SubjectCode') || '';
    this.SearchBundelrequest.BranchCode = this.activatedRoute.snapshot.queryParamMap.get('BranchCode') || '';
    this.SearchBundelrequest.ExamShift = this.activatedRoute.snapshot.queryParamMap.get('ExamShift') || '0';

    


    const rawDate = this.SearchBundelrequest.SearchDate;

    if (rawDate) {
      const dateObj = new Date(rawDate);

      if (!isNaN(dateObj.getTime())) {
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();

        this.SearchBundelrequest.SearchDate = `${year}-${month}-${day}`;
      } else {
        // Handle invalid date string
        this.SearchBundelrequest.SearchDate = '';
      }
    } else {
      this.SearchBundelrequest.SearchDate = '';
    }

    this.request.CompanyName = "0";
    await this.GetCompanyNameDDL();
    await this.clickDateChange();
    this.isLoadingDate = true;
    this.DispatchID = Number(this.activatedRoute.snapshot.queryParamMap.get('DispatchID')?.toString());
    if (this.DispatchID > 0) {
      this.GetById()

    } else {
      this.DispatchID = 0;
    }
  }


  async GetCompanyNameDDL() {
    debugger
    try {
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.Searchrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.loaderService.requestStarted();
      await this.commonMasterService.GetITIDDLCompanyName(this.Searchrequest.DepartmentID, this.Searchrequest.CourseTypeID, this.Searchrequest.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CompanyDispatchList = data['Data'];
          console.log(this.CompanyDispatchList)
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


  async CompanyWiseGetData(): Promise<void> {
    try {
      
      this.SearchCompanyDispatch.CompanyID = Number(this.request.CompanyName);

      this.loaderService.requestStarted();

      const response = await this.dispatchService.GetByIdCompanyDispatch(this.SearchCompanyDispatch.CompanyID);

      const data = JSON.parse(JSON.stringify(response));
      this.State = data?.State;
      this.Message = data?.Message;
      this.ErrorMessage = data?.ErrorMessage;

      const dispatchData = data?.Data;

      if (dispatchData) {
        this.CompanyWiseDispatchList = dispatchData; // if you need to keep it for reference
        this.request.SupplierName = dispatchData.SupplierName || '';
        this.request.SupplierVehicleNo = dispatchData.SupplierVehicleNo || '';
        this.request.SupplierMobileNo = dispatchData.SupplierMobileNo || '';
      }

      console.log('Company wise data', dispatchData);
    } catch (ex) {
      console.error('Error fetching company-wise data:', ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  get _DispatchForm() { return this.DispatchForm.controls; }
  get _SearchForm() { return this.SearchForm.controls; }

  onInput(event: any): void {
    const inputValue = event.target.value;

    
    const filteredValue = inputValue.replace(/[^A-Za-z\s'-]/g, '');

   
    event.target.value = filteredValue;

   
    this.request.SupplierName = filteredValue;
  }
  onInputRecipientName(event: any): void {
    const inputValue = event.target.value;
    const filteredValue = inputValue.replace(/[^A-Za-z\s'-]/g, '');
    event.target.value = filteredValue;
    this.request.RecipientName = filteredValue;
  }


  onInputRecipientPost(event: any): void {
    const inputValue = event.target.value;

   
    const filteredValue = inputValue.replace(/[^A-Za-z\s'-]/g, '');

    event.target.value = filteredValue;

    this.request.RecipientPost = filteredValue;
  }

  selectInTableAllCheckbox() {
    this.request.BundelDataModel.forEach(x => {
      
      x.selected = this.AllInTableSelect;
    });
  }

  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    
    const data = this.request.BundelDataModel.filter(x=> x.BundelID == item.DeploymentID);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
   
    this.AllInTableSelect = this.request.BundelDataModel.every(r => r.selected);
  }

  async clickDateChange() {
    
    await this.searchBundelDataByDate();
    
    if (this.CenterCodeInstituteWiseDetails.length > 0 && this.SearchBundelrequest.SearchDate && this.SearchBundelrequest.SearchDate.trim() !== '') {
      console.log('Selected Date:', this.SearchBundelrequest.SearchDate);

      if (this.request.BundelDataModel.length < 1) {
        this.IsDisplay = false

      } else {
        if (this.CheckDispatchId != 0) {
          this.IsDisplay = false
        } else {
          this.IsDisplay = true
        }
      }
      
    } else {
      console.log('No date selected');
      this.IsDisplay = false;
      this.CenterCodeInstituteWiseDetails = null;
    }
  }
  async searchBundelDataByDate() {
    
    try {

      
      this.SearchBundelrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.SearchBundelrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.SearchBundelrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.SearchBundelrequest.ExamDate = this.SearchBundelrequest.SearchDate;
      this.SearchBundelrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
     
     
      const data: any = await this.dispatchService.GetBundelDataAllData(this.SearchBundelrequest);
      const result = JSON.parse(JSON.stringify(data));
      this.request.BundelDataModel = [];
      if (Array.isArray(result.Data)) {
        this.request.BundelDataModel = result.Data.map((item: any) => ({
          ...item,
          ExamDate: this.SearchBundelrequest.ExamDate,
          CenterCode: this.SearchBundelrequest.CenterCode
        }));
        this.Isremaining = this.request.BundelDataModel.every((item: any) => item.DispatchID === 0);
        

      } else if (result.Data) {
        const item = {
          ...result.Data,
          ExamDate: this.SearchBundelrequest.ExamDate,
          CenterCode: this.SearchBundelrequest.CenterCode
        };
        this.loaderService.requestStarted();
        this.request.BundelDataModel.push(item);
      }
      this.loaderService.requestStarted();
      this.State = result.State;
      this.Message = result.Message;
      this.ErrorMessage = result.ErrorMessage;

      console.log(this.request.BundelDataModel);
      
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  validatePhoneNumber(event: any): void {
  
    const phoneNumber = event.target.value;

    const sanitizedValue = phoneNumber.replace(/\D/g, '');

    this.request.SupplierMobileNo = sanitizedValue.substring(0, 10);

    this.DispatchForm.controls['txtSupplierMobileNo'].setValue(this.request.SupplierMobileNo);
  }

  validatePhoneNumberRecipientMobileNo(event: any): void {
  
    const phoneNumber = event.target.value;

    const sanitizedValue = phoneNumber.replace(/\D/g, '');

    this.request.RecipientMobileNo = sanitizedValue.substring(0, 10);

    this.DispatchForm.controls['txtRecipientMobileNo'].setValue(this.request.RecipientMobileNo);
  } 

  async GetById() {
    debugger
    try {
      this.SearchBundelrequest.ExamDate = '';
      this.loaderService.requestStarted();

      await this.dispatchService.GetByIdDispatchMaster(this.DispatchID)

        .then((data: any) => {
          ;
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "data");

          this.request = data['Data'];
          console.log('ExamDate',this.request.BundelDataModel[0]["ExamDate"]);
          /*this.SearchBundelrequest.SearchDate = this.dateSetter(this.request.BundelDataModel[0]["ExamDate"])*/
         /* this.SearchBundelrequest.SearchDate = this.request.BundelDataModel[0]["ExamDate"];*/
          const examDateStr = this.request.BundelDataModel[0]["ExamDate"]; // "16-06-2025"
          const [day, month, year] = examDateStr.split("-");
          this.SearchBundelrequest.SearchDate = `${year}-${month}-${day}`; // "2025-06-16"

          this.isUpdateMode = true;
         /* console.this.request.BundelDataModel[0]["ExamShiftName"];*/
          console.log(this.request.BundelDataModel, "sdlkfjsdlkfj");
          
          this.isUpdateMode = true;
          this.IsDisplay = true;
          const dateFields: (keyof ITIDispatchFormDataModel)[] = [
            'DispatchDate', 'RecipientDate', 'SupplierDate'
          ];
          dateFields.forEach((field) => {
            const value = this.request[field];
            if (value) {
              const rawDate = new Date(value as string);
              const year = rawDate.getFullYear();
              const month = String(rawDate.getMonth() + 1).padStart(2, '0');
              const day = String(rawDate.getDate()).padStart(2, '0');
              (this.request as any)[field] = `${year}-${month}-${day}`;
            }
          });
          console.log(this.request, "request");

        }, (error: any) => console.error(error)
        );


      await this.commonMasterService.GetCenterCodeInstituteWise(9)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CenterCodeInstituteWiseDetails = data['Data'];
          console.log("this.CenterCodeInstituteWiseDetails", this.CenterCodeInstituteWiseDetails)
          const CenterCode = this.CenterCodeInstituteWiseDetails.map((item: any) => item.CenterCode);
          this.SearchBundelrequest.CenterCode = CenterCode[0];

        }, error => console.error(error));
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  dateSetter(date: any) {
    debugger
    const Dateformat = new Date(date);

    const year = Dateformat.getFullYear();

    const month = String(Dateformat.getMonth() + 1).padStart(2, '0');

    const day = String(Dateformat.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate

  }

  async SaveData() {
    debugger
    this.isSubmitted = true;
    if (this.DispatchForm.invalid) {
      console.log(this.DispatchForm.value)
      return
    }

    this.loaderService.requestStarted();
    this.isLoadingDate = true;
    this.isUpdateMode = false;
    try {

      if (this.request.DispatchID) {

        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }

      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.Status = EnumDispatchDDlValue.SendToBterFromCenter;
      this.request.CenterCode = this.SearchBundelrequest.CenterCode;
      this.validationList = this.request.BundelDataModel;
      const selectedItems = this.request.BundelDataModel.filter((item: any) => item.selected == true);
      

      this.request.BundelDataModel = selectedItems;
      console.log('Selected items:', selectedItems);
      
      if (this.DispatchID != 0) {

        await this.dispatchService.SaveData(this.request)
          .then((data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              this.toastr.success(this.Message)
              this.ResetControl();
              this.SearchBundelrequest.SearchDate = "";
              this.request.BundelDataModel = [];
              this.IsDisplay = false;
              this.CenterCodeInstituteWiseDetails = [];
              this.router.navigate(['/ITI-DispatchSuperintendentDetailsList'])
              /*DispatchSuperintendentDetailsList*/
            } else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
             
            }
            else if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage);
            }
          })
      } 


      if (selectedItems.length == 0 && this.DispatchID == 0) {
        this.request.BundelDataModel = this.validationList;
        this.toastr.warning('Please select at least one record');
        return;
        
      } else {
        if (this.DispatchID == 0) {
          await this.dispatchService.SaveData(this.request)
            .then((data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                this.ResetControl();
                this.SearchBundelrequest.SearchDate = "";
                this.request.BundelDataModel = [];
                this.IsDisplay = false;
                this.CenterCodeInstituteWiseDetails = [];
                this.router.navigate(['/ITI-DispatchSuperintendentDetailsList'])
              } else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.ErrorMessage)

              }
              else if (this.State == EnumStatus.Error) {
                this.toastr.error(this.ErrorMessage);
              }
              
            })
        }

     

      }

    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async CancelData() {

  }

  async ResetControl() {
    this.isSubmitted = false;
    this.SearchBundelrequest.SearchDate = '';
    this.request = new ITIDispatchFormDataModel();
  }




  btnRowDelete_OnClick(row: ITIBundelDataModel) {
    const index = this.request.BundelDataModel.findIndex(x => x.BundelNo === row.BundelNo);
    if (index !== -1) {
      this.request.BundelDataModel.splice(index, 1);
    }
  }



}

















