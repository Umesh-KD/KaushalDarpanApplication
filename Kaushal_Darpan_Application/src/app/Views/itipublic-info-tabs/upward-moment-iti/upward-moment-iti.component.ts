import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ItiStuAppSearchModelUpward, UpwardMoment } from '../../../Models/CommonMasterDataModel';
import { AllotmentStatusSearchModel } from '../../../Models/BTER/BTERAllotmentStatusDataModel';
import { EmitraApplicationstatusModel } from '../../../Models/EmitraApplicationstatusDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ApplicationStatusService } from '../../../Services/ApplicationStatus/EmitraApplicationStatus.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { CookieService } from 'ngx-cookie-service';
import { UpwardMovementService } from '../../../Services/UpwardMovement/upward-movement.service';
import { AllotmentStatusService } from '../../../Services/BTER/BTERAllotmentStatus/allotment-status.service';
import { EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';

@Component({
  selector: 'app-upward-moment-iti',
  templateUrl: './upward-moment-iti.component.html',
  styleUrl: './upward-moment-iti.component.css',
  standalone: false
})
export class UpwardMomentITIComponent {
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public sSoLoginDataModel = new SSOLoginDataModel();
  public request = new UpwardMoment();
  public searchRequest = new ItiStuAppSearchModelUpward();
  public searchRequest1 = new AllotmentStatusSearchModel();
  public isShowGrid: boolean = false;
  public StudentDetailsModelList: EmitraApplicationstatusModel[] = []
  closeResult: string | undefined;
  public isOnStatus = false;

  constructor(
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private commonservice: CommonFunctionService,
    public appsettingConfig: AppsettingService,
    private studentService: ApplicationStatusService,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService,
    private cookieService: CookieService,
    private cdRef: ChangeDetectorRef,
    private upwardMovementService: UpwardMovementService,
    private allotmentStatusService: AllotmentStatusService
  ) { }
  async ngOnInit() {
    this.sSoLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSoLoginDataModel.UserID;
    await this.GetPublicInfoStatus();
  }


  async GetPublicInfoStatus() {
    try {
      await this.commonservice.GetPublicInfoStatus(2)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.Data[0].IsOnAllotmentStatus == 1) {
            this.isOnStatus = true;
          } else {
            this.isOnStatus = false;
          }
          //IsOnKnowMerit, 1 IsOnAllotmentStatus, 1 IsOnUpwardMovement

        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {

      }, 200);
    }
  }


  async ITIUpwardMomentUpdate() {

    try {
      this.loaderService.requestStarted();
      console.log("this.request", this.request);
      await this.upwardMovementService.ITIUpwardMomentUpdate(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.request = new UpwardMoment();
          this.CloseModal();
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  ResetControl() {
    this.searchRequest = new ItiStuAppSearchModelUpward()
  }
  async onSearchClickAllotListITI() {

    this.isShowGrid = false;

    try {
      this.loaderService.requestStarted();
      //this.this.StudentDetailsModelList = [];
      //this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest1.DepartmentId = 2;
      await this.allotmentStatusService.GetITIAllotmentUpwardList(this.searchRequest1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {


            if (data.Data[0].Status == 1) {

              this.StudentDetailsModelList = data['Data'];

              if (this.StudentDetailsModelList.length > 0) {
                this.isShowGrid = true;
              } else {
                this.isShowGrid = false;
              }

            } else {
              this.toastr.error(data.Data[0].MSG);
            }
          } else {
            //this.toastr.error(data.ErrorMessage || 'Error fetching data.');
          }
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
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


  async onSearchClick2() {
    this.isShowGrid = true;

    this.searchRequest.action = "_GetApplicationForUpward";
    this.searchRequest.DepartmentID = EnumDepartment.ITI
    this.StudentDetailsModelList = [];
    try {
      this.loaderService.requestStarted();

      console.log("this.searchRequest", this.searchRequest);
      await this.upwardMovementService.GetDataItiUpwardMoment(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("data", data)
          if (data.State == EnumStatus.Success) {
            this.StudentDetailsModelList = data['Data'];
            console.log("StudentDetailsModelList", this.StudentDetailsModelList)
          } else if (data.State == EnumStatus.Warning) {
            this.toastr.warning("You are not alloted any college");
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

  async openModal(content: any, row: any) {

    console.log("row", row);
    this.request.ApplicationID = row.ApplicationID;
    this.request.IsUpward = row.Upward;
    this.request.AllotmentId = row.AllotmentId;
    if (row.Upward == true) {
      this.toastr.error("You have alreay applied for upward movement")
    } else {
      this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  openSubmitOTP(content: any, row: any) {
    this.childComponent.MobileNo = row.MobileNo;
    this.CloseModal();
    this.childComponent.OpenOTPPopup();
    var th = this;
    this.toastr.success('OTP sent successfully to student mobile no');
    this.childComponent.onVerified.subscribe(() => {
      th.openModal(content, row);
    });
  }



}

