import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { GuestRoomManagmentService } from '../../../Services/GuestRoomManagment/GuestRoomManagment.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumRole, EnumStatus, GlobalConstants, EnumConfigurationType, EnumFeeFor, EnumUserType, EnumMessageType } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CheckInDataModel, GuestApplyForGuestRoomDataModel, GuestApplyForGuestRoomSearchModel, GuestHousePaymentDataModel, GuestStaffProfileSearchModel } from '../../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApplyDuplicateDocument } from '../../../Models/BTER/ApplyDuplicateDocDataModel';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EmitraRequestDetails } from '../../../Models/PaymentDataModel';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { ApplyDuplicateDocService } from '../../../Services/ApplyDuplicateDoc/ApplyDuplicateDoc.service';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { ApplicationMessageDataModel } from '../../../Models/ApplicationMessageDataModel';

@Component({
  selector: 'app-guest-room-request',
  standalone: false,
  templateUrl: './guest-room-request.component.html',
  styleUrl: './guest-room-request.component.css'
})
export class GuestRoomRequestComponent {

  GrievanceFormGroup!: FormGroup;
  groupForm!: FormGroup;
  CheckInFormGroup!: FormGroup;
  public IIPMasterFormGroup!: FormGroup;
  GFID: number | null = null;
  isUpdate: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  Table_SearchText: string = "";
  tbl_txtSearch: string = '';
  State: number = -1;
  Message: any = [];
  ErrorMessage: any = [];
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  IsShowForm: boolean = false;
  isSubmit: boolean = false;
  SSOIDExists: boolean = false;
  isCheckedIn: boolean = false;
  request = new GuestApplyForGuestRoomDataModel()
  checkInRequest = new CheckInDataModel()
  public requestReservedCheckIn = new GuestApplyForGuestRoomDataModel()
  approveRequest = new GuestApplyForGuestRoomDataModel()
  searchRequest = new GuestApplyForGuestRoomSearchModel();
  public messageModel = new ApplicationMessageDataModel();
  public searchRequestGuestStaffProfileSearchModel = new GuestStaffProfileSearchModel()
  RequestList: any = [];
  statusList: any = [];
  RoomNoList: any = [];
  filteredStatusList: any = [];
  modalReference: NgbModalRef | undefined;
  public SSOIDFormGroup!: FormGroup;
  GetStatusID: number = 0;
  _EnumRole = EnumRole;
  displayedColumns: string[] = [
    'SNo', 'RequestName', 'RoleNameEnglish', 'DepartmentName', 'InstituteName',
    'EmplDCardPhoto', 'FromDate', 'FromTime', 'ToDate', 'ToTime', 'StatusName','Remark', 'Action'
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  public showCheckIn: boolean = false
  public departmentFlag: string = 'BTER';
  public saveFlag: number = 1;
  public otpRequest = new GuestHousePaymentDataModel();
  public OTP: string = '';
  public MobileNo: string = '';
  public GeneratedOTP: string = '';
  closeResult: string | undefined;
  public showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  private interval: any; // Holds the interval reference
  public InstituteMasterDDLList: any = [];
  emitraRequest = new EmitraRequestDetails();
  public PaymentDetailtList: any = [];
  public isMarksheet: boolean = false;
  public isMigration: boolean = false;
  public smsSendGuestHouseName: string = '';
  public smsCheckin_checkoutstatus: number = 0;
  public todayDate: string = this.formatDate(new Date());

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private _GuestRoomManagmentService: GuestRoomManagmentService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private modalService: NgbModal,    
    public appsettingConfig: AppsettingService,
    private sMSMailService: SMSMailService,
    private emitraPaymentService: EmitraPaymentService,
    private applyDuplicateDocService: ApplyDuplicateDocService,
  ) { }


