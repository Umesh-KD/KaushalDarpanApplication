import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { JanAadharDetailService } from '../../Services/JanAadharDetailService/JanAadharDetail.service';
import { JanAadharDetailModel, JanAadharVerifyMemberDetails, NewJanAadharAPIModel, NewJanAadharDetailsEntity } from '../../Models/NewJanAadharAPIModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import { EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { JanAadharMemberDetails } from '../../Models/StudentJanAadharDetailModel';

@Component({
    selector: 'new-jan-aadhar',
    templateUrl: './new-jan-aadhar.component.html',
    styleUrls: ['./new-jan-aadhar.component.css'],
    standalone: false
})
export class JanAadharDetailComponent implements OnInit {


  @Input() janadharNo: string = '';   // <-- coming from another component
  @Output() verifiedData = new EventEmitter<any>(); // <-- send data back

  public  request = new JanAadharDetailModel();
  public JanAdharMemberList: NewJanAadharDetailsEntity[] = [];
  public ResposeOTPModel = new NewJanAadharAPIModel();
  public isFirstStep:boolean =true;
  public IsShow:boolean=false;
  public showMemberDetail: boolean = false;
  public State: number = 0;
  public Message: any = [];
  public ErrorMessage: any = [];


  private memberModalRef!: NgbModalRef;
  private otpModalRef!: NgbModalRef;


  private modalRef!: NgbModalRef;
  showResendButton: boolean = false;
  timeLeft: number = GlobalConstants.DefaultTimerOTP;
  public resendModel = new NewJanAadharAPIModel();


  public janDetails: any = [];
  public responsemodel = new JanAadharVerifyMemberDetails();

  @ViewChild('MemberListPopup') MemberListPopup!: TemplateRef<any>;
  @ViewChild('ApplySchemesEmp') ApplySchemesEmp!: TemplateRef<any>;
  closeResult: string | undefined;
  isOpen: boolean = false;
  isStepNext: boolean = true;
  private interval: any;
    constructor(
      // private commonMasterService: CommonFunctionService, 
      // private ItiDataMasterService: ItiDataMasterService,
      private toastr: ToastrService, 
      private loaderService: LoaderService, 
      // private Swal2: SweetAlert2, 
      // private Router: Router, 
      // private router: ActivatedRoute,
      private modalService: NgbModal,
      private router: Router,
      // private formBuilder: FormBuilder,
      // private documentDetailsService: DocumentDetailsService, 
      // public appsettingConfig: AppsettingService, 
      private NewJanAadharDetailService:JanAadharDetailService,
  ) { }

  ngOnInit(): void
  {
    // throw new Error('Method not implemented.');
    this.request.JAN_AADHAR = "4586715134";
   
  }
  public StudentList: any = [];
 
    btnFistStep(event: Event) {
      debugger
    event.preventDefault();
    const janAadhar = this.request.JAN_AADHAR?.trim();
    if (!janAadhar || janAadhar.length < 10 || janAadhar.length > 12 || !/^\d+$/.test(janAadhar)) {
      this.toastr.error('Please enter a valid Jan Aadhar Number ( 10 digits)');
      return;
    }
    this.GetJanaadhaarMembersList();

  }

