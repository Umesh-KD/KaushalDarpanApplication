import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { CitizenSuggestionModel, SearchRequest, UserRatingDataModel } from '../../../Models/CitizenSuggestionDataModel';
import { CitizenSuggestionService } from '../../../Services/CitizenSuggestionService/citizen-suggestion.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { AppsettingService } from '../../../Common/appsetting.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';

@Component({
  selector: 'app-citizen-suggestion-track',
  templateUrl: './citizen-suggestion-track.component.html',
  styleUrls: ['./citizen-suggestion-track.component.css'],
  standalone: false
})
export class CitizenSuggestionTrackComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  request = new CitizenSuggestionModel()
  public searchRequest = new SearchRequest();
  sSOLoginDataModel = new SSOLoginDataModel();
  public CitizenSuggestionList: any = [] = [];
  public SreachResponse: boolean = false;
  public ResponseForCollege: boolean = false;
  appsettingConfig = inject(AppsettingService);
  public ProfileLists: any = {};
  showMobileInput: boolean = false
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  Table_SearchText: string = ''
  RoleMasterList: any = []
  public dataHave: any = []
  rating: number = 0;  // Store the rating
  public ratingRequest = new UserRatingDataModel()
  public SrNoValid: boolean = false;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference

  isDisabled: boolean = true;
  stars = [
    { id: 1, icon: 'star', class: 'star-gray star-hover star' },
    { id: 2, icon: 'star', class: 'star-gray star-hover star' },
    { id: 3, icon: 'star', class: 'star-gray star-hover star' },
    { id: 4, icon: 'star', class: 'star-gray star-hover star' },
    { id: 5, icon: 'star', class: 'star-gray star-hover star' }
  ];

  OtpVerified: boolean = false
  SRNDataList: any = []
  constructor(
    private Router: Router,
    private CitizenSuggestionService: CitizenSuggestionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private sMSMailService: SMSMailService,
  ) { }

  async ngOnInit() {
    this.selectStar(0);
  }



  ForgotSRN() {
    this.showMobileInput = !this.showMobileInput
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

  async openModalGenerateOTP(content: any, MobileNo: number) {
    try {
      this.loaderService.requestStarted();
      await this.CitizenSuggestionService.GetRecordForOTP(MobileNo)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.dataHave = data['Data'];

          if (data['Data']['Pk_ID'] != 0) {
            console.log(MobileNo)
            this.modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
            this.SendOTP();
          }
          else {
            this.toastr.warning('This mobile no. is not exist');
          }

          console.log("dataHave", this.dataHave);
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
    this.SrNoValid === false
    this.searchRequest.SRNumber = '';
    this.modalService.dismissAll();

  }

  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";

      this.sSOLoginDataModel.Mobileno = this.MobileNo;

      await this.sMSMailService.SendMessage(this.sSOLoginDataModel.Mobileno, "OTP")
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

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  openSRNListModal(content: any) {

    this.modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          this.OtpVerified = true
          this.GetSRNDataList();
          this.CloseModal();
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

  async GetSRNDataList() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.MobileNo = this.MobileNo
      await this.CitizenSuggestionService.GetSRNDataList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.SRNDataList = data.Data
          console.log("SRNDataList", this.SRNDataList)
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

  async openModalSRNData(content: any) {
    debugger;
    this.CitizenSuggestionList = [];
    if (this.searchRequest.SRNumber == "")
    {
      this.Message = "Enter SRN No.";
      this.toastr.error(this.Message);
      return;
    }
    await this.GetSRNumberData(content);


  }

  openModelBOX(content: any)
  {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async GetSRNumberData(content: any)
  {
    try {
      this.loaderService.requestStarted();
      await this.CitizenSuggestionService.GetSRNumberData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'].length !== 0) {
            this.SreachResponse = true;
            this.CitizenSuggestionList = data['Data'][0];
            this.selectedStar(this.CitizenSuggestionList?.UserRating)
            this.openModelBOX(content)
          }
          else
          {
            this.Swal2.Warning('SR Number Not Found');
            this.searchRequest.SRNumber = '';
          }
          if (!this.CitizenSuggestionList?.Replay)
          {
            this.CitizenSuggestionList.Replay = 'Pending';
          }
          if (!this.CitizenSuggestionList?.ReplayAttachment) {
            this.CitizenSuggestionList.ReplayAttachment = 'Pending';
          }
          if (this.CitizenSuggestionList?.PolytechnicName !== 0 && this.CitizenSuggestionList?.PolytechnicName !== null) {
            this.ResponseForCollege = true;
          }
          console.log(this.CitizenSuggestionList, "CitizenSuggestionList")
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


  filterNumber(input: string): string {
    return input.replace(/[^0-9]/g, '');
  }

  openModalFeedbackForm(content: any, SRNo: string, Pk_ID: number) {
    this.ratingRequest.Pk_ID = Pk_ID
    this.ratingRequest.SRNo = SRNo
    this.modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  CloseModalFeedbackForm() {
    this.ratingRequest.UserRating = 0
    this.ratingRequest.RatingRemarks = ''
    this.CitizenSuggestionList = "";
    this.modalService.dismissAll();
  }
  selectStar(value: number): void {

    if (this.ratingRequest.UserRating >= 0) {
      this.stars.filter((star) => {
        if (star.id <= value) {
          star.class = 'star-gold star';
        } else {
          star.class = 'star-gray star';
        }
        return star;
      });
    }

    this.ratingRequest.UserRating = value;
  }

  async SaveUserRating() {
    if (this.ratingRequest.UserRating == 0) {
      this.toastr.warning('Please Give Rating')
      return
    }
    try {
      this.loaderService.requestStarted();
      await this.CitizenSuggestionService.SaveUserRating(this.ratingRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.CloseModalFeedbackForm();
          }
          else {
            this.toastr.error(data.ErrorMessage);
          }
        }, error => console.error(error)
        )
    } catch (error) {
      console.log(error)
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  selectedStar(value: number): void {

    if (this.CitizenSuggestionList?.UserRating >= 0) {
      this.stars.filter((star) => {
        if (star.id <= value) {
          star.class = 'star-gold star';
        } else {
          star.class = 'star-gray star';
        }
        return star;
      });
    }
  }

  getStarIcon(starId: number, userRating: number): string {
    return starId <= userRating ? 'star' : 'star_border';
  }


  // selectedStar(): void {
  //   this.QueryMasterList.forEach(item => {
  //     const userRating = item.UserRating;
  //     this.stars.forEach((star, index) => {

  //       if (index < userRating) {
  //         star.class = 'star-gold star'; 
  //       } else {
  //         star.class = 'star-gray star';
  //       }
  //     });
  //   });
  // }
}
