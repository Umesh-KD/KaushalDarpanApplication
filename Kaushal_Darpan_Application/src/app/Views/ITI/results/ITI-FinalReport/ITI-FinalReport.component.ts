import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { GlobalConstants, EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CenterObserverSearchModel, CenterObserverDataModel } from '../../../../Models/CenterObserverDataModel';
import { ItiGetResultDataModel } from '../../../../Models/ITI/ITI_ResultModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ITIResultService } from '../../../../Services/ITIResult/iti-result.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { StudentMarksheetSearchModel } from '../../../../Models/OnlineMarkingReportDataModel';
import { ReportService } from '../../../../Services/Report/report.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-ITI-FinalReport',
  standalone: false,
  templateUrl: './ITI-FinalReport.component.html',
  styleUrl: './ITI-FinalReport.component.css'
})
export class ITIFinalReportComponent {
  public Table_SearchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public ResultData: any[] = [];
  public searchRequest = new CenterObserverSearchModel();
  closeResult: string | undefined;
  // CenterObserverTeamID: number = 0
  modalReference: NgbModalRef | undefined;
   public requestObs = new CenterObserverDataModel()
  // public _EnumDeploymentStatus = EnumDeploymentStatus;
  //public Status: number = 0           // 1 for varify observer deployment and 2 for Generate Order for deployment
  public _GlobalConstants = GlobalConstants
  public _EnumRole = EnumRole;

    //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default

  //  VerifyDeploymentForm!: FormGroup;
  //  public allowedDates: string[] = []
  //  public TimeTableDates: any = []




   isPublished: boolean = false; // Flag to check if the exam is published
   isGenerated : boolean = false; // Flag to check if the order is generated
   modeType:string = ''; // Mode type for the operation (Generate or Publish)
   requestModel : ItiGetResultDataModel = new ItiGetResultDataModel();
   selectedYear: number = 0; // Variable to hold the selected year for filtering results




  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  public MobileNo: number = 0;
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public GetfilteredList: any[] = [];
  constructor(
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private sMSMailService: SMSMailService,
    private route: ActivatedRoute,
    private appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
    private itiResultService: ITIResultService,
    private fb: FormBuilder, private reportService: ReportService,
  ) {}

  async ngOnInit() {
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.sSOLoginDataModel);
    this.MobileNo = Number(this.sSOLoginDataModel.Mobileno);
    this.requestModel.UserID = Number(this.sSOLoginDataModel.UserID);
    this.requestModel.EndTermID = Number(this.sSOLoginDataModel.EndTermID);
    this.requestModel.FinancialYearID = Number(this.sSOLoginDataModel.FinancialYearID);
     this.requestModel.InstituteID = Number(this.sSOLoginDataModel.InstituteID);
   
}
  CloseModalPopup() {
    this.modalService.dismissAll();
    // this.requestInv = new TimeTableInvigilatorModel()
  }

  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
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
 
  async ExDownloadFinalReport(){
    try {
      debugger
      this.loaderService.requestStarted();
      const object = {
        CollegeID: 0,
        FinancialYearID: 0,
        EndTermID: 0,
        Action: '',
        UserID: 0
      };
      await this.reportService.GetITI_FinalReport(object).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.GetfilteredList = data["Data"];
          this.exportToExcelTpye();
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

 
  exportToExcelTpye(): void {
    debugger;

    if (!this.GetfilteredList || this.GetfilteredList.length === 0) {
      alert('No data available to export.');
      return;
    }

    const fixedColumns = [
      'Reg_Ex',
      'Year1',
      'Trainee_Photo',
      'Acd_Session',
      'Enrollment_number',
      'Roll_number',
      'Trainee_Name',
      'Father_Name',
      'Mother_Name',
      'Date_of_Birth',
      'DOB',
      'Gender',
      'Trade_ID',
      'Trade_Code',
      'Trade_Name',
      'NSQF_Lavel',
      'Course_Duration',
      'Course_Type',
      'E_N',
      'Exam_MM-YY',
      'Result-Dec-DD',
      'Institute_ID',
      'Institute_Code',
      'Institute_Name',
      'Short_Name',
      'Grade(Optional)',
      'Total_Grace',
      'Theory',
      'Th_Grace',
      'Th_Total',
      'Th_Year',
      'Th_Result',
      'ES',
      'ES_Grace',
      'ES_Total',
      'ES_Year',
      'ES_Result',
      'WS',
      'WS_Grace',
      'WS_Total',
      'WS_Year',
      'WS_Result',
      'ED',
      'ED_Grace',
      'ED_Total',
      'ED_Year',
      'ED_Result',
      'Practical',
      'PR_Year',
      'PR_Result',
      'Formative Assessment',
      'FA_Year',
      'FA_Result',
      'Grand_Total',
      'Final_Result',
      'Result',
      'Eligible',
      'Serial_Number',
      'Sort_Order',
      'TP_From',
      'TP_To',
      'Last_App',
      'Detained',
      'Detained_T',
      'UFM',
      'UFM_Marks',
      'RWH_Marks',
      'Revised',
      'Remark',
      'Flag',
      'Extra'
    ];

    // Get all available columns
    const allHeaders = Object.keys(this.GetfilteredList[0]);

    // Keep fixed columns that exist in data
    const orderedFixedColumns = fixedColumns.filter(col =>
      allHeaders.includes(col)
    );

    // Append remaining columns
    const otherColumns = allHeaders.filter(col =>
      !orderedFixedColumns.includes(col)
    );

    const headers = [...orderedFixedColumns, ...otherColumns];

    // Prepare data rows
    const rows = this.GetfilteredList.map((item: any) =>
      headers.map(header => item[header] ?? '')
    );

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

    // Add header row
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });

    // Add data rows
    XLSX.utils.sheet_add_aoa(ws, rows, { origin: 'A2' });

    // Set column widths
    ws['!cols'] = headers.map(() => ({ wch: 18 }));

    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Append worksheet
    XLSX.utils.book_append_sheet(wb, ws, 'Final Report');

    // Export Excel
    XLSX.writeFile(
      wb,
      `FinalReport_${new Date().getTime()}.xlsx`
    );
  }
 

}