  async ngOnInit() {    
    this.groupForm = this.fb.group({
      ddlStatus: [1, [DropdownValidators]],
      txtRemark: ['', Validators.required]
    });
    this.CheckInFormGroup = this.fb.group({
      GuestRoomDetailID: ['', [DropdownValidators]]
    });

    this.SSOIDFormGroup = this.fb.group({
      SSOID: ['', Validators.required]
    });
    this.IIPMasterFormGroup = this.fb.group(
      {
        DisplayName: ['', Validators.required],
        PostalCode: [''],
        MailPersonal: ['', Validators.required],
        MobileNo: ['', Validators.required],
        PostalAddress: [''],
        EmpID: ['', []],
        txtFromDate: ['', Validators.required],
        txtFromTime: [''],
        txtToDate: ['', Validators.required],
        txtToTime: [''],
        Reason: [''],
        txtRoomFee: [{ value: '', disabled: true }, Validators.required],
        ddlGuestHouseID: ['', Validators.required],
        Purpose: ['', [DropdownValidators]],
        GenderId: ['', [DropdownValidators]],
        CoolingFacilities: ['', [DropdownValidators]],
        txtRoomType: ['', Validators.required],
        txtSeatCapacity: ['', Validators.required],
        txtRoomQuantity: [{ value: '', disabled: true }, Validators.required]
      });
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequestGuestStaffProfileSearchModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequestGuestStaffProfileSearchModel.SSOID = this.sSOLoginDataModel.SSOID;
    await this.GuestRequestList();
    await this.commonMaster();
    this.GetStatusID = Number(this.route.snapshot.paramMap.get('Status')) || 0;
    this.searchRequest.Status = this.GetStatusID;
    if (this.GetStatusID != 0) {
      await this.GuestRequestList();
    }

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    
  }

  get _IIPMasterFormGroup() { return this.IIPMasterFormGroup.controls; }
  get _CheckInFormGroup() { return this.CheckInFormGroup.controls; }
  get _SSOIDFormGroup() { return this.SSOIDFormGroup.controls; }
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  async commonMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType("GuestRoomStatus")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.statusList = data['Data'];
          if(this.sSOLoginDataModel.RoleID === EnumRole.GuestHouseIncharge) {
            this.filteredStatusList = this.statusList.filter((item: { ID: number; }) => item.ID === 217 || item.ID === 218);
          } else if (this.sSOLoginDataModel.RoleID === EnumRole.GuestHouseAdmin) {
            this.filteredStatusList = this.statusList.filter((item: { ID: number; }) => item.ID === 1339 || item.ID === 218);
          }
          
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

