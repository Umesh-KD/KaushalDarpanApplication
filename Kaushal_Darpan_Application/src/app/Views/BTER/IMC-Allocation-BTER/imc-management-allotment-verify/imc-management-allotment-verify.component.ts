import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { BTERIMCAllocationDataModel, BTERIMCAllocationSearchModel } from '../../../../Models/BTERIMCAllocationDataModel';
import { IMCManagementAllotmentService } from '../../../../Services/BTER/IMC-Management-Allotment/imc-management-allotment.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { CookieService } from 'ngx-cookie-service';
import { EnumDepartment, EnumStatus, GlobalConstants, enumExamStudentStatus } from '../../../../Common/GlobalConstants';

@Component({
  selector: 'app-imc-management-allotment-verify',
  standalone: false,
  
  templateUrl: './imc-management-allotment-verify.component.html',
  styleUrl: './imc-management-allotment-verify.component.css'
})
export class IMCManagementAllotmentVerifyComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isUpdate: boolean = false;
  searchText: string = '';
  public IMCAllocationModel: BTERIMCAllocationDataModel[] = [];
  request = new BTERIMCAllocationDataModel()
  public searchRequest = new BTERIMCAllocationSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  public ApplicationIdS: string | null = null;
  public ApplicationId: number | null = null;
  public StudentVerifyPhoneData: any = [];
  public DirectAdmissionTypeList: any = [];
  public AllotedCategoryTypeList: any = [];
  public StudentOptinalTradeList: any = [];
  public StudentDetailsList: any = [];
  public ShiftUnitList: any = [];
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public NewMobileNo: string = '';
  public DetailsBox: boolean = false;
  public ApplicationAlloted: boolean = true;
  public TradeBox: boolean = false;
  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference

  constructor(
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private IMCManagementAllotmentService: IMCManagementAllotmentService,
    private sMSMailService: SMSMailService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {
  }

  async ngOnInit() {

    this.routers.paramMap.subscribe(params => {
      this.ApplicationIdS = params.get('id')
    });

    //this.ApplicationId = parseInt(this.ApplicationIdS);

    //alert(this.ApplicationIdS);

    if (this.ApplicationIdS) {
      this.searchRequest.ApplicationID = parseInt(this.ApplicationIdS);
      await this.getAllDataList();
      this.isUpdate = true
    }


  }


  async getAllDataList() {
    try {
      this.loaderService.requestStarted();
      this.TradeBox = false;
      this.DetailsBox = true;
      await this.IMCManagementAllotmentService.GetAllDataPhoneVerify(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentVerifyPhoneData = data['Data'];
          this.request.MobileNo = data['Data'][0].MobileNo;
          this.request.ApplicationID = data['Data'][0].ApplicationID;
          this.request.TradeLevel = data['Data'][0].ApplicationID;
          //alert(this.StudentVerifyPhoneData[0].ApplicationVerified);
          if (this.StudentVerifyPhoneData[0].ApplicationVerified !== 0) {
            this.ApplicationAlloted = false;
          }
          //this.GetTradeListByCollege();
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

  async GetStudentDetailsList() {
    try {
      this.loaderService.requestStarted();
      await this.IMCManagementAllotmentService.StudentDetailsList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentDetailsList = data['Data'];
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


  async UpdateMobileNo() {
    if (this.NewMobileNo.length === 10) {
      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      try {
        this.loaderService.requestStarted();
        await this.IMCManagementAllotmentService.UpdateMobileNo(this.request)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State == EnumStatus.Success) {
              this.toastr.success('Student Allotment Successfully');
              //Set User cookie
              //localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
              window.open("/ITIIMCVerifyStudentPhone/" + this.request.ApplicationID, "_self");
            }
            else {
              this.toastr.success(data.Message);
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
    else {
      this.toastr.warning('Please Enter 10 Digits Mobile No');
    }
  }


  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          this.DetailsBox = false;
          this.TradeBox = true;
          this.CloseModal();
          this.GetStudentDetailsList();
          this.GetTradeListByCollege();

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
      else {
        this.toastr.error('Invalid OTP Please Try Again');
      }
    }
    else {
      this.toastr.warning('Please Enter OTP');
    }
  }



  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
    
      this.request.MobileNo = this.sSOLoginDataModel.Mobileno;

      await this.sMSMailService.SendMessage(this.request.MobileNo, "OTP")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.startTimer();
            //open modal popup
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
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }




  async GetTradeListByCollege() {
    try {
      this.loaderService.requestStarted();//this.sSOLoginDataModel.InstituteID;

      await this.IMCManagementAllotmentService.GetBranchListByCollege(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentOptinalTradeList = data['Data'];
          // alert(this.request.MobileNo);
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


  async TradeWithAllot(content: any, CollegeTradeID: number, SeatMetrixId: number, AllotedCategory: string) {
    //alert(CollegeTradeID);
    //alert(AllotedCategory);
    this.request.CollegeTradeID = CollegeTradeID;
    this.request.SeatMetrixId = SeatMetrixId;
    this.searchRequest.CollegeTradeID = CollegeTradeID;
    this.request.AllotedCategory = AllotedCategory;

    try {
      this.loaderService.requestStarted();
      await this.IMCManagementAllotmentService.ShiftUnitList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ShiftUnitList = data['Data'];
          //this.GetTradeListByCollege();
          // alert(this.request.MobileNo);
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




    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });


    //this.openModalChangeMobileNo("abc");
  }


  async SaveTradeWithAllot() {
    try {
      this.loaderService.requestStarted();
      await this.IMCManagementAllotmentService.UpdateAllotments(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.getAllDataList();
            this.toastr.success('Student Allotment Successfully');
            this.resetOTPControls();
            this.CloseModal();
          }
          else {
            this.toastr.success(data.Message);
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

  //Start Section Model
  async openModalGenerateOTP(content: any) {
    this.OTP = '';
    this.MobileNo = '';
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = this.request.MobileNo;
    this.SendOTP();
  }
  async openModalChangeMobileNo(content: any) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  resetOTPControls() {
    this.OTP = "";
    this.GeneratedOTP = "";

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
  //Modal Section END



}
