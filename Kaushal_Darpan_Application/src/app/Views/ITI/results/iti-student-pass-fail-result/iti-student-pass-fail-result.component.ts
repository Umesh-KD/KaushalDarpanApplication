import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { GlobalConstants, EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CenterObserverSearchModel, CenterObserverDataModel } from '../../../../Models/CenterObserverDataModel';
import { ItiGetPassFailResultDataModel, ItiGetResultDataModel } from '../../../../Models/ITI/ITI_ResultModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ITIResultService } from '../../../../Services/ITIResult/iti-result.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { StudentMarksheetSearchModel } from '../../../../Models/OnlineMarkingReportDataModel';
import { ReportService } from '../../../../Services/Report/report.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ITICollegeMarksheetDownloadService } from "../../../../Services/ITI/ITICollegeStudentMarksheet/ITICollegeStudentMarksheet.Service";
import { ITICollegeStudentMarksheetSearchModel } from '../../../../Models/ITI/ITICollegeStudentMarksheetSearchModel';
import { ITIStateTradeCertificateSearchModel } from '../../../../Models/TheoryMarksDataModels';


@Component({
  selector: 'app-iti-student-pass-fail-result',
  standalone: false,
  templateUrl: './iti-student-pass-fail-result.component.html',
  styleUrl: './iti-student-pass-fail-result.component.css'
})
export class itiStudentPassFailResultComponent {
  public Table_SearchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public ResultData: any[] = [];
  public searchRequest = new CenterObserverSearchModel();
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
   public requestObs = new CenterObserverDataModel()
  public _GlobalConstants = GlobalConstants
  public _EnumRole = EnumRole;
  public paginatedInTableData: any[] = [];
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //public ListITITrade: any = [];
  public CollegeList: any = [];
  

   isPublished: boolean = false; // Flag to check if the exam is published
   isGenerated : boolean = false; // Flag to check if the order is generated
   modeType:string = ''; // Mode type for the operation (Generate or Publish)
   requestModel : ItiGetResultDataModel = new ItiGetResultDataModel();
   requestPassFailModel: ItiGetPassFailResultDataModel = new ItiGetPassFailResultDataModel();
   selectedYear: number = 0; // Variable to hold the selected year for filtering results

  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  public MobileNo: number = 0;
  public OTP: string = '';
  public GeneratedOTP: string = '';
  collegeDropDown: any = [];
  public isSubmitted: boolean = false;
  searchForm!: FormGroup;
  public MarksheetSearch = new ITICollegeStudentMarksheetSearchModel();
  public DashBoardStatuID: number = -1;
  //private activatedRoute: ActivatedRoute
  public GetStudentITI_MarksheetList: any[] = [];
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public searchRequestConsolidated = new ITIStateTradeCertificateSearchModel();
  public TradeListData: any[] = [];
  constructor(
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private sMSMailService: SMSMailService,
    private activatedRoute: ActivatedRoute,
    private appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
    private itiResultService: ITIResultService,
    private fb: FormBuilder,
    //private reportService: ReportService,
    private commonMasterService: CommonFunctionService,
    public ItiResultDownloadService: ITICollegeMarksheetDownloadService,
    public ReportServices: ReportService
  ) {}

  async ngOnInit() {
    this.searchForm = this.fb.group({
      collegeID: ['', []],
    });
   
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.sSOLoginDataModel);
    this.MobileNo = Number(this.sSOLoginDataModel.Mobileno);
    this.requestPassFailModel.UserID = Number(this.sSOLoginDataModel.UserID);
    this.requestPassFailModel.EndTermID = Number(this.sSOLoginDataModel.EndTermID);
    this.requestPassFailModel.FinancialYearID = Number(this.sSOLoginDataModel.FinancialYearID);
    await this.GetITICollegeStudent_Marksheet();
    this.collegeDropDown = this.GetStudentITI_MarksheetList;
   
    this.searchData();
    this.GetITITradeList();
    

