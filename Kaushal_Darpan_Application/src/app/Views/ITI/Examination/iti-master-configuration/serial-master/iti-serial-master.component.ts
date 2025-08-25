import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

import { GlobalConstants, EnumConfigurationType, EnumStatus, EnumConfigTypeTabs } from '../../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../../Common/SweetAlert2';
import { SerialMasterConfigurationModel } from '../../../../../Models/MasterConfigurationModel';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { MasterConfigurationService } from '../../../../../Services/MasterConfiguration/master-configuration.service';
import { SMSMailService } from '../../../../../Services/SMSMail/smsmail.service';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { DateConfigService } from '../../../../../Services/DateConfiguration/date-configuration.service';


@Component({
  selector: 'app-iti-serial-master',
  templateUrl: './iti-serial-master.component.html',
  styleUrls: ['./iti-serial-master.component.css'],
  standalone: false
})
export class ITISerialMasterComponent implements OnInit {
  public SerialMasterFromGroup!: FormGroup;

  public isFormSubmitted: boolean = false;
  public isLoading: boolean = false;
  public request = new SerialMasterConfigurationModel();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';

  public TypeMasterDDL: any[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();

  public SerialConfigList: any = []
  public SemesterList: any = [];

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
  private isOtpSave: boolean = false;


  public _EnumConfigurationType = EnumConfigurationType;
  //end table feature default
  constructor(
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService,
    private mstConfigService: MasterConfigurationService,
    private Swal2: SweetAlert2
  ) { }
  async ngOnInit() {
    this.SerialMasterFromGroup = this.formBuilder.group({
      ddlType: ['', [DropdownValidators]],
      ddlSemester: ['', [DropdownValidators]],
      startFrom: ['', [Validators.required]],
      staticVal: ['', [Validators.required]],
      partitionSize: [''],
      txtRemark: [''],
      txtlength: ['', [DropdownValidators]]
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID
    this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
    await this.GetConfigType();
    await this.GetSemesterMasterDDL();

    await this.GetAllData();
  }

  get _SerialMasterFromGroup() { return this.SerialMasterFromGroup.controls; }

  async VerifyOTP() {
    this.isOtpSave = true; // ✅ Set the flag before calling save

    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        this.isOtpSave = true; // ✅ Prevent SaveData from saving again

        this.isFormSubmitted = true;
        this.RemoveValidation();
        try {
          if (this.request.TypeID == 9 && this.request.PartitionSize < 0)
            return;
          if (this.SerialMasterFromGroup.invalid) {
            return
          }
          this.isLoading = true;
          if (this.request.TypeID == EnumConfigurationType.CCCode) {
            if (Number(this.request.CCcodeLength) < 0) {
              this.toastr.warning("CC Increment Value must be More than 0!");
              return
            }
            if (this.request.CCcodeLength !== undefined && this.request.CCcodeLength.toString().length > 2) {
              this.toastr.warning("CC Increment Value must be less than 2 digit!");
              return
            }
          }

          this.loaderService.requestStarted();
          await this.mstConfigService.SaveSerialData(this.request)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              if (data.State == EnumStatus.Success)
              {
                this.toastr.success(this.Message);
                this.GetAllData();
                this.ResetControls();
              }
              else if (data.State == EnumStatus.Warning)
              {
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

  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      //if (this.sSOLoginDataModel.RoleID == EnumRole.Admin)
      //{
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
/*    }*/
    catch (Ex) {
      console.log(Ex);
    }
  }

  startTimer(): void {
    this.showResendButton = false;
    this.timeLeft = GlobalConstants.DefaultTimerOTP * 60;


    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
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


  async openModalGenerateOTP(content: any, item: SerialMasterConfigurationModel)
  {
    this.isFormSubmitted = true;
    this.RemoveValidation();
    if (this.SerialMasterFromGroup.invalid) {
      return
    }
    if (this.request.TypeID == EnumConfigurationType.GroupCode && this.request.PartitionSize < 0) {
      return;
    }
    if (this.request.TypeID == EnumConfigurationType.CCCode) {
      if (Number(this.request.CCcodeLength) < 0) {
        this.toastr.warning("CC Increment Value must be More than 0!");
        return
      }
      if (this.request.CCcodeLength !== undefined && this.request.CCcodeLength.toString().length > 2) {
        this.toastr.warning("CC Increment Value must be less than 2 digit!");
        return
      }
    }

    this.OTP = '';
    //this.MobileNo = this.sSOLoginDataModel.Mobileno;
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



  //async SaveData() {

  //  // ✅ Skip saving if already saved via OTP
  //  if (this.isOtpSave) {
  //    this.isOtpSave = false; // reset after first skip
  //    return;
  //  }
  //  this.isFormSubmitted = true;
  //  this.RemoveValidation();

  //  try {
  //    this.isLoading = true;
  //    this.loaderService.requestStarted();
  //    await this.mstConfigService.SaveSerialData(this.request)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (data.State == EnumStatus.Success) {
  //          this.toastr.success(this.Message);
  //          this.GetAllData();
  //          this.ResetControls();
  //        }
  //        else if (data.State == EnumStatus.Warning) {
  //          this.toastr.warning(this.ErrorMessage);
  //          //this.GetAllData();
  //          this.ResetControls();
  //        }
  //        else {
  //          this.toastr.error(this.ErrorMessage)
  //        }
  //      }, (error: any) => console.error(error)
  //      );
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


  async GetAllData() {
    try {

      this.loaderService.requestStarted();
      this.request.RoleID = this.RoleID
      await this.mstConfigService.GetAllSerialData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State']; this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SerialConfigList = data['Data'];
          console.log(this.SerialConfigList = data['Data'])
          //table feature load
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
  //      this.TypeMasterDDL = data.Data.filter((item: any) => ([1, 7, 8, 9, 10, 11, 12, 13]).includes(item.ID)); data.Data;
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

  async GetConfigType() {

    try {

      this.RoleID = this.sSOLoginDataModel.RoleID;
      await this.commonMasterService.GetConfigurationType(this.RoleID, EnumConfigTypeTabs.Serial_Tab).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TypeMasterDDL = data.Data;

      }, (error: any) => console.error(error))
    }
    catch (ex) {
      console.log(ex);
    }
  }

  ShowValidColumn() {
    return this.TypeMasterDDL.filter(function (x) { return (x.ID == EnumConfigurationType.ApplicationNo || x.ID == EnumConfigurationType.ChallanNo) }).length > 0;
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
  async ResetControls() {
    this.isFormSubmitted = false
    this.SerialMasterFromGroup.reset()
    this.request = new SerialMasterConfigurationModel()
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.request.StaticVal = '';
    this.isOtpSave = false; // ✅ Reset the flag
  }

  async btnEdit_OnClick(ID: number) {
    this.isFormSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.mstConfigService.GetSerialByID(ID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'];

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async btnDelete_OnClick(ID: number) {
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {
      if (result.isConfirmed) {
        this.isFormSubmitted = false;
        try {
          this.loaderService.requestStarted();
          await this.mstConfigService.DeleteSerialByID(ID)
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

  ddlTypeChange() {
    this.request.StaticVal = '';
    if (this.request.TypeID == 9) {
      this.SerialMasterFromGroup.controls['partitionSize'].setValidators([Validators.required]);
    }
    else {
      this.SerialMasterFromGroup.controls['partitionSize'].clearValidators();
    }
    this.SerialMasterFromGroup.controls['partitionSize'].updateValueAndValidity();


  }


  RemoveValidation() {
    //validatiion
    if (this.request.TypeID == EnumConfigurationType.ApplicationNo || this.request.TypeID == EnumConfigurationType.ChallanNo || this.request.TypeID == EnumConfigurationType.CCCode) {
      this.SerialMasterFromGroup.controls['ddlSemester'].clearValidators();
    }
    else {
      this.SerialMasterFromGroup.controls['ddlSemester'].setValidators([DropdownValidators]);
    }

    this.SerialMasterFromGroup.controls['ddlSemester'].updateValueAndValidity();


    if (this.request.TypeID != EnumConfigurationType.CCCode) {
      this.SerialMasterFromGroup.controls['txtlength'].clearValidators();

    } else {
      this.SerialMasterFromGroup.controls['txtlength'].setValidators([DropdownValidators])
    }
    this.SerialMasterFromGroup.controls['txtlength'].updateValueAndValidity();
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
    this.paginatedInTableData = [...this.SerialConfigList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.SerialConfigList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.SerialConfigList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.SerialConfigList.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.SerialConfigList.forEach((x: any) => {
      x.Selected = this.AllInTableSelect;
    });
  }




  // end table feature
}


