import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ToastrModule, ToastrService } from 'ngx-toastr';

import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { EnumRole, EnumConfigurationType, GlobalConstants, EnumStatus, EnumConfigTypeTabs } from '../../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../../Common/SweetAlert2';
import { FeeConfigurationModel } from '../../../../../Models/MasterConfigurationModel';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { MasterConfigurationService } from '../../../../../Services/MasterConfiguration/master-configuration.service';
import { SMSMailService } from '../../../../../Services/SMSMail/smsmail.service';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';


@Component({
  selector: 'app-iti-fee-configuration',
  templateUrl: './iti-fee-configuration.component.html',
  styleUrls: ['./iti-fee-configuration.component.css'],
  standalone: false
})

export class ITIFeeConfigurationComponent implements OnInit
{
  private loaderService = inject(LoaderService);
  private commonMasterService = inject(CommonFunctionService);
  private toastr = inject(ToastrService);
  private formBuilder = inject(FormBuilder);
  private modalService = inject(NgbModal);
  private activatedRoute = inject(ActivatedRoute);
  private routers = inject(Router);
  private mstConfigService = inject(MasterConfigurationService);
  private Swal2 = inject(SweetAlert2);

  public FeeConfigurationFromGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public isFormSubmitted: boolean = false;
  public isLoading: boolean = false;
  public request = new FeeConfigurationModel();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';

  public TypeMasterDDL: any[] = []

  public FeeConfigList: any = []
  public SemesterList: any = [];
  public StreamList: any = [];
  public CategoryList: any = [];
  public _EnumRole= EnumRole;

  public _EnumConfigurationType = EnumConfigurationType;
  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public RoleID: number = 0;
  public DepartmentID: number = 0;

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference

  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  //end table feature default
  constructor(private sMSMailService: SMSMailService,) { }