    async GetJanaadhaarMembersList() {


    if (this.request.JAN_AADHAR.length < 10 || this.request.JAN_AADHAR.length > 12) {
      this.toastr.error("Invalid Janadhar Details");
      return;
    }

    try {
      await this.NewJanAadharDetailService.JanAadhaarMembersList(this.request.JAN_AADHAR)
        .then((data: any) => {


          const apiRes = data?.Data?.response;

       
          if (apiRes?.status === true && apiRes?.responseCode === "JAN_200") {

            this.JanAdharMemberList = apiRes.data;
            this.isFirstStep = false;
            this.IsShow = true;


            this.openMemberListPopup()
            console.log(this.JanAdharMemberList);

          } else {
            this.toastr.warning(
              apiRes?.message ||
              data?.Message ||
              "Please check Jan Aadhaar again"
            );
          }
        });
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

  async SendOTP(row: NewJanAadharAPIModel) {

    this.resendModel = row;

    await this.NewJanAadharDetailService.SendJanaadharOTP(row)
      .then((res: any) => {

        this.State = res.State;
        this.Message = res.Message;
        this.ErrorMessage = res.ErrorMessage;
        debugger;
        if (this.State === 2)
        {
          this.startTimer();

          this.isOpen = true;
          this.toastr.success(res.Data.response.message);

          this.ResposeOTPModel = res.Data.response;
          this.ResposeOTPModel.MEMBER_ID = row.MEMBER_ID;
          this.ResposeOTPModel.tid = res.Data.response.tid;

          console.log("OTP Response:", this.ResposeOTPModel);
          console.log("Signature:", res.Data.signature);
        }
        else {
          this.isOpen = false;

          this.toastr.error(this.ErrorMessage || "Something went wrong");
        }
      })
      .catch(err => {
        console.error(err);
        this.toastr.error("API Error Occurred");
      });
  }

  startTimer(): void {
    this.showResendButton = false;
    this.timeLeft = GlobalConstants.DefaultTimerOTP * 10;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.showResendButton = true;
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${remainingSeconds.toString().padStart(1, '0')}`;
  }





  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async ShowOtpPopup(content: any)
  {
    this.otpModalRef = this.modalService.open(this.ApplySchemesEmp, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      centered: true,
      keyboard: false
    });
    this.otpModalRef.result.then(
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

  closeOTRPopup() {
    this.modalService.dismissAll();
    setTimeout(() => {
      this.router.navigate(['/dashboard/jobseeker']);
    }, 100);
  }

  CloseModalPopup() {
    if (this.otpModalRef) {
      this.otpModalRef.close();
    }
  
  }


  otpArray = new Array(6);
  OTP: string = '';

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  onOtpInput(event: any, index: number) {
    const input = event.target;
    const value = input.value.replace(/[^0-9]/g, '');

    input.value = value;

    if (value && index < 5) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }

    this.collectOTP();
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text').trim();

    if (!pastedData) return;

    const digits = pastedData.replace(/\D/g, '').split('').slice(0, 6);

    digits.forEach((digit, i) => {
      this.otpInputs.toArray()[i].nativeElement.value = digit;
    });

    this.collectOTP();
  }

  collectOTP() {
    this.OTP = this.otpInputs
      .map((input: any) => input.nativeElement.value)
      .join('');
  }



  async VerifyOTP()
  {
    if (this.OTP.length > 0) {
      try {
        this.loaderService.requestStarted();

        this.ResposeOTPModel.OTP = this.OTP;
        await this.NewJanAadharDetailService.VerifyOTP(this.ResposeOTPModel)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            debugger;
            if (this.State == EnumStatus.Success)
            {
              this.CloseModalPopup();
              this.closeMemberListPopup();
              this.showMemberDetail = true;
              this.isStepNext = false;
              this.janDetails = data.Data.response.data[0];
              this.responsemodel = this.janDetails;
              // SEND BACK TO PARENT COMPONENT
              this.verifiedData.emit(this.janDetails);
              this.toastr.success(data.Data.response.message ?? this.Message);
            }
            else
            {
              this.toastr.warning('Invalid OTP Please Try Again');
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
      this.toastr.warning('Please Enter OTP');
    }
  }

  openMemberListPopup() {


    // 🔴 store modal reference
    this.memberModalRef = this.modalService.open(this.MemberListPopup, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      centered: true,
      keyboard: false
    });

    // 🔴 handle close/dismiss event (optional)
    this.memberModalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );



 
  }




  closeMemberListPopup()
  {

    if (this.memberModalRef) {
      this.memberModalRef.close();
    }
  }


  public startVerification(janadhar: string)
  {

    this.request.JAN_AADHAR = janadhar;
    this.GetJanaadhaarMembersList();

  
  }



}
