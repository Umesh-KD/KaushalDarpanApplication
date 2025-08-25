import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants, EnumConfigTypeTabs, EnumStatus, EnumRole } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { DateConfigurationModel } from '../../../Models/DateConfigurationDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import * as XLSX from 'xlsx';
import { UserMasterService } from '../../../Services/UserMaster/user-master.service';
import { DateConfigService } from '../../../Services/DateConfiguration/date-configuration.service';
import { AllotmentConfigurationService } from '../../../Services/Allotment-Configuration/allotment-configuration.service';
import { AllotmentConfigurationModel, ListAllotmentConfigurationModel } from '../../../Models/AllotmentConfigurationDataModel';

@Component({
  selector: 'app-allotment-configuration',
  standalone: false,
  templateUrl: './allotment-configuration.component.html',
  styleUrl: './allotment-configuration.component.css'
})
export class AllotmentConfigurationComponent implements OnInit, OnDestroy {

  public isFormSubmitted: boolean = false;
  public isLoading: boolean = false;
  public request = new AllotmentConfigurationModel();
  public AllListConfiguration: ListAllotmentConfigurationModel[] = [];
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public Table_SearchText: string = '';
  public TypeMasterDDL: any[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();

  public DateConfigList: any = []
  public DateConfigValidationList: any = []
  public SemesterList: any = [];
  public StreamList: any = [];
  public todayDate: any;

  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';

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
  //end table feature default


  //Modal Boostrap.
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  constructor(
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private DateConfigService: DateConfigService,
    private allotmentConfigurationService: AllotmentConfigurationService,
    private Swal2: SweetAlert2,
    private sMSMailService: SMSMailService,
    private userMasterService: UserMasterService

  ) { }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID
    this.request.RoleID = this.sSOLoginDataModel.RoleID
    this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID



    this.todayDate = new Date().toISOString().substring(0, 16);
    /*   this.request.CourseTypeID = this.sSOLoginDataModel.*///eng non engnerring course type

    /*    await this.GetAppointExaminerList()*/
    await this.GetConfigType()
    await this.GetAllData()
    await this.GetSemesterMasterDDL()
    await this.GetSreamMasterDDL()

    //await this.GetUserMobileNoForOTP()
  }
  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.interval) {
      clearInterval(this.interval);
    }
  }




  async GetConfigType() {

    try {

      this.RoleID = this.sSOLoginDataModel.RoleID;
      await this.commonMasterService.GetConfigurationType(this.RoleID, EnumConfigTypeTabs.Date_Tab).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TypeMasterDDL = data.Data;

      }, (error: any) => console.error(error))
    }
    catch (ex) {
      console.log(ex);
    }
  }

  disableKeys(event: KeyboardEvent) {
    const blockedKeys = ['ArrowUp', 'ArrowDown', 'e'];
    if (blockedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }



  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {

        
        try {
          //this.request = item

          if (this.request.ConfigurationID == 148) {
            this.request.To_Date = this.request.From_Date;
          }

          if (!this.request.From_Date || this.request.From_Date.trim() === '' || !this.request.To_Date || this.request.To_Date.trim() === '') {
            this.toastr.warning("Please Select Date");
            return;
          }
          this.isLoading = true;
          this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
          this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
          this.request.EndTermID = this.sSOLoginDataModel.EndTermID;


          this.request.TypeID = this.request.TypeID == null ? 1 : this.request.TypeID;
          this.request.CourseSubTypeID = this.sSOLoginDataModel.Eng_NonEng; //this.request.CourseSubTypeID == null ? 1 : this.request.CourseSubTypeID;
          this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng; //this.request.CourseTypeID == null ? 1 : this.request.CourseTypeID;

          await this.allotmentConfigurationService.SaveData(this.request)
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
                this.GetAllData();
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


  async VerifyOTPForList() {
    
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {

        try {

          //let config1ToDate: Date | null = null;

          //for (let i = 0; i < this.DateConfigList.length; i++) {
          //  const item = this.DateConfigList[i];
          //  const fromDate = new Date(item.From_Date);
          //  const toDate = new Date(item.To_Date);

          //  if (item.ConfigurationID === 1) {
          //    // Condition 1: To_Date >= From_Date
          //    if (toDate < fromDate) {
          //      this.toastr.warning(`For ConfigurationID 1 at index ${i + 1}, To Date cannot be before From Date.`);
          //      return;
          //    }

          //    config1ToDate = toDate;
          //  }

          //  // Condition 2: If ConfigurationID is 1 or 18 and config1ToDate is already set

          //  if ((item.ConfigurationID === 1 || item.ConfigurationID === 43) && config1ToDate) {
          //    if (fromDate < config1ToDate) {
          //      this.toastr.warning(`For Type Name is ${item.Name}  From Date must be greater then ${item.From_Date} to date ${item.To_Date}.`);
          //      return;
          //    }
          //  }
          //}

          this.DateConfigList = this.DateConfigList.filter((item: any) =>
            item && Object.keys(item).length > 0
          );

          if (this.DateConfigList.length > 0) {

            this.DateConfigList.forEach((e: any) => {
              e.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
              e.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
              e.DepartmentID = this.sSOLoginDataModel.DepartmentID;
              e.EndTermID = this.sSOLoginDataModel.EndTermID;
            });

            const selected = this.DateConfigList.filter((e: any) => e.From_Date != null && e.From_Date != '')

            await this.allotmentConfigurationService.AllSaveUpdateData(selected)
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
                  this.GetAllData();
                  this.ResetControls();
                }
                else {
                  this.toastr.error(this.ErrorMessage)
                }
              }, (error: any) => console.error(error)
              );
            this.CloseModal()
          }
          else {
            this.toastr.warning('No valid configuration data to save. Please Fill Date First');
            return;
          }
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
      //if (this.sSOLoginDataModel.RoleID == EnumRole.Admin) {
      //  this.sSOLoginDataModel.Mobileno = "7568622727";

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
   // }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async SendOTPForList(isResend?: boolean) {
    try {
      debugger;
      this.GeneratedOTP = "";
      //if (this.sSOLoginDataModel.RoleID == EnumRole.Admin)
      //{
     // if (this.sSOLoginDataModel.Mobileno) {
        //this.sSOLoginDataModel.Mobileno = "7568622727";

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
    //}
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


  async openModalGenerateOTP(content: any, item: AllotmentConfigurationModel) {
    debugger
    this.isFormSubmitted = true;
    this.request = item;

    if (this.request.ConfigurationID == 148) {
      this.request.To_Date = this.request.From_Date;
    }


    if (!this.request.From_Date || this.request.From_Date.trim() === '' || !this.request.To_Date || this.request.To_Date.trim() === '') {
      this.toastr.warning("Please Select Date");
      return;
    }

    this.OTP = '';
    this.MobileNo = '';
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = this.sSOLoginDataModel.Mobileno;
    this.request = item;
    this.SendOTP();
  }

  async openModalGenerateOTPForList(content: any) {
    
    this.isFormSubmitted = true;
    this.OTP = '';
    this.MobileNo = '';
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = this.sSOLoginDataModel.Mobileno;
    this.SendOTPForList();
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


  async SaveData(item: any) {
    try {
      
      this.request = item
      if (!this.request.From_Date || this.request.From_Date.trim() === '' || !this.request.To_Date || this.request.To_Date.trim() === '')
      {
        this.toastr.warning("Please Select Date");
        return;
      }
      this.isLoading = true;
      this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;


      this.request.TypeID = this.request.TypeID == null ? 1 : this.request.TypeID;
      this.request.CourseSubTypeID = this.request.CourseSubTypeID == null ? 1 : this.request.CourseSubTypeID;
      this.request.CourseTypeID = this.request.CourseTypeID == null ? 1 : this.request.CourseTypeID;

      await this.allotmentConfigurationService.SaveData(this.request)
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
            this.GetAllData();
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
  }

  async AllSaveUpdateData() {
    try {


      this.DateConfigList.forEach((e: any) => {
        e.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
        e.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        e.EndTermID = this.sSOLoginDataModel.EndTermID;
      });

      await this.allotmentConfigurationService.AllSaveUpdateData(this.DateConfigList)
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
            this.GetAllData();
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
  }

  

  async GetSemesterMasterDDL() {
    try {
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterList = data.Data;
        }, (error: any) => console.error(error))
    }
    catch (ex) {
      console.log(ex);
    }
  }
  async GetSreamMasterDDL() {
    try {
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamList = data.Data;
        }, (error: any) => console.error(error))
    }
    catch (ex) {
      console.log(ex);
    }
  }
  async GetAllData() {
    try {
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.RoleID = this.sSOLoginDataModel.RoleID;
      this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      await this.allotmentConfigurationService.GetAllData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DateConfigList = data['Data'];
          this.DateConfigValidationList = data['Data'];
          console.log(this.DateConfigList,"DateConfigList")
          //this.request.From_Date = data['Data'][0]['From_Date'];
          //this.request.To_Date = data['Data'][0]['To_Date'];
          //this.request.DateConfigID = data['Data'][0]['DateConfigID'];

          console.log(this.request.From_Date,"dataataa")
          //table feature load
          //this.loadInTable();
          //end table feature load
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async ResetControls() {
    this.isFormSubmitted = false
    this.request = new DateConfigurationModel()
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID
    this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
  }
  

  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.DateConfigList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }

}
