import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DispatchFormDataModel, BundelDataModel, DispatchPrincipalGroupCodeSearchModel, DispatchPrincipalGroupCodeDataModel, ViewByIDDispatchGroupCodeModel, CompanyDispatchMasterSearchModel } from '../../../Models/DispatchFormDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DispatchService } from '../../../Services/Dispatch/Dispatch.service';
import { ToastrService } from 'ngx-toastr';
import { EnumCourseType, EnumDepartment, EnumLateralCourse, EnumStatus, EnumDispatchDDlValue } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { max } from 'rxjs';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-DispatchPrincipalGroupCode-form',
  templateUrl: './DispatchPrincipalGroupCode-form.component.html',
  styleUrls: ['./DispatchPrincipalGroupCode-form.component.css'],
  standalone: false
})
export class DispatchPrincipalGroupCodeFormComponent implements OnInit {
  public DispatchForm!: FormGroup
  public BundelForm!: FormGroup
  public SearchForm!: FormGroup

  public RadioForm!: FormGroup
  public CompanyMasterDDLList: any[] = [];
  public BoardList: any = []
  public request = new DispatchPrincipalGroupCodeDataModel();
  public Searchrequest = new DispatchPrincipalGroupCodeSearchModel();
  public SearchBundelrequest = new BundelDataModel();

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
  public DPGCID: number = 0;


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
 /* public GroupList: any[] = [];*/
  public GroupList: ViewByIDDispatchGroupCodeModel[] = [];
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  isUpdateMode: boolean = false;
  public DispatchNolist: any[] = [];
  public ExaminerStatusID: any ;
  public _DispatchDDlValue = EnumDispatchDDlValue
  public IsHandOverToPrincipalByExaminer: boolean = false;
  public IsAlready: boolean = false;
  public SearchCompanyDispatch = new CompanyDispatchMasterSearchModel();
  public CompanyDispatchList: any[] = [];
  public CompanyWiseDispatchList: any[] = [];
  @ViewChild('modal_PopUp') modal_PopUp: any;


  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private dispatchService: DispatchService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private Swal2: SweetAlert2,
    private encryptionService: EncryptionService,
    private modalService: NgbModal,
    private router: Router
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
      txtDispatchDate: ['',Validators.required],
      DDlCompanyName: ['', [DropdownValidators]],
      txtChallanNo: ['', Validators.required],
      /*txtSupplierName: ['', Validators.required],*/
      txtSupplierName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s'-]+$/)]],
      txtSupplierVehicleNo: ['', Validators.required],
      txtSupplierMobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
     /* txtSupplierDate: ['', Validators.required],*/

      txtRecipientName: ['', Validators.required],
      txtRecipientPost: ['', Validators.required],
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
    this.request.CompanyName = "0";
    await this.GetCompanyNameDDL();
    this.GetDDLDispatchNo();
    /*this.getgroupteacherData();*/

    this.DPGCID = Number(this.activatedRoute.snapshot.queryParamMap.get('DPGCID')?.toString());

   

