import { Component, Input } from '@angular/core';
import { StudentMeritInfoModel } from '../../../Models/StudentMeritInfoDataModel';
import { StudentItiResultModel, StudentSearchModel } from '../../../Models/StudentSearchModel';
import { EmitraRequestDetails } from '../../../Models/PaymentDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StudentDetailsModel } from '../../../Models/StudentDetailsModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumDepartment, enumExamStudentStatus, EnumRole, EnumStatus, EnumVerificationAction, GlobalConstants } from '../../../Common/GlobalConstants';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ApplicationStatusService } from '../../../Services/ApplicationStatus/EmitraApplicationStatus.service';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../../../Services/Student/student.service';
import { DocumentDetailsService } from '../../../Common/document-details';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { UploadFileModel } from '../../../Models/UploadFileModel';
import { DeleteDocumentDetailsModel } from '../../../Models/DeleteDocumentDetailsModel';
import { ITIStudentMeritInfoModel } from '../../../Models/ITI/ITIStudentMeritInfoDataModel';
import { EmitraApplicationstatusModel } from '../../../Models/EmitraApplicationstatusDataModel';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { ItiApplicationSearchmodel } from '../../../Models/ItiApplicationPreviewDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { HttpClient } from '@angular/common/http';
import { StudentITIResultSearchModel } from '../../../Models/OnlineMarkingReportDataModel';
import { ITIStateTradeCertificateSearchModel } from "../../../Models/TheoryMarksDataModels";

@Component({
  selector: 'app-download-ITI-Result',
  templateUrl: './download-ITI-Result.component.html',
  styleUrl: './download-ITI-Result.component.css',
  standalone: false
})
export class downloadITIResultComponent {
  public searchRequestConsolidated = new ITIStateTradeCertificateSearchModel();

  public Message: string = '';
  public ErrorMessage: string = '';
  public State: any = false;
  public StreamMasterList: [] = [];
  public SemesterList: [] = [];
  public collegeMerit8: [] = [];
  public collegeMerit10: [] = [];
  public collegeMerit12: [] = [];
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public ApplicationNo: string = '';
  public request = new ITIStudentMeritInfoModel();
  maxDate:string='';
  public EndTermList: any = [];
  public requestData: any;

  public searchRequest = new StudentSearchModel();
  public itiResultRequest = new StudentItiResultModel();
  public itiResultRequest1 = new StudentITIResultSearchModel();
  public isShowGrid: boolean = false;
  emitraRequest = new EmitraRequestDetails();
  public OTP: string = '';
  public MobileNo: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public StudenetTranList: [] = [];
  encryptedRows: any[] = [];
  itiResultData: any[] = [];
  
  public IsAlloted:boolean=false;
  studentDetailsModel = new StudentDetailsModel();
  public StudentDetailsModelList: EmitraApplicationstatusModel[] = []
  public itiResultform!: FormGroup
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public totalAmount: number = 0;
  public enumExamStudentStatus = enumExamStudentStatus;
  public SemesterName: String = ''
  public StudentSubjectList: any[] = [];

  public Studentmarkdata: any[] = [];
  
  public isSubmitted: boolean = false
  public isShowSelected: boolean = false;
  public IsdocumentShow: boolean = false
   public downloadRequest = new ItiApplicationSearchmodel()
  public isOnStatus = false;
  public itiResult = new StudentITIResultSearchModel();

  @Input() RollNo!: string;
  @Input() DOB!: string;
  @Input() EndTermID!: number;
  constructor(private loaderService: LoaderService, private commonservice: CommonFunctionService,
    private studentService: StudentService,private ApplicationStatusService:ApplicationStatusService, private modalService: NgbModal, private toastrService: ToastrService, private documentDetailsService: DocumentDetailsService,
    private emitraPaymentService: EmitraPaymentService,
    private sweetAlert2: SweetAlert2, private formBuilder: FormBuilder,
    private appsettingConfig: AppsettingService,
    private encryptionService: EncryptionService, 
    private reportService: ReportService,
    private http: HttpClient,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService
  ) { }

