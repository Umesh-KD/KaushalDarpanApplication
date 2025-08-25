import { Component, ElementRef, ViewChild } from '@angular/core';
import { StudentsJoiningStatusMarksDataMedels, StudentsJoiningStatusMarksSearchModel } from '../../../Models/StudentsJoiningStatusMarksDataMedels';
import { AllotmentDocumentModel, AllotmentReportingModel } from '../../../Models/ITI/AllotmentreportDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsJoiningStatusMarksService } from '../../../Services/Students-Joining-Status-Marks/students-joining-status-marks.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
import { AppsettingService } from '../../../Common/appsetting.service';
import { InternalSlidingService } from '../../../Services/ITIInternalSliding/internal-sliding.service';
import { SearchSlidingModel } from '../../../Models/InternalSlidingDataModel';
import { EnumRole, EnumStatus, GlobalConstants, EnumDepartment } from '../../../Common/GlobalConstants';
import { ReportService } from '../../../Services/Report/report.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { ITIAllotmentService } from '../../../Services/ITI/ITIAllotment/itiallotment.service';
import { IMCAllocationService } from '../../../Services/ITI/IMC-Allocation/imc-allocation.service';
import { IMCAllocationDataModel } from '../../../Models/ITIIMCAllocationDataModel';

@Component({
  selector: 'app-allotment-reporting',
  standalone: false,

  templateUrl: './allotment-reporting.component.html',
  styleUrl: './allotment-reporting.component.css'
})
export class AllotmentReportingComponent {
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  @ViewChild('otpModal1') childComponent1!: OTPModalComponent;
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  public filteredDocumentDetails: AllotmentDocumentModel[] = []
  request = new AllotmentReportingModel()
  public searchRequest = new StudentsJoiningStatusMarksSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  /*  public AllotmentId: number | null = null;*/
  sSOLoginDataModel = new SSOLoginDataModel();
  public AllotmentDocument: any[] = [];
  public StudentsJoiningStatusMarksDetails: any[] = [];
  public slidingrequest = new SearchSlidingModel()
  public TradeList: any[] = [];
  public InternalSlidingUnitList: any[] = [];
  public IsStatusMark: boolean = false;
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public AllotmentId: number = 0
  public TradeLevel: number = 0
  public Isremarkshow: boolean = false
  public remarkheader: boolean = true;
  public NewMobileNo: string = '';
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';

  pdfUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  showPdfModal: boolean = false;
  isPdf: boolean = false;
  isImage: boolean = false;
  isOtherDocument: boolean = false
  public isSupp: boolean = false
  imageSrc: string | null = null;
  isError: boolean = false;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any;