  async ngOnInit() {
    this.FeeConfigurationFromGroup = this.formBuilder.group({

      ddlType: ['', [DropdownValidators]],
      ddlSemester: ['0'],
      ddlStream: [''],
      ddlCategory: ['', [DropdownValidators]],
      feeAmount: ['', [Validators.required]],
      lateFeeAmount: [''],
      BackSubjectCount: ['', [Validators.maxLength(2), DropdownValidators]],
      BackFeeAmount: ['', [Validators.maxLength(4), DropdownValidators]],
      cbIsLateFeeApplicable: [false],
      txtRemark: [''],

    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;

    await this.GetConfigType();
    await this.GetSemesterMasterDDL();
    await this.GetSreamMasterDDL();
    await this.GetCategoryMasterDDL();
    await this.nonItiValidator();
  }



  //async GetDataUpadate(ID: number) {
  //  
  //  var Model = new FeeConfigurationModel()
  //  if (ID > 0) {

  //    Model = this.FeeConfigList.find((x: any) => x.TypeID == ID)
  //    console.log(Model)
  //    if (Model != undefined && Model.FeeID != 0) {
  //      this.btnEdit_OnClick(Model.FeeID)
  //    } else {
  //      this.request.FeeID = 0
  //      this.request.FeeAmount = 0
  //      this.request.IsLateFeeApplicable = false

  //      this.request.LateFeeAmount = 0

     



  //    }
  //    console.log(this.request, "request")
  //  }
  //}






  get _FeeConfigurationFromGroup() { return this.FeeConfigurationFromGroup.controls; }

  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {

        await this.nonItiValidator();
        const errors: any[] = [];
        Object.keys(this.FeeConfigurationFromGroup.controls).forEach((key) => {
          const controlErrors = this.FeeConfigurationFromGroup.get(key)?.errors;
          if (controlErrors) {
            Object.keys(controlErrors).forEach((errorKey) => {
              errors.push({ control: key, error: errorKey, value: controlErrors[errorKey] });
            });
          }
        });
        try
        {
          if (this.FeeConfigurationFromGroup.invalid)
          {
            return
          }
          if (!this.request.IsLateFeeApplicable)
          {
            this.request.LateFeeAmount = 0;
          }
          this.isLoading = true;
          this.loaderService.requestStarted();
          await this.mstConfigService.SaveFeeData(this.request)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              if (data.State == EnumStatus.Success) {
                this.toastr.success(this.Message);
                this.GetAllData();
                this.ResetControls();
              }
              else if (data.State == EnumStatus.Warning) {
                this.toastr.warning(this.ErrorMessage);
                //this.GetAllData();
                this.ResetControls();
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            }, (error: any) => console.error(error)
            );
          this.CloseModal()
        }
        catch (ex) {
          console.log(ex);
        }
      }
      else {
        this.toastr.warning('Invalid OTP Please Try Again');
      }
    }
    else {
      this.toastr.warning('Please Enter OTP');
    }
  }

  async SendOTP(isResend?: boolean)
  {
    try
    {
      this.GeneratedOTP = "";
      await this.sMSMailService.SendMessage(this.MobileNo, "OTP")
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State == EnumStatus.Success) {
              this.startTimer();
              this.GeneratedOTP = data['Data'];
              if (isResend) {
                this.toastr.success('OTP resent successfully');
              }
            }
            else {
              this.toastr.warning('Something went wrong');
            }
          }, error => console.error(error));
      
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  startTimer(): void
  {
    this.showResendButton = false;
    this.timeLeft = GlobalConstants.DefaultTimerOTP * 60;

    this.interval = setInterval(() => {
      if (this.timeLeft > 0)
      {
        this.timeLeft--;
      } else
      {
        clearInterval(this.interval);
        this.showResendButton = true; // Show the button when time is up
      }
    }, 1000); // Update every second
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  @ViewChild('content') content: ElementRef | any;

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


  async openModalGenerateOTP(content: any, item: FeeConfigurationModel) {
    this.isFormSubmitted = true;
    if (this.FeeConfigurationFromGroup.invalid) {
      return
    }
    this.OTP = '';
    this.MobileNo = GlobalConstants.DefaultMobileNo.length > 0 ? GlobalConstants.DefaultMobileNo : this.sSOLoginDataModel.Mobileno;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = this.MobileNo;
    this.request = item;
    this.SendOTP();
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
  CloseModal() {

    this.modalService.dismissAll();
  }


  async SaveData() {
    this.isFormSubmitted = true;
    
    await this.nonItiValidator();
    const errors: any[] = [];
    Object.keys(this.FeeConfigurationFromGroup.controls).forEach((key) => {
      const controlErrors = this.FeeConfigurationFromGroup.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach((errorKey) => {
          errors.push({ control: key, error: errorKey, value: controlErrors[errorKey] });
        });
      }
    });
    try {
      if (this.FeeConfigurationFromGroup.invalid) {
        return
      }
      this.isLoading = true;
      this.loaderService.requestStarted();
      await this.mstConfigService.SaveFeeData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {
            this.toastr.success(this.Message);
            this.GetAllData();
            this.ResetControls();
          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage);
            //this.GetAllData();
            this.ResetControls();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
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
  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID

      this.request.RoleID = this.sSOLoginDataModel.RoleID
      this.request.ModifyBy = this.sSOLoginDataModel.UserID
      await this.mstConfigService.GetAllFeeData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.FeeConfigList = data['Data'];
          //table feature load
          console.log(this.FeeConfigList)
          this.loadInTable();
          //end table feature load
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
  //async GetConfigType() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetConfigurationType().then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      if (this.sSOLoginDataModel.RoleID == EnumRole.ITIAdmin)
  //        this.TypeMasterDDL = data.Data.filter((item: any) => ([5,14,15,4]).includes(item.ID));
  //      else
  //        this.TypeMasterDDL = data.Data.filter((item: any) => ([4, 5, 14]).includes(item.ID));
  //    }, (error: any) => console.error(error))
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  async GetConfigType()
  {
    try
    {
      this.RoleID = this.sSOLoginDataModel.RoleID;
      await this.commonMasterService.GetConfigurationType(this.RoleID, EnumConfigTypeTabs.Fee_Tab).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TypeMasterDDL = data.Data;
        if (this.sSOLoginDataModel.RoleID == EnumRole.ITIAdmin_NCVT || this.sSOLoginDataModel.RoleID == EnumRole.ITIAdmin_SCVT
        ) {
          this.TypeMasterDDL = this.TypeMasterDDL.filter((e: any) => e.ID == 5)
        } 
      }, (error: any) => console.error(error))
    }
    catch (ex) {
      console.log(ex);
    }
  }

  ShowValidColumn() {
    return this.TypeMasterDDL.filter(function (x) {
      return (x.ID == EnumConfigurationType.Admission || x.ID == EnumConfigurationType.AllotmentFee

        || x.id==EnumConfigurationType.ApplicationProcessingFee

      )
    }).length > 0;
  }


  async GetSemesterMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterList = data.Data;
        }, (error: any) => console.error(error))
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
  async GetSreamMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamList = data.Data;
        }, (error: any) => console.error(error))
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
  async GetCategoryMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryList = data.Data;
        }, (error: any) => console.error(error))
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

  async ResetControls() {
    this.isFormSubmitted = false
    this.FeeConfigurationFromGroup.reset()
    this.request = new FeeConfigurationModel()
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID
    this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.GetAllData()
  }

  async btnEdit_OnClick(ID: number) {
    this.isFormSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.mstConfigService.GetFeeByID(ID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'];
          console.log(data['Data'])
          this.request.IsLateFeeApplicable = (this.request.LateFeeAmount ?? 0) > 0 ? true : false
          if (this.request.SemesterID == undefined) {
            this.request.SemesterID=0
          }
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async btnDelete_OnClick(ID: number)
  {
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {
      if (result.isConfirmed) {
        this.isFormSubmitted = false;
        try {
          this.loaderService.requestStarted();
          await this.mstConfigService.DeleteFeeByID(ID)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              if (data.State == EnumStatus.Success) {
                this.toastr.success(this.Message);
                this.GetAllData();
              }
              else if (data.State == EnumStatus.Warning) {
                this.toastr.warning(this.ErrorMessage);
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }

            }, error => console.error(error));
        }
        catch (ex) { console.log(ex) }
        finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    });
  }
  nonItiValidator() {
    
    if (this.request.TypeID != 1)
    {
     
      this.FeeConfigurationFromGroup.controls['ddlCategory'].clearValidators();
    }
    else
    {

      this.FeeConfigurationFromGroup.controls['ddlCategory'].setValidators([DropdownValidators]);
    }

    this.FeeConfigurationFromGroup.controls['ddlCategory'].updateValueAndValidity();
    
    if (![EnumConfigurationType.BackFee, EnumConfigurationType.BackFeeYearly].includes(this.request.TypeID)) {

      this.FeeConfigurationFromGroup.controls['BackSubjectCount'].clearValidators();
      this.FeeConfigurationFromGroup.controls['BackFeeAmount'].clearValidators();

    } else {

      this.FeeConfigurationFromGroup.controls['BackSubjectCount'].setValidators([Validators.maxLength(2), DropdownValidators]);
      this.FeeConfigurationFromGroup.controls['BackFeeAmount'].setValidators([Validators.maxLength(4), DropdownValidators]);
    }
    this.FeeConfigurationFromGroup.controls['BackSubjectCount'].updateValueAndValidity();
    this.FeeConfigurationFromGroup.controls['BackFeeAmount'].updateValueAndValidity();
  }

  



  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.FeeConfigList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.FeeConfigList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.FeeConfigList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.FeeConfigList.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.FeeConfigList.forEach((x: any) => {
      x.Selected = this.AllInTableSelect;
    });
  }

  // end table feature
}
