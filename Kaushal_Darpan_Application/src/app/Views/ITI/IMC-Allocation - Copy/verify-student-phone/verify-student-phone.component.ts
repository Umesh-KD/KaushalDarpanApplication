import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { IMCAllocationDataModel, IMCAllocationSearchModel } from '../../../../Models/ITIIMCAllocationDataModel';
import { IMCAllocationService } from '../../../../Services/ITI/IMC-Allocation/imc-allocation.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { CookieService } from 'ngx-cookie-service';
import { EnumDepartment, EnumStatus, GlobalConstants, enumExamStudentStatus } from '../../../../Common/GlobalConstants';
import { AllotmentDocumentModel, AllotmentReportingModel } from '../../../../Models/ITI/AllotmentreportDataModel';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';



@Component({
  selector: 'app-verify-student-phone',
  standalone: false,

  templateUrl: './verify-student-phone.component.html',
  styleUrl: './verify-student-phone.component.css'
})
export class VerifyStudentPhoneComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isUpdate: boolean = false;
  searchText: string = '';
  public IMCAllocationModel: IMCAllocationDataModel[] = [];
  request = new IMCAllocationDataModel()
  public searchRequest = new IMCAllocationSearchModel();
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
  public requestReporting = new AllotmentReportingModel()
  public TradeBox: boolean = false;
  public IsOBC: boolean = true;
  public IsGEN: boolean = true;
  public IsST: boolean = true;
  public IsSC: boolean = true;
  public Isremarkshow: boolean = false
  public remarkheader: boolean = false

  public studentPhoto: string = '';
  public studentPhotoFolder: string = '';

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  public filteredDocumentDetails: AllotmentDocumentModel[] = []
  constructor(
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private IMCAllocationService: IMCAllocationService,
    private sMSMailService: SMSMailService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal, private http: HttpClient, private sanitizer: DomSanitizer, public appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2) {
  }

  async ngOnInit() {

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.routers.paramMap.subscribe(params => {
      this.ApplicationIdS = params.get('id')
    });
    this.searchRequest.TradeLevel = parseInt(this.routers.snapshot.paramMap.get('TradeLevel'));
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;




    if (this.ApplicationIdS) {
      this.searchRequest.ApplicationID = parseInt(this.ApplicationIdS);
      await this.getAllDataList();
      this.GetStudentDetailsList();
      this.GetTradeListByCollege();
      this.DetailsBox = false;
      //this.TradeBox = true;
      this.isUpdate = true
    }

    //this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
  }


  //StatusUpdate(): string {
  //  if (this.StudentDetailsList.CasteCategoryNameEnglish == 'OBC')
  //  {

  //  }
  //  else if (this.searchRequest.TradeLevel == 10) {
  //    return '/ITIIMCAllocationList10th/' + this.searchRequest.TradeLevel
  //  }
  //  else {
  //    return '/default-path'; // or any other fallback path
  //  }
  //}


  async StatusUpdate() {
    
    try {
      if (this.StudentDetailsList[0].CasteCategoryNameEnglish == 'OBC') {
        this.IsSC = false;
        this.IsST = false;
      }
      else if (this.StudentDetailsList[0].CasteCategoryNameEnglish == 'ST') {
        this.IsSC = false;
        this.IsOBC = false;
      }
      else if (this.StudentDetailsList[0].CasteCategoryNameEnglish == 'SC') {
        this.IsST = false;
        this.IsOBC = false;
      }
      else if (this.StudentDetailsList[0].CasteCategoryNameEnglish == 'GENERAL') {
        this.IsST = false;
        this.IsOBC = false;
        this.IsSC = false;
      }
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


  getRouterLink(): string {
    if (this.searchRequest.TradeLevel == 8) {
      return '/ITIIMCAllocationList8th/8';
    } else if (this.searchRequest.TradeLevel == 10) {
      return '/ITIIMCAllocationList10th/10';
    } else if (this.searchRequest.TradeLevel == 12) {
      return '/ITIIMCAllocationList12th/12';
    } else {
      return "";
    }
  }

  async getAllDataList() {
    try {
      this.loaderService.requestStarted();
      this.TradeBox = false;
      this.DetailsBox = true;
      await this.IMCAllocationService.GetIMCStudentDetails(this.searchRequest)
        .then((data: any) => {
         debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentVerifyPhoneData = data['Data'].Table;
          this.request.MobileNo = data['Data'].Table[0].MobileNo;
          this.request.ApplicationID = data['Data'].Table[0].ApplicationID;
          this.request.TradeLevel = data['Data'].Table[0].ApplicationID;
          this.requestReporting = data['Data'].Table[0];
          this.requestReporting.AllotmentDocumentModel = data['Data'].Table1;

          //alert(this.StudentVerifyPhoneData[0].ApplicationVerified);
          //if (this.StudentVerifyPhoneData[0].ApplicationVerified !== 0) {
          //  this.ApplicationAlloted = false;
          //} else {
          //  this.ApplicationAlloted == true;
          //}

          if (this.StudentVerifyPhoneData[0].ApplicationAlloted == 1) {
            this.ApplicationAlloted = true;
            this.TradeBox = false;
          } else {
            this.ApplicationAlloted = false;
            this.TradeBox = true;
          }
          //if (this.requestReporting.AllotmentDocumentModel.length > 0)
          const photoDoc = this.requestReporting.AllotmentDocumentModel.find((x: any) => x.ColumnName === 'StudentPhoto');
          this.studentPhoto = photoDoc ? photoDoc.FileName : "";
          this.studentPhotoFolder = photoDoc ? photoDoc.FolderName : "";
          

          //this.GetTradeListByCollege();
          // alert(this.request.MobileNo);
          console.log(this.StudentVerifyPhoneData, "StudentVerifyPhoneData")
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

  pdfUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  showPdfModal: boolean = false;
  isPdf: boolean = false;
  isImage: boolean = false;
  isOtherDocument: boolean = false
  public isSupp: boolean = false
  imageSrc: string | null = null;
  isError: boolean = false;


  @ViewChild('appMenu', { static: false }) menuElementRef!: ElementRef;
  async openPdfModal(url: string): Promise<void> {

    const el = document.getElementById('app-menu');
    if (el) {
      el.classList.add('DocShowers'); // or any class you want
    }


    const ext = url.split('.').pop()?.toLowerCase();
    this.isPdf = ext === 'pdf';
    this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');

    this.safePdfUrl = null;
    this.imageSrc = '';
    this.pdfUrl = url;
    this.isError = false;

    try {
      const blob = await this.http.get(url, { responseType: 'blob' }).toPromise();
      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.imageSrc = blobUrl;
      } else {
        throw new Error('Blob is undefined');
      }
    } catch (error) {
      console.error('File load failed, using dummy image.', error);
      this.isPdf = false;
      this.isImage = true;
      this.safePdfUrl = null;
      this.imageSrc = 'assets/images/dummyImg.jpg';
      this.isError = true;
    }

    this.showPdfModal = true;
  }

  async GetStudentDetailsList() {
    try {
      this.loaderService.requestStarted();
      await this.IMCAllocationService.StudentDetailsList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentDetailsList = data['Data'];
          console.log(this.StudentDetailsList, "StudentDetailsList")
          this.StatusUpdate();
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
        await this.IMCAllocationService.UpdateMobileNo(this.request)
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
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      await this.IMCAllocationService.GetTradeListByCollege(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentOptinalTradeList = data['Data'];
          // alert(this.request.MobileNo);
          console.log(this.StudentOptinalTradeList, "StudentOptinalTradeList")
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


  async TradeWithAllot(content: any, CollegeTradeID: number, SeatMetrixId: number, AllotedCategory: string, SeatMetrixColumn: string) {
    //alert(CollegeTradeID);
    //alert(AllotedCategory);
    this.request.CollegeTradeID = CollegeTradeID;
    this.request.SeatMetrixId = SeatMetrixId;
    this.searchRequest.CollegeTradeID = CollegeTradeID;
    this.request.AllotedCategory = AllotedCategory;
    this.request.SeatMetrixColumn = SeatMetrixColumn;

    try {
      this.loaderService.requestStarted();
      await this.IMCAllocationService.ShiftUnitList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ShiftUnitList = data['Data'];
          //this.GetTradeListByCollege();
          // alert(this.request.MobileNo);
          console.log(this.ShiftUnitList, "ShiftUnitList")
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
      this.request.TradeLevel = this.searchRequest.TradeLevel
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
      await this.IMCAllocationService.UpdateAllotments(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.getAllDataList();
            this.toastr.success('Student Allotment Successfully');
            this.resetOTPControls();
            this.CloseModal();
            if (this.searchRequest.TradeLevel == 8) {
              this.Router.navigate(['/ITIIMCAllocationList8th', 8]);             
            } else if (this.searchRequest.TradeLevel == 10) {
              this.Router.navigate(['/ITIIMCAllocationList10th', 10]);
            } else if (this.searchRequest.TradeLevel == 12) {
              this.Router.navigate(['/ITIIMCAllocationList12th', 12]);
            }
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

  ClosePopupAndGenerateAndViewPdf(): void {
    const el = document.getElementById('app-menu');
    if (el) {
      el.classList.remove('DocShowers'); // or any class you want
    }
    this.showPdfModal = false;
    this.safePdfUrl = null;
    this.pdfUrl = null;
    this.imageSrc = null;
    this.isPdf = false;
    this.isImage = false;
    this.isError = false;
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/dummyImg.jpg';
  }

  async OnRemarkChange(dOC: any, index: number) {

    if (index == 0) {
      dOC.ShowRemark = true;
      dOC.DocumentStatus = false

    } else {
      dOC.ShowRemark = false;
      dOC.DocumentStatus = true
      dOC.Remark = '';
    }
    //
    //console.log(this.request.AllotmentDocumentModel)
    this.Isremarkshow = this.requestReporting.AllotmentDocumentModel.some((x: any) => x.DocumentStatus === false);

    this.remarkheader = this.Isremarkshow;
  }


}
