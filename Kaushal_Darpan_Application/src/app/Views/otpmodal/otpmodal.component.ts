import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants, EnumStatus } from '../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import { SMSMailService } from '../../Services/SMSMail/smsmail.service';

@Component({
  selector: 'app-otpmodal',
  standalone: false,
  templateUrl: './otpmodal.component.html',
  styleUrl: './otpmodal.component.css'
})
export class OTPModalComponent {
  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;
  public sSOLoginDataModel = new SSOLoginDataModel();
  closeResult: string | undefined;
  @Input() MobileNo!: any;
  @Output() onVerified = new EventEmitter<void>();
  private modalRef: any;


  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  // public MobileNo: number = 0;
  public OTP: string = '';
  public GeneratedOTP: string = '';

  constructor(
    private modalService: NgbModal,
    private loaderService: LoaderService,
    private sMSMailService: SMSMailService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

  }

  formatMobileNo(mobile: string): string {
    if (mobile && mobile.length > 4) {
      // Mask the middle part and show the last 4 digits
      const masked = '********' + mobile.slice(-2);
      return masked;
    }
    return mobile;
  }

  CloseOTPModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async OpenOTPPopup() {
    if (this.modal_GenrateOTP) {

      await this.ViewOTPPopup(this.modal_GenrateOTP);
      await this.SendOTP();
    } else {
      console.warn("modal_GenrateOTP not found");
    }
  }

  // async ViewOTPPopup(content: any) { 

  //   this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  async ViewOTPPopup(content: any) {
    this.modalRef = this.modalService.open(content, {
      size: 'sm',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
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


  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();

      await this.sMSMailService.SendMessage(this.MobileNo, "OTP")
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

  // VerifyOTP() :boolean {
  //   if (this.OTP === this.GeneratedOTP || GlobalConstants.DefaultOTP)
  //      {
  //     this.toastr.success('OTP Verified');
  //     this.activeModal.close();
  //     return true;
  //     this.onVerified.emit(); // Notify parent
  //   } else {
  //     this.toastr.error('Invalid OTP');
  //       return false;
  //   }
  // }dfsf

  VerifyOTP() {
    if (this.OTP == "") {
      this.toastr.error('Please Enter valid OTP');
    } else
      if (this.OTP === this.GeneratedOTP || this.OTP === GlobalConstants.DefaultOTP) {
        //this.toastr.success('OTP Verified');
        this.activeModal.close();
        this.onVerified.emit();
        this.OTP = "";
        if (this.modalRef) {
          this.modalRef.close();
        }
      } else {
        this.toastr.error('Invalid OTP');
      }
  }
}