    if (this.DPGCID > 0) {
      this.GetById()

    }
    this.IsHandOverToPrincipalByExaminer = true;

  }

  get _DispatchForm() { return this.DispatchForm.controls; }
  get _SearchForm() { return this.SearchForm.controls; }

  onInput(event: any): void {
    const inputValue = event.target.value;

 
    const filteredValue = inputValue.replace(/[^A-Za-z\s'-]/g, '');

  
    event.target.value = filteredValue;

   
    this.request.SupplierName = filteredValue;
  }


  async GetDDLDispatchNo() {
    
    try {
      this.loaderService.requestStarted();

     

      await this.commonMasterService.GetDDLDispatchNo(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DispatchNolist = data['Data'];
          

        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetCompanyNameDDL() {
    
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetDDLCompanyName(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
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


  async getgroupteacherData() {
    

    this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.Searchrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.Searchrequest.DispatchGroupID = this.Searchrequest.Status;

    try {
      await this.dispatchService.GetDispatchGroupcodeDetailsCheck(this.Searchrequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GroupList = data.Data;
        this.GroupList = this.GroupList.filter((item) => item.DispatchGroupID == this.Searchrequest.Status);
        

        if (this.GroupList.length > 0) {
          this.IsAlready = this.GroupList.every((item: any) => item.DPGCID !== 0);
        } 

       
        
        this.IsHandOverToPrincipalByExaminer = this.GroupList.every((item: any) => item.ExaminerStatusID === this._DispatchDDlValue.HandOverToPrincipalByExaminer);

        console.log("this.ExaminersList", this.GroupList)
      })
    } catch (error) {
      console.error(error);
    }
  }


  async ListFilter() {
    
    this.GroupList = [];

    this.getgroupteacherData();
    
    
  }





  validatePhoneNumber(event: any): void {
    // Only allow numeric characters
    const phoneNumber = event.target.value;

    // Remove all non-digit characters
    const sanitizedValue = phoneNumber.replace(/\D/g, '');

    // Set the value back to the input but limit it to 10 digits
    this.request.SupplierMobileNo = sanitizedValue.substring(0, 10);

    // Update the form control value to reflect the changes
    this.DispatchForm.controls['txtSupplierMobileNo'].setValue(this.request.SupplierMobileNo);
  }

  CloseModal() {

    this.modalService.dismissAll();
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



  async openModalGenerateOTP(
    content: any
    //,item: DateConfigurationModel
  ) {
    this.isSubmitted = true;

    
    this.modalService.open(
      content,
      { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
   
   
   
  }



  async SaveData() {
    
    
    this.isSubmitted = true;
    if (this.DispatchForm.invalid) {
      console.log(this.DispatchForm.value)
      return
    }

    this.loaderService.requestStarted();
    this.isLoading = true;


    if (this.GroupList.length== 0) {
      this.toastr.warning("No Groups are available")
      return
    }


    this.IsHandOverToPrincipalByExaminer = this.GroupList.every((item: any) => item.ExaminerStatusID === this._DispatchDDlValue.HandOverToPrincipalByExaminer);
    if (this.IsHandOverToPrincipalByExaminer == false) {
      this.toastr.warning("Please Verify All Group Code  Hand Over To Principal By Examiner")
      return
    } else {
      try {
        if (this.request.DPGCID) {

          this.request.ModifyBy = this.sSOLoginDataModel.UserID;
        } else {
          this.request.CreatedBy = this.sSOLoginDataModel.UserID;
        }

        this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
        this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
        this.request.InstituteID = this.sSOLoginDataModel.InstituteID;

        this.request.DispatchGroupID = this.GroupList[0]["DispatchGroupID"];
        this.request.groupCodeModels = this.GroupList;

        
        await this.dispatchService.SaveDispatchPrincipalGroupCodeData(this.request)
          .then((data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              this.toastr.success(this.Message)
              this.ResetControl();
              this.SearchBundelrequest.SearchDate = "";
              this.router.navigate(['/DispatchPrincipalGroupCodeList']);
            } else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)

            }
            else if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage);
            }
          })
      }
      catch (ex) { console.log(ex) }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoading = false;

        }, 200);
      }
    }



    
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.request = new DispatchPrincipalGroupCodeDataModel();
    this.Searchrequest.Status = 0;
  }



  async GetById() {
    
    try {

      this.loaderService.requestStarted();

      await this.dispatchService.GetDispatchGroupcodeId(this.DPGCID)

        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "data");

          this.request = data['Data'];


          this.Searchrequest.Status = data['Data']['groupCodeModels'][0]["DispatchGroupID"];
          

          this.GroupList = this.request.groupCodeModels;


          console.log(this.GroupList, "sdlkfjsdlkfj");

          
          this.isUpdateMode = true;
          const dateFields: (keyof DispatchPrincipalGroupCodeDataModel)[] = [
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


}

















