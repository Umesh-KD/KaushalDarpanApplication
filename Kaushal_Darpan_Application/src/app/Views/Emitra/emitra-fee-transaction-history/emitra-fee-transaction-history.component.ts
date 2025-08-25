import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { GetApplicationFeesTransactionSearchModel, GetEmitraFeesTransactionSearchModel, StudentFeesTransactionHistoryRptModel, StudentFeesTransactionHistorySearchmodel } from '../../../Models/StudentFeesTransactionHistoryRptBasedDataModel';
import { StudentFeesTransactionHistoryRptService } from '../../../Services/Report/Student-Fees-Transaction-History-Rpt/student-fees-transaction-history-rpt.service';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { TransactionStatusDataModel } from '../../../Models/PaymentDataModel';
import { CommonModule, DatePipe } from '@angular/common';
import { ReportService } from '../../../Services/Report/report.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-emitra-fee-transaction-history',
  templateUrl: './emitra-fee-transaction-history.component.html',
  styleUrl: './emitra-fee-transaction-history.component.css',
  standalone: false
})
export class EmitraFeeTransactionHistoryComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  public StudentFeesTransactionHistoryList: any[] = [];
  request = new StudentFeesTransactionHistoryRptModel()
  public searchRequest = new GetEmitraFeesTransactionSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  public ITITspAreasId: number | null = null;
  sSOLoginDataModel = new SSOLoginDataModel();
  public SemesterMasterDDLList: any = []
  public StreamMasterDDLList: any = []

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


  constructor(
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private StudentFeesTransactionHistoryRptService: StudentFeesTransactionHistoryRptService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private emitraPaymentService: EmitraPaymentService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private reportService: ReportService,
    private appsettingConfig: AppsettingService, private http: HttpClient, private toastrService: ToastrService
  ) {
  }   
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("this.sSOLoginDataModel", this.sSOLoginDataModel);
    this.searchRequest.DepartmentID = EnumDepartment.BTER;
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    this.searchRequest.CourseType = this.sSOLoginDataModel.Eng_NonEng
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID
    await this.getStudentFeesTransactionHistoryList();
    this.getSemesterMasterList()
    this.getStreamMasterList()
  }

  async getSemesterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async CheckPaymentSataus(request: any) {
    try {

      let obj: TransactionStatusDataModel =
      {
        TransactionID: request.TransactionId,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        PRN: request.PRN,
        ServiceID: request.subsidyserviceid,
        ApplicationID: request.StudentID.toString(),
        AMOUNT: request.PaidAmount,
        RPPTXNID: "",
        SubOrderID: "",
        CreatedBy: this.sSOLoginDataModel.UserID,
        SSOID: this.sSOLoginDataModel.SSOID,
        ExamStudentStatus: request.ExamStudentStatus
        // ExamStudentStatus: request.TransctionStatus
      }
      await this.emitraPaymentService.GetTransactionStatus(obj)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          if (data.State == EnumStatus.Success) {
            if (data.Data?.STATUS == 'SUCCESS' || data.Data?.STATUS == 'Success') {
              if (data.Data?.PRN) {
                this.toastr.success('Fee Paid Successfylly ');
                await this.getStudentFeesTransactionHistoryList();
              }
            }
            else {
              this.toastr.error(this.Message)
            }
          }
          else {
            this.toastr.error(this.Message)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async getStudentFeesTransactionHistoryList() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.DepartmentID = 0;
      await this.StudentFeesTransactionHistoryRptService.GetEmitraFeesTransactionHistory(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentFeesTransactionHistoryList = data['Data'];
          console.log(this.StudentFeesTransactionHistoryList, "StudentFeesTransactionHistoryList")
          //table feature load
          this.loadInTable();
          //end table feature load

          console.log(this.StudentFeesTransactionHistoryList, "StudentFeesTransactionHistoryList")
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

  async resetControl() {
    this.searchRequest = new GetEmitraFeesTransactionSearchModel();
    this.searchRequest.DepartmentID = EnumDepartment.BTER;
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    this.searchRequest.CourseType = this.sSOLoginDataModel.Eng_NonEng
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID
    this.getStudentFeesTransactionHistoryList();
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
    this.paginatedInTableData = [...this.StudentFeesTransactionHistoryList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.StudentFeesTransactionHistoryList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.StudentFeesTransactionHistoryList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.StudentFeesTransactionHistoryList.filter(x => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.StudentFeesTransactionHistoryList.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.StudentFeesTransactionHistoryList.filter(x => x.StudentID == item.StudentID);
    data.forEach(x => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.StudentFeesTransactionHistoryList.every(r => r.Selected);
  }
  // end table feature


  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
    ];
    const filteredData = this.StudentFeesTransactionHistoryList.map(item => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'StudentFeesTransactionHistoryList.xlsx');
  }


  async FeeReceipt(item: any) {
    this.GetStudentFeeReceipt(item)
  }

  async GetStudentFeeReceipt(item: any) {
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetStudentFeeReceipt(item.TransactionId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, item);
          }
          else {
            this.toastrService.error(data.ErrorMessage)
            //    data.ErrorMessage
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
  DownloadFile(FileName: string, DownloadfileName: any): void {
    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf', DownloadfileName); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string, DownloadfileName: any): string {
    //const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    const timestamp = DownloadfileName.StudentName.replace(/[:.-]/g, '_').replace('', '_'); // Replace invalid characters
    const timestamp2 = DownloadfileName.PRN.replace(/[:.-]/g, '_').replace('', '_'); // Replace invalid characters
    return `${timestamp}${timestamp2}.${extension}`;
  }

}