  public ReportingStatus: any = [{ Name: "Reported", Id: 4 }, { Name: "Not Reported", Id: 5 }, { Name: "Reject", Id: 7 }, { Name: "Reject With Deficiency", Id: 11 }, { Name: "withdraw", Id: 9 }, { Name: "Cancel", Id: 3 }]


  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private StudentsJoiningStatusMarksService: StudentsJoiningStatusMarksService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService,
    public appsettingConfig: AppsettingService,
    private internalSlidingService: InternalSlidingService,
    private reportService: ReportService, private http: HttpClient, private sanitizer: DomSanitizer,
    private itiallotmentStatusService: ITIAllotmentService, private IMCAllocationService: IMCAllocationService,
    private Swal2: SweetAlert2) {
  }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CreatedBy = this.sSOLoginDataModel.UserID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.AllotmentId = Number(this.routers.snapshot.queryParamMap.get('AllotmentID') ?? 0)
    this.TradeLevel = Number(this.routers.snapshot.queryParamMap.get('Key') ?? 0)
    if (this.AllotmentId > 0) {
      this.searchRequest.AllotmentId = this.AllotmentId;

      this.GetById()
      /*      this.GetDDLInternalSlidingUnitList()*/
    }

  }

  async GetById() {
    // const DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.StudentsJoiningStatusMarksService.GetAllotmentdata(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("What I got from DB", data.Data)
          if (data['Data'] != null) {
            this.request = data['Data']

            const dob = new Date(data['Data']['DOB']);
            const year = dob.getFullYear();
            const month = String(dob.getMonth() + 1).padStart(2, '0');
            const day = String(dob.getDate()).padStart(2, '0');
            this.request.DOB = `${year}-${month}-${day}`;

            this.GetDDLInternalSlidingUnitList()
            //this.request.Religion = data['Data']['Religion']



            if (this.request?.AllotmentDocumentModel) {

              this.filteredDocumentDetails = this.request.AllotmentDocumentModel.filter((x) => x.GroupNo === 1);

              this.request.AllotmentDocumentModel.forEach((dOC: any) => {
                dOC.ShowRemark = dOC.DocumentStatus == false;
              });

              // Recalculate Isremarkshow
              this.Isremarkshow = this.request.AllotmentDocumentModel.some((x: any) => x.DocumentStatus == false);
            } else {

              this.filteredDocumentDetails = [];
            }


          }




          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";


        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  //filteredDocumentDetails(groupNo: number): AllotmentDocumentModel[] {
  //  if (groupNo == 1) {
  //    let filtered = this.request.AllotmentDocumentModel.filter((x) => x.GroupNo == groupNo);




  //    return filtered;
  //  } else {
  //    return this.request.AllotmentDocumentModel.filter((x) => x.GroupNo == groupNo);
  //  }
  //}



  autoGrowTextArea(event: any) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // reset height
    textarea.style.height = textarea.scrollHeight + 'px'; // adjust to content
  }

  async GetDDLInternalSlidingUnitList() {
    this.slidingrequest.InsID = this.request.CollegeTradeId;
    this.slidingrequest.ApplicationID = this.request.ApplicationID;
    this.slidingrequest.AllotmentId = this.request.AllotmentId;
    this.slidingrequest.SeatIntakeId = 0;
    this.slidingrequest.action = "List";
    //this.slidingrequest.TradeLevel = this.request.trade;
    try {
      await this.internalSlidingService.GetDDLInternalSlidingUnitList(this.slidingrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.InternalSlidingUnitList = data['Data'];
            console.log(this.InternalSlidingUnitList, 'InternalSlidingList')
          } else {
            /*     this.toastr.error(data.ErrorMessage || 'Error fetching data.');*/
          }
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
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
    this.Isremarkshow = this.request.AllotmentDocumentModel.some((x: any) => x.DocumentStatus === false);

    this.remarkheader = this.Isremarkshow;
  }

  async VerifyOTPForList() {
    debugger;
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {


        if (this.request.AllotmentDocumentModel == null) {
          this.request.AllotmentDocumentModel = [];
        }

        this.isSubmitted = true
        const IsRemarKvalid = this.request.AllotmentDocumentModel.some((x: any) => x.DocumentStatus == false && x.Remark == '');
        if (IsRemarKvalid == true) {
          /*      this.toastr.error("Please enter valisd Remark")*/
          return
        }
        this.request.JoiningStatus = this.searchRequest.ReportingStatus;
        this.request.CreatedBy = this.sSOLoginDataModel.UserID
        this.request.ModifyBy = this.sSOLoginDataModel.UserID

        if (this.request.JoiningStatus == '') {
          this.toastr.error("Please select Reporting Status")
          return
        }

        if (this.request.ShiftUnitID == 0 && this.request.JoiningStatus == '4') {
          this.toastr.error("Please select shift unit")
          return
        }

        this.Isremarkshow = this.request.AllotmentDocumentModel.some((x) => x.DocumentStatus == false);
        //if (this.Isremarkshow) {
        //  this.request.JoiningStatus = 'R'
        //} else {
        //  this.request.JoiningStatus = 'J'
        //}

        try {
          await this.StudentsJoiningStatusMarksService.SaveReporting(this.request)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data.State == EnumStatus.Success) {
                this.toastr.success(data.Message)
              } else {
                /*     this.toastr.error(data.ErrorMessage || 'Error fetching data.');*/
              }
            }, (error: any) => console.error(error));
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


  OpenSaveReporting() {


    debugger;
    if (this.searchRequest.ReportingStatus == '') {
      this.toastr.error("Please select Reporting Status")
      return
    }

    if (this.request.ShiftUnitID == 0 && this.searchRequest.ReportingStatus == '4') {
      this.toastr.error("Please select shift unit")
      return
    }

    //if (this.request.ApplyUpward == true) {
      this.openSubmitOTP();
    //} else {
     // this.SaveReporting();
   // }

  }

  async SaveReporting() {
    debugger;

    if (this.request.AllotmentDocumentModel == null) {
      this.request.AllotmentDocumentModel = [];
    }

    this.isSubmitted = true
    const IsRemarKvalid = this.request.AllotmentDocumentModel.some((x: any) => x.DocumentStatus == false && x.Remark == '');
    if (IsRemarKvalid == true) {
      /*      this.toastr.error("Please enter valisd Remark")*/
      return
    }
    this.request.JoiningStatus = this.searchRequest.ReportingStatus;
    this.request.CreatedBy = this.sSOLoginDataModel.UserID
    this.request.ModifyBy = this.sSOLoginDataModel.UserID

    //if (this.request.JoiningStatus == '') {
    //  this.toastr.error("Please select Reporting Status")
    //  return
    //}

    //if (this.request.ShiftUnitID == 0 && this.request.JoiningStatus == '4') {
    //  this.toastr.error("Please select shift unit")
    //  return
    //}

    this.Isremarkshow = this.request.AllotmentDocumentModel.some((x) => x.DocumentStatus == false);
    //if (this.Isremarkshow) {
    //  this.request.JoiningStatus = 'R'
    //} else {
    //  this.request.JoiningStatus = 'J'
    //}

    try {
      await this.StudentsJoiningStatusMarksService.SaveReporting(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
          } else {
            /*     this.toastr.error(data.ErrorMessage || 'Error fetching data.');*/
          }
        }, (error: any) => console.error(error));
      this.CloseModal()
    }
    catch (ex) {
      console.log(ex);
    }

  }


  openSubmitOTP() {
    this.childComponent.MobileNo = this.request.MobileNo;
    this.CloseModal();
    this.childComponent.OpenOTPPopup();
    var th = this;
    this.toastr.success('OTP sent successfully to student mobile no');
    this.childComponent.onVerified.subscribe(() => {
      th.SaveReporting();
    });
  }



  async SendOTPForList(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      if (this.sSOLoginDataModel.RoleID == EnumRole.Admin) {
        this.sSOLoginDataModel.Mobileno = "7568622727";

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

  async openModalGenerateOTPForList(content: any) {
    this.OTP = '';
    this.MobileNo = '';
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = this.MobileNo;
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

  async SaveData() {
    debugger;
    this.isSubmitted = true
    const IsRemarKvalid = this.request.AllotmentDocumentModel.some((x: any) => x.DocumentStatus == false && x.Remark == '');
    if (IsRemarKvalid == true) {
      /*      this.toastr.error("Please enter valisd Remark")*/
      return
    }
    this.request.JoiningStatus = this.searchRequest.ReportingStatus;
    this.request.CreatedBy = this.sSOLoginDataModel.UserID
    this.request.ModifyBy = this.sSOLoginDataModel.UserID

    if (this.request.JoiningStatus == '') {
      this.toastr.error("Please select Reporting Status")
      return
    }

    if (this.request.ShiftUnitID == 0 && this.request.JoiningStatus == '4') {
      this.toastr.error("Please select shift unit")
      return
    }

    this.Isremarkshow = this.request.AllotmentDocumentModel.some((x) => x.DocumentStatus == false);
    //if (this.Isremarkshow) {
    //  this.request.JoiningStatus = 'R'
    //} else {
    //  this.request.JoiningStatus = 'J'
    //}


    try {
      await this.StudentsJoiningStatusMarksService.SaveReporting(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
          } else {
            /*     this.toastr.error(data.ErrorMessage || 'Error fetching data.');*/
          }
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
  }
  async OnRoute() {
    if (this.TradeLevel == 10) {
      this.router.navigate(['StudentsJoiningStatusMarks10th/10'])
    } else if (this.TradeLevel == 8) {
      this.router.navigate(['StudentsJoiningStatusMarks8th/8'])
    } else if (this.TradeLevel == 12) {
      this.router.navigate(['StudentsJoiningStatusMarks12th/12'])
    }
  }

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

  async DownloadAllotmentLetter(id: any) {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.StudentsJoiningStatusMarksList[0].AllotmentId;
      await this.itiallotmentStatusService.GetAllotmentLetter(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'AllotmentLetter' + id + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
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

  async DownloadAllotmentLetterFeeRpt(id: any) {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.StudentsJoiningStatusMarksList[0].AllotmentId;
      await this.itiallotmentStatusService.GetAllotmentReportingReceipt(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'Allotment-Reporting-Receipt' + id + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
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

  async GetAllotmentFeeReceipt(id: any) {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.StudentsJoiningStatusMarksList[0].AllotmentId;
      await this.itiallotmentStatusService.GetAllotmentFeeReceipt(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'Allotment_fee_Receipt' + id + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
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

  async UpdateMobileNo() {
    if (this.NewMobileNo.length === 10) {

      const request =new IMCAllocationDataModel();

      request.CreatedBy = this.sSOLoginDataModel.UserID;
      request.ModifyBy = this.sSOLoginDataModel.UserID;
      request.MobileNo = this.NewMobileNo;
      request.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      request.ModifyBy = this.sSOLoginDataModel.UserID;
      request.ApplicationID = this.request.ApplicationID;
      try {
        this.loaderService.requestStarted();
        await this.IMCAllocationService.UpdateMobileNo(request)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State == EnumStatus.Success) {
              if (data.Data[0].Status == 1) {
                this.toastr.success(data.Data[0].MSG);
                window.location.reload(); //this.ngOnInit();
              } else {
                this.toastr.error(data.Message);
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
    else {
      this.toastr.warning('Please Enter 10 Digits Mobile No');
    }
  }

  async openModalChangeMobileNo(content: any) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async openChangeOTP() {
    this.childComponent1.MobileNo = this.NewMobileNo;
    this.CloseModal();
    await this.childComponent1.OpenOTPPopup();
    var th = this;
    this.toastr.success('OTP sent successfully to student mobile no');
    this.childComponent1.onVerified.subscribe(() => {
      th.UpdateMobileNo();
      this.childComponent1.onVerified.unsubscribe();
    });
  }

}
