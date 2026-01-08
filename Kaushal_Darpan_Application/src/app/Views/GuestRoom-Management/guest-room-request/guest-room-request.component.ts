import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { GuestRoomManagmentService } from '../../../Services/GuestRoomManagment/GuestRoomManagment.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumRole, EnumStatus, GlobalConstants, EnumConfigurationType, EnumFeeFor, EnumUserType } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { GuestApplyForGuestRoomDataModel, GuestApplyForGuestRoomSearchModel, GuestHousePaymentDataModel } from '../../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';
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

@Component({
  selector: 'app-guest-room-request',
  standalone: false,
  templateUrl: './guest-room-request.component.html',
  styleUrl: './guest-room-request.component.css'
})
export class GuestRoomRequestComponent {

  GrievanceFormGroup!: FormGroup;
  groupForm!: FormGroup;
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
  request = new GuestApplyForGuestRoomDataModel()
  approveRequest = new GuestApplyForGuestRoomDataModel()
  searchRequest = new GuestApplyForGuestRoomSearchModel();
  RequestList: any = [];
  statusList: any = [];
  filteredStatusList: any = [];
  modalReference: NgbModalRef | undefined;
  GetStatusID: number = 0;
  _EnumRole = EnumRole;
  displayedColumns: string[] = [
    'SNo', 'RequestName', 'RoleNameEnglish', 'DepartmentName', 'InstituteName',
    'EmplDCardPhoto', 'FromDate', 'FromTime', 'ToDate', 'ToTime', 'StatusName','Remark', 'Action'
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


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

    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GuestRequestList();
    await this.commonMaster();
    this.GetStatusID = Number(this.route.snapshot.paramMap.get('Status')) || 0;
    this.searchRequest.Status = this.GetStatusID;
    if (this.GetStatusID != 0) {
      await this.GuestRequestList();
    }

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    
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
    debugger
    try {
      this.loaderService.requestStarted();
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      await this._GuestRoomManagmentService.GuestRequestList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
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

      if (this.request.Status === 1339) {
        this.request.Status = 220;
      } else if(this.request.Status === 220) {
        this.request.Status = 219;
      } else {
        this.toastr.error("Invalid Action")
      }
      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;

      try {
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
        await this._GuestRoomManagmentService.updateReqStatusCheckInOut(this.request)
          .then(async (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == EnumStatus.Success) {
              this.CloseModal();
              this.GuestRequestList();
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

  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.request.Status = 0;
    this.request.Remark = '';
    this.isSubmitted = false;
  }

  async updateReqStatus() {
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      await this._GuestRoomManagmentService.updateReqStatus(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.CloseModal();
            this.GuestRequestList();
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
    debugger
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
      debugger
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
    debugger
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
    debugger;
    await this.proceedToSave();
    debugger
    if (this.saveFlag == 0) {
      return;
    }
    debugger
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

    debugger;

    this.loaderService.requestStarted();
    try {
      await this.emitraPaymentService.EnrollmentExaminationFeePayment(this.emitraRequest)
        .then(async (data: any) => {
          debugger;
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

  // vivek start
  async proceedToSave() {
    debugger
    this.isLoading = true;
    try {
      debugger;

      this.otpRequest.CreatedBy = this.sSOLoginDataModel.UserID;
      this.otpRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.otpRequest.GuestHouseID = this.otpRequest.GuestHouseID;
      this.otpRequest.RoomFee = this.otpRequest.RoomFee;
      this.otpRequest.IsActive = true;
      this.otpRequest.IsDelete = false;

      await this._GuestRoomManagmentService.SaveGuestRoomPayment(this.otpRequest)
        .then(async (data: any) => {
          debugger;
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



}
