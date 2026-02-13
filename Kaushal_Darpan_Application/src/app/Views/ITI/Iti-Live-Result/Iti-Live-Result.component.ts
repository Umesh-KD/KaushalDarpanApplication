import { Component, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ExamLiveResultModel } from '../../../Models/ITI/ITI_ResultModel';
import { ITIResultService } from '../../../Services/ITIResult/iti-result.service';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';

@Component({
  selector: 'app-Iti-Live-Result',
  standalone: false,
  templateUrl: './Iti-Live-Result.component.html',
  styleUrl: './Iti-Live-Result.component.css'
})
export class ItiLiveResultComponent {
  public isSubmitted: boolean = false;
  public ItiCollegesListAll: any = [];
  public ExamLiveSearchRequest = new ExamLiveResultModel()
  public otpRequest = new ExamLiveResultModel()
  public isLoading: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public _EnumRole = EnumRole

  liveResultDataList: any[] = [];
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public OTP: string = '';
  public MobileNo: string = '';
  public GeneratedOTP: string = '';
  closeResult: string | undefined;
  public showResendButton: boolean = false;
  timeLeft: number = GlobalConstants.DefaultTimerOTP;
  private interval: any;

  constructor(
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private itiResult: ITIResultService,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService,  
  ) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.getliveResultData();
  }


  async getliveResultData() {
    debugger
    try {
      this.loaderService.requestStarted();
      this.ExamLiveSearchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.ExamLiveSearchRequest.UserID = this.sSOLoginDataModel.UserID;
      this.ExamLiveSearchRequest.Action = "GetList";
      await this.itiResult.GetExamLiveResult(this.ExamLiveSearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.liveResultDataList = data['Data'];
          console.log('live Result Data List ===>', this.liveResultDataList)
          
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

  async LiveResult() {

    //this.Swal2.Confirmation("Are you sure to change status?", async (result: any) => {

    //  if (!result.isConfirmed) return;

      try {

        this.loaderService.requestStarted();

        this.ExamLiveSearchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
        this.ExamLiveSearchRequest.UserID = this.sSOLoginDataModel.UserID;
        this.ExamLiveSearchRequest.Action = "UpdateResultStatus";

       
        await this.itiResult.GetExamLiveResult(this.ExamLiveSearchRequest)
         .then((data: any) => {
           this.State = data['State'];
           this.Message = data['Message'];
           this.ErrorMessage = data['ErrorMessage'];
              if (this.State == EnumStatus.Success)
              {
                this.toastr.success('Status Changed Successfully');
              }
         }, error => console.error(error));
            this.getliveResultData();
          } catch (error) {
            console.error(error);
          } finally {
            this.loaderService.requestEnded();
      }

     

   // });
  }


  async openOTPModal_LiveResult() {
    this.Swal2.Confirmation("Are you sure to change status?", async (result: any) => {

      if (!result.isConfirmed) return;

    debugger
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    await this.childComponent.OpenOTPPopup();
    await this.childComponent.waitForVerification();

    await this.LiveResult();

    });
  }


}
