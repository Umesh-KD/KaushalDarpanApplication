import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GetApplicationFeesTransactionSearchModel } from '../../../Models/StudentFeesTransactionHistoryRptBasedDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { StudentFeesTransactionHistoryRptService } from '../../../Services/Report/Student-Fees-Transaction-History-Rpt/student-fees-transaction-history-rpt.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import { TransactionStatusDataModel } from '../../../Models/PaymentDataModel';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-application-fees-transaction-history',
  templateUrl: './application-fees-transaction-history.component.html',
  styleUrl: './application-fees-transaction-history.component.css',
  standalone: false
})
export class ApplicationFeesTransactionHistoryComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  public StudentFeesTransactionHistoryList: any[] = [];
  public searchRequest = new GetApplicationFeesTransactionSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  public ITITspAreasId: number | null = null;
  sSOLoginDataModel = new SSOLoginDataModel();
  masterSelected: boolean = false;
  SelectIDs: number[] = [];
  selectedItems: any[] = [];
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
    private StudentFeesTransactionHistoryRptService: StudentFeesTransactionHistoryRptService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private emitraPaymentService: EmitraPaymentService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {
  }
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    // await this.GetApplicationFeesTransaction();
  }
  checkUncheckAll() {
    for (let item of this.paginatedInTableData) {
      item.isSelected = this.masterSelected;
    }
    this.isAllSelected();
  }

  // On any checkbox change, sync the master checkbox and selected list
  isAllSelected() {
    this.masterSelected = this.paginatedInTableData.every((item) => item.isSelected);
    this.selectedItems = this.paginatedInTableData
      .filter((item) => item.isSelected)
      .map((item) => ({
        TransactionId: item.TransactionId,
        ApplicationID: item.ApplicationID,
        PRN: item.PRN,
        PaidAmount: item.PaidAmount,
        subsidyserviceid: item.subsidyserviceid,
        DepartmentID: item.DepartmentID
      }));

    console.log(this.selectedItems);
  }
  selectAll() {
    this.paginatedInTableData.forEach((item: any) => {
      item.isSelected = this.masterSelected;
    });

    this.isAllSelected();
  }
  async CheckPaymentSataus(request: any) {
    try {
      let obj: TransactionStatusDataModel = {
        TransactionID: request.TransactionId,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        PRN: request.PRN,
        ServiceID: request.subsidyserviceid,
        ApplicationID: request.ApplicationID.toString(),
        AMOUNT: request.PaidAmount,
        RPPTXNID: "",
        SubOrderID: "",
        CreatedBy: this.sSOLoginDataModel.UserID,
        SSOID: this.sSOLoginDataModel.SSOID,
        ExamStudentStatus: 0
        // ExamStudentStatus: request.TransctionStatus
      }
      await this.emitraPaymentService.EmitraApplicationVerifyPaymentStatus(obj)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {
            if (data.Data?.STATUS == 'SUCCESS' || data.Data?.STATUS == 'Success') {
              if (data.Data?.PRN) {
                this.toastr.success('Fee Paid Successfylly ');
                //this.router.navigate(['/ApplicationPaymentStatus'], { queryParams: { TransID: data.Data.PRN } });
                await this.GetApplicationFeesTransaction();
              }
            }
            else {
              this.toastr.error(this.Message)
            }
          }
          else {
            this.toastr.error(this.ErrorMessage)
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
  // async getStudentFeesTransactionHistoryList() {
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.StudentFeesTransactionHistoryRptService.GetStudentFeesTransactionHistoryData(this.searchRequest)
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         this.StudentFeesTransactionHistoryList = data['Data'];         



  //         console.log(this.StudentFeesTransactionHistoryList, "StudentFeesTransactionHistoryList")
  //       }, error => console.error(error));
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  async GetApplicationFeesTransaction() {
    try {
      this.loaderService.requestStarted();
      await this.StudentFeesTransactionHistoryRptService.GetApplicationFeesTransaction(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentFeesTransactionHistoryList = data['Data'];

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
    this.searchRequest = new GetApplicationFeesTransactionSearchModel();
    this.searchRequest.DepartmentID = EnumDepartment.BTER;
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    this.GetApplicationFeesTransaction();
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

  async VerifyALlDetail() {
    debugger;
    try {
      for (const item of this.selectedItems) {
        let obj: TransactionStatusDataModel = {
          TransactionID: item.TransactionId,
          DepartmentID: item.DepartmentID,
          PRN: item.PRN,
          ServiceID: item.subsidyserviceid,
          ApplicationID: item.ApplicationID.toString(),
          AMOUNT: item.PaidAmount,
          RPPTXNID: "",
          SubOrderID: "",
          CreatedBy: this.sSOLoginDataModel.UserID,
          SSOID: this.sSOLoginDataModel.SSOID,
          ExamStudentStatus: 0
        };
        await this.emitraPaymentService.EmitraApplicationVerifyPaymentStatus(obj)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];

            if (data.State == EnumStatus.Success) {
              if (data.Data?.STATUS?.toUpperCase() === 'SUCCESS') {
                if (data.Data?.PRN) {
                  this.toastr.success(`Fee Paid Successfully for PRN: ${data.Data.PRN}`);
                  await this.GetApplicationFeesTransaction(); // Refresh after each successful payment
                }
              } else {
                this.toastr.error(this.Message);
              }
            } else {
              this.toastr.error(this.ErrorMessage);
            }
          })

          .catch(err => {
            console.error('Payment check failed for one item:', err);
            this.toastr.error('Payment check failed for one item');
          });
      }
      this.selectedItems = [];
    } catch (ex) {
      console.error('Unexpected error:', ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }
}