    const statusParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (statusParam !== null && !isNaN(Number(statusParam)) && statusParam.trim() !== '') {
      this.requestPassFailModel.Results = Number(statusParam);
    }
}

  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  @ViewChild('content') content: ElementRef | any;

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  askUserConformation(content: any, mode: string) {
    this.modeType = mode; 
    if(mode === 'Publish' && this.isPublished){
      this.toastr.warning('Result already published.');
      return ;
    }
    this.Swal2.Confirmation("Are you sure?", async (result: any) => {
      if (result.isConfirmed) {
        this.resetOTPControls();
        this.openModalGenerateOTP(content);
      }
      
    });
  }

  async openModalGenerateOTP(content: any) {
    
    this.resetOTPControls();
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.SendOTP();
  }

  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
      await this.sMSMailService.SendMessage(this.sSOLoginDataModel.Mobileno, "OTP")
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

   CloseOTPModal() {

    this.modalService.dismissAll();
  }

  async VerifyOTP() {
    
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      } else {
        this.toastr.warning('Invalid OTP Please Try Again');
      }
    } else {
      this.toastr.warning('Please Enter OTP');
    }
  }

  async VerifyOTPGenerate() {
    
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          this.GenerateOrder();
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      } else {
        this.toastr.warning('Invalid OTP Please Try Again');
      }
    } else {
      this.toastr.warning('Please Enter OTP');
    }
  }


  async GenerateOrder() {
    debugger

    try {
      this.loaderService.requestStarted();
      this.requestModel.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
      if(this.modeType === 'Generate'){
        
        await this.itiResultService.GetGenerateResult(this.requestModel).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {

            if (data.Data[0].Status == 1) {
              this.toastr.success(data.Data[0].MSG);
              this.isGenerated = true; 
              this.GetStudentPassFailResultData();
            } else {
              this.toastr.error(data.Data[0].MSG);
            }
            this.loadInTable(); // Load the result data into the table
            this.CloseOTPModal();
          } else {
            this.toastr.error(data.ErrorMessage);
          }
        })
      }
      else if(this.modeType === 'Publish'){
        await this.itiResultService.GetPublishResult(this.requestModel).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            debugger
            if (data.Data[0].Status == 1) {
              this.toastr.success(data.Data[0].MSG);
              this.isPublished = true;
              this.GetStudentPassFailResultData();
            } else {
              this.toastr.error(data.Data[0].MSG);
            }

            this.CloseOTPModal();
          } else {
            this.toastr.error(data.ErrorMessage);
          }
        })
      }
      else{
        return;
      }

      this.CloseOTPModal();
      
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.ResultData].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }

  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.ResultData] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.ResultData.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.ResultData.filter(x => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }





  async searchData() {
    try {
      this.loaderService.requestStarted();
      debugger;
      // Set trade scheme and result status
      this.requestPassFailModel.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
     
      // Call current status check
      await this.itiResultService.GetCurrentPassFailResultStatus(this.requestPassFailModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.isPublished = data.Data[0].isPublish;
            this.isGenerated = data.Data[0].isGenerate;
            // If generated, load filtered data
            if (this.isGenerated) {
              this.GetStudentPassFailResultData();
            } else {
              this.ResultData = [];
              this.toastr.info("Result is not yet generated.");
            }
          } else {
            this.toastr.error(data.ErrorMessage);
          }
        });
      
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }

  async GetStudentPassFailResultData() {
    try {
      this.loaderService.requestStarted();
      this.ResultData = [];

      await this.itiResultService.GetStudentPassFailResultData(this.requestPassFailModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.ResultData = data.Data;
            this.loadInTable();
            console.log('test ==>',this.ResultData)
          } else {
            this.toastr.error(data.ErrorMessage);
          }
        });
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }

  handleChangeSemester() {
    debugger
    this.ResultData = [];
    this.searchData();
  }

  async GetITIStudent_Marksheet(rollNo:any) {

    try {

      this.loaderService.requestStarted();
      const MarksheetSearch = new StudentMarksheetSearchModel();
      MarksheetSearch.EndTermID = this.sSOLoginDataModel.EndTermID;
      MarksheetSearch.RollNo = rollNo;
      MarksheetSearch.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
      await this.ReportServices.GetITIStudent_Marksheet(MarksheetSearch)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger
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
            link.download = 'StudentMarksheet.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(data['Message'])
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(error)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

 
  async GetITICollegeStudent_Marksheet() {

    try {

      this.loaderService.requestStarted();

      this.MarksheetSearch.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
      this.MarksheetSearch.EndTermID = this.sSOLoginDataModel.EndTermID

      await this.ItiResultDownloadService.GetITICollegeList(this.MarksheetSearch)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          data = JSON.parse(JSON.stringify(data));
          debugger
          if (data && data.Data) {
            if (Object.keys(data).includes('Data')) {
              this.GetStudentITI_MarksheetList = data['Data'];
              console.log('List of Data ====>', this.GetStudentITI_MarksheetList)
            }
            else {
              this.GetStudentITI_MarksheetList = [data];
            }

            console.log(data);

          } else {
            this.toastr.error(this.Message)
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ConsolidatedDownload(EnrollmentNo: any) {

    try {

      this.loaderService.requestStarted();
      this.searchRequestConsolidated.EnrollmentNo = EnrollmentNo;
      this.searchRequestConsolidated.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequestConsolidated.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
      await this.ReportServices.ITIMarksheetConsolidated(this.searchRequestConsolidated)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
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
            link.download = EnrollmentNo+'_consolidated_marksheet.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async DownloadSCVTCertificate(EnrollmentNo: any) {
    try {

      this.loaderService.requestStarted();
      const request = new ITIStateTradeCertificateSearchModel();
      request.EnrollmentNo = EnrollmentNo;
      request.EndTermID = this.sSOLoginDataModel.EndTermID;
      request.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
      await this.ReportServices.ITIStateTradeCertificateReport(request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
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
            link.download = EnrollmentNo + '_certificate.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetITITradeList() {
    debugger
    try {
      this.loaderService.requestStarted();
      this.TradeListData = [];

      await this.itiResultService.GetITITradeList(this.requestPassFailModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.TradeListData = data.Data;
            console.log('Trade list data ==>', this.TradeListData)
            this.loadInTable();
          } else {
            this.toastr.error(data.ErrorMessage);
          }
        });
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }

}