  async GuestRequestList() {
    this.showCheckIn = false;
    if(this.searchRequest.Status == 9359) {
      if(this.searchRequest.FromDate == '' || this.searchRequest.ToDate == '') {
        this.toastr.error('Please select From Date and To Date');
        return;
      } else {
        this.showCheckIn = true;
      }
    }
    try {
      this.loaderService.requestStarted();
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID
      this.searchRequest.GuestHouseIDs = this.sSOLoginDataModel.GuestHouseID ?? ''
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      await this._GuestRoomManagmentService.GuestRequestList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.RequestList = data['Data'];

          console.log('List data ==>',this.RequestList)
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

  GuestRequestListCancel() {
    this.searchRequest.Status = 0;
    this.searchRequest.DepartmentID = 1;
    this.GuestRequestList();
  }

  async onSubmit(model: any, userSubmitData: any) {
    try {
      this.request = { ...userSubmitData };
      this.smsSendGuestHouseName = userSubmitData.GuestHouseName;
   
      this.request.Status = 0;
      this.request.Remark = '';
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  async CheckIn(userSubmitData: any) {
    try {
      this.request = { ...userSubmitData };
      this.smsSendGuestHouseName = userSubmitData.GuestHouseName;
      var RoomNo: string = ''

      if (this.request.Status === 1339) {
        this.request.Status = 220;
        RoomNo = this.RoomNoList.find((x: any) => x.GuestRoomDetailID == this.checkInRequest.GuestRoomDetailID)?.RoomNo
      } else if(this.request.Status === 220) {
        this.request.Status = 219;
      } else {
        this.toastr.error("Invalid Action")
      }

       this.smsCheckin_checkoutstatus = this.request.Status ?? 0;
      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.GuestRoomDetailID = this.checkInRequest.GuestRoomDetailID;
      debugger
      try {
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
        await this._GuestRoomManagmentService.updateReqStatusCheckInOut(this.request)
          .then(async (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == EnumStatus.Success) {
              
              // checkin and checkout send sms functionality
              await this.SendApplicationMessage(this.request.MobileNo, this.smsSendGuestHouseName, RoomNo, this.smsCheckin_checkoutstatus);
              this.CloseModal();
              await this.GuestRequestList();
             

              
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.Message)
            }
            else {
              this.toastr.error(this.ErrorMessage)
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
     
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async openOTPModal_CheckIn() {
    this.childComponent.MobileNo = this.request.MobileNo

    // await for open model
    await this.childComponent.OpenOTPPopup();

    // await OTP verification
    await this.childComponent.waitForVerification();

    // do work
    await this.CheckIn(this.request);
  }

  async openOTPModal_CheckOut(userSubmitData: any) {
    this.childComponent.MobileNo = userSubmitData.MobileNo

    // await for open model
    await this.childComponent.OpenOTPPopup();

    // await OTP verification
    await this.childComponent.waitForVerification();

    // do work
    await this.CheckIn(userSubmitData);
  }

  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.request.Status = 0;
    this.request.Remark = '';
    this.isSubmitted = false;
    this.smsCheckin_checkoutstatus = 0;
    this.smsSendGuestHouseName = "";
  }

  async updateReqStatus() {
    debugger
    this.isCheckedIn = true;
    if (this.groupForm.invalid) {
      this.toastr.error("Please enter required fields !");
      return
    }
    this.smsCheckin_checkoutstatus = this.request.Status ?? 0;
    try {
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      
      await this._GuestRoomManagmentService.updateReqStatus(this.request)
     
        .then(async (data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            
            
            debugger
            if (this.smsCheckin_checkoutstatus == 1339 && this.sSOLoginDataModel.RoleID == EnumRole.GuestHouseAdmin)
            {
              //admin approve send sms
              await this.SendApplicationMessage(this.request.MobileNo, this.smsSendGuestHouseName, "", this.smsCheckin_checkoutstatus);
            }

            this.CloseModal();
            this.CloseModal_CheckIn();

            this.GuestRequestList();
          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(data.Message)
          }
          else {
            this.toastr.error(data.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    
  }

  async ReqApproveByAdmin() {
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      await this._GuestRoomManagmentService.ReqApproveByAdmin(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.CloseModal();
            this.GuestRequestList();
          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(data.Message)
          }
          else {
            this.toastr.error(data.ErrorMessage)
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

  exportToExcel(): void {
    const unwantedColumns = ['GuestReqID','Dis_EmpIDCardPhoto','IDProofNo','EmplDCardPhoto','Dis_IDProofPhoto','IDProofPhoto','Status'];
    const filteredData = this.RequestList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'GuestRoomRequestList.xlsx');
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

  public isFormSubmitted: boolean = false;
  async openModalGenerateOTP(content: any, item: GuestHousePaymentDataModel) {
    this.isFormSubmitted = true;
    this.OTP = '';
    this.MobileNo = GlobalConstants.DefaultMobileNo.length > 0 ? GlobalConstants.DefaultMobileNo : '9529820615'; 
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = this.MobileNo;
    this.otpRequest = item;
    await this.SendOTP();
  }

  CloseModal1() {

    this.modalService.dismissAll();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  async SendOTP(isResend?: boolean) {
    try {
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


  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  getCircularReplacer() {
    const seen = new WeakSet();
    return (key: string, value: any) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    };
  }
   
  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        const errors: any[] = [];
        try {
         
          this.isLoading = true;
          this.loaderService.requestStarted();
          await this.PayApplicationFees();
          this.isLoading = false;
          this.loaderService.requestEnded();
          this.isFormSubmitted = false;
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

  async PayApplicationFees() {
    await this.proceedToSave();
    if (this.saveFlag == 0) {
      return;
    }
    this.emitraRequest = new EmitraRequestDetails();
    //Set Parameters for emitra
    this.emitraRequest.Amount = Number(this.otpRequest.RoomFee);
    this.emitraRequest.ServiceID = "2920";
    this.emitraRequest.ID = this.otpRequest?.UniqueServiceID ?? 0;
    this.emitraRequest.MobileNo = this.request.MobileNo
    this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;
    this.emitraRequest.DepartmentID = 1// this.request.DepartmentID;
    this.emitraRequest.CourseTypeID = 1 //this.request.CourseTypeID;
  
    if (this.sSOLoginDataModel.RoleID == EnumRole.Student || this.sSOLoginDataModel.UserType == EnumUserType.KIOSK) {
      this.emitraRequest.IsKiosk = true;
    }

    this.loaderService.requestStarted();
    try {
      await this.emitraPaymentService.EnrollmentExaminationFeePayment(this.emitraRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {

            this.PaymentDetailtList = data;
            await this.RedirectEmitraPaymentRequest(data.Data.MERCHANTCODE, data.Data.ENCDATA, data.Data.PaymentRequestURL)
          }
          else {
            let displayMessage = this.Message ?? this.ErrorMessage;
            this.toastr.error(displayMessage)
          }
        })
    }
    catch (ex) {

      console.log(ex)

    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async proceedToSave() {
    this.isLoading = true;
    try {

      this.otpRequest.CreatedBy = this.sSOLoginDataModel.UserID;
      this.otpRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.otpRequest.GuestHouseID = this.otpRequest.GuestHouseID;
      this.otpRequest.RoomFee = this.otpRequest.RoomFee;
      this.otpRequest.IsActive = true;
      this.otpRequest.IsDelete = false;

      await this._GuestRoomManagmentService.SaveGuestRoomPayment(this.otpRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {

            this.saveFlag = 1;
          }
        })

    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  RedirectEmitraPaymentRequest(pMERCHANTCODE: any, pENCDATA: any, pServiceURL: any) {

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", pServiceURL);

    //Hidden Encripted Data
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "ENCDATA");
    hiddenField.setAttribute("value", pENCDATA);
    form.appendChild(hiddenField);

    //Hidden Service ID
    var hiddenFieldService = document.createElement("input");
    hiddenFieldService.setAttribute("type", "hidden");
    hiddenFieldService.setAttribute("name", "SERVICEID");
    hiddenFieldService.setAttribute("value", this.emitraRequest.ServiceID);
    form.appendChild(hiddenFieldService);
    //Hidden Service ID
    var MERCHANTCODE = document.createElement("input");
    MERCHANTCODE.setAttribute("type", "hidden");
    MERCHANTCODE.setAttribute("name", "MERCHANTCODE");
    MERCHANTCODE.setAttribute("value", pMERCHANTCODE);
    form.appendChild(MERCHANTCODE);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  async openModal_CheckIn(model: any, userSubmitData: any) {
    try {
      this.request = { ...userSubmitData };
      await this.GetRoomTypeListData(this.request);
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async GetRoomTypeListData(request: any) {
    try {
      var dropdownReq: any = {}
      dropdownReq.GuestHouseID = request.GuestHouseID
      dropdownReq.CoolingFacilities = request.CoolingFacilities
      dropdownReq.RoomType = request.RoomType
      dropdownReq.GenderId = request.GenderId

      dropdownReq.action = "GetRoomForAllotment";

      await this._GuestRoomManagmentService.GuestHouse_Dropdowns(dropdownReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.RoomNoList = data['Data'];
      })
    } catch (error) {
      console.error(error);
    }
  }

  CloseModal_CheckIn() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.isCheckedIn = false;
    this.checkInRequest = new CheckInDataModel();
  }

  async SendApplicationMessage(MobileNo: string, GuestHouseName: string, RoomNo: string,Status : number) {
    try {
      debugger
      this.loaderService.requestStarted();
      this.messageModel.MobileNo = MobileNo;
      if (Status == 220 ) {
        this.messageModel.MessageType = EnumMessageType.GuestHouseCheckIn;
      }
      if (Status == 219) {
        this.messageModel.MessageType = EnumMessageType.GuestHouseCheckOut;
      }
      if (Status == 1339) {
        this.messageModel.MessageType = EnumMessageType.GuestHouseAdminApprove;
      }
      this.messageModel.ApplicationNo = RoomNo;
      this.messageModel.ApplicantName = GuestHouseName;
      await this.sMSMailService.SendApplicationMessage(this.messageModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            console.log('Message sent successfully', data);
          } else {
            console.log('Something went wrong', data);
          }
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async openModal_ReservedRoomCheckIn(model: any, userSubmitData: any) {
    try {
      // await this.GetRoomTypeListData(this.request);
      this.modalReference = this.modalService.open(model, { size: 'xl', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  CloseModal_ReservedRoomCheckIn() {
    this.modalService.dismissAll();
    this.modalReference?.close();
  }

  async CheckUserExists(SSOID: any) {
    if (SSOID.target.value != null) {
      debugger
      this.isSubmit = true;
      await this.commonMasterService.CheckSSOIDExists(SSOID.target.value, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.InstituteID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data.body));
          this.searchRequestGuestStaffProfileSearchModel.SSOID = SSOID.target.value;
          if (data['State'] === 1) {
            this.toastr.success(data.Message);
            this.SSOIDExists = true;
          } else {
            this.toastr.warning(data.Message);
            this.SSOIDExists = false;
          }
        }, error => console.error(error));
    }
  }

  async PostUserExists() {
    try {
      this.searchRequestGuestStaffProfileSearchModel.SSOID = this.SSOIDFormGroup.get('SSOID')?.value;
      await this._GuestRoomManagmentService.GuestStaffProfile(this.searchRequestGuestStaffProfileSearchModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if(data.State === EnumStatus.Success) {
            this.IsShowForm = true;
            this.requestReservedCheckIn.DepartmentName = this.sSOLoginDataModel.DepartmentName;
            this.requestReservedCheckIn.InstituteName = data['Data'][0]['InstituteName'];
            this.requestReservedCheckIn.CollegeID = data['Data'][0]['InstituteID'];
            this.requestReservedCheckIn.DisplayName = data['Data'][0]['DisplayName'];
            this.requestReservedCheckIn.FirstName = data['Data'][0]['DisplayName'];
            this.requestReservedCheckIn.State = data['Data'][0]['StateName'];
            this.requestReservedCheckIn.PostalCode = data['Data'][0]['Pincode'];
            this.requestReservedCheckIn.TelephoneNumber = data['Data'][0]['MobileNumber'];
            this.requestReservedCheckIn.MailPersonal = data['Data'][0]['Email'];
            this.requestReservedCheckIn.MobileNo = data['Data'][0]['MobileNumber'];
            this.requestReservedCheckIn.PostalAddress = data['Data'][0]['Address'];
            this.requestReservedCheckIn.UserID = data['Data'][0]['UserID'];
            this.requestReservedCheckIn.RequestSSOID = data['Data'][0]['SSOID'];
          } else if(data.State === EnumStatus.Error) {
            this.toastr.error(data.ErrorMessage);
          } else {
            this.toastr.warning(data.Message);
          }
        }, error => console.error(error));
    } catch (error) {
      console.error(error);
    }
  }
}