  async ngOnInit() {




    this.itiResultform = this.formBuilder.group({
      ID: [0, Validators.required],
      RollNo: ['', Validators.required],
      DOB: ['', Validators.required]
    });

    this.itiResultRequest.RollNo = this.RollNo;
    this.itiResultRequest.ID = this.EndTermID;
    this.itiResultRequest.DOB = this.DOB;

 


    if (this.RollNo && this.DOB && this.EndTermID) {
      this.GetITIStudent_MarksheetList();

    }



    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
     const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];



    await this.GetPublicInfoStatus();
    this.loadDropdownData('ITIEndTerm');

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
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {

      }, 200);
    }
  }

  get _itiResultform() { return this.itiResultform.controls; }


  async onSearchClick() {
    this.isSubmitted = true;  

    if (this.itiResultform.invalid) {
      this.itiResultform.markAllAsTouched(); 
      return;
    }

    await this.GetITIStudent_MarksheetList();
  }

 
  onReset() {
    debugger
    this.itiResultform.reset();
    this.itiResultRequest.RollNo ='';
    this.itiResultRequest.DOB = '';
    this.itiResultRequest.ID = 0;
    this.isShowGrid = false;
    this.isSubmitted = false;
    this.itiResultData = [];
}
  

  async GetITIStudent_MarksheetList() {
   
    this.isShowGrid = true;
    this.itiResultData = [];
    this.Studentmarkdata = [];
    this.itiResultRequest.DepartmentID = EnumDepartment.ITI;
    this.itiResultRequest.EndTermID = this.itiResultRequest.ID;
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetITIStudent_Result(this.itiResultRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success)
          {
            const table = data?.Data?.Table || [];
            const table1 = data?.Data?.Table1 || [];
            debugger;
            if (table.length > 0)
            {

              this.itiResultData = table;
              this.Studentmarkdata = table1;

            } else {

              this.itiResultData = [];
              this.Studentmarkdata = [];
              this.isShowGrid = false;  // HIDE RESULT
              this.sweetAlert2.Info("No Record Found");
            }

            console.log("iti Result Data", this.itiResultData)
          }
         

        }, (error: any) => {
          console.error(error);
        });

    } catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async OnShow(Key: number) {
    if (Key == 1) {
      this.IsdocumentShow = true
    } else {
      this.IsdocumentShow = false
    }
  }

 

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }




  async GetITIStudent_Marksheet(EnrollmentNo: any) {
    debugger
    try {

      this.loaderService.requestStarted();
      //this.itiResultSearch.en = EnrollmentNo;
      this.itiResultRequest1.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.itiResultRequest1.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
      this.itiResultRequest1.RollNo = this.itiResultRequest.RollNo;
      await this.reportService.GetITIStudent_Marksheet(this.itiResultRequest1)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
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
            link.download = EnrollmentNo + '_Marksheet.pdf';
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
      await this.reportService.ITIStateTradeCertificateReport(request)
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


  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'ITIEndTerm':
          this.EndTermList = data['Data'];
          console.log(this.EndTermList, "datatatata")
          break;
        default:
          break;
      }
    });
  }

  openDatePicker(event: any) {
    event.target.showPicker();
  }



  async ConsolidatedDownload(item: any) {

    try {
      debugger;
      this.loaderService.requestStarted();
      this.searchRequestConsolidated.EnrollmentNo = item.enrollment;
      this.searchRequestConsolidated.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequestConsolidated.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
      await this.reportService.ITIMarksheetConsolidated(this.searchRequestConsolidated)
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
            link.download = item.enrollment + '_consolidated_marksheet.pdf';
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



  printResult() {

    const printContents = document.getElementById('printSection')?.innerHTML;
    const popupWin = window.open('', '_blank', 'width=900,height=700');

    popupWin?.document.open();
    popupWin?.document.write(`
    <html>
      <head>
        
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        </style>
      </head>

      <body onload="window.print(); window.close();">
        ${printContents}
      </body>
    </html>`
    );

    popupWin?.document.close();
  }
}
