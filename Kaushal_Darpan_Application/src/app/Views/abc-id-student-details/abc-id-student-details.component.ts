import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { StreamMasterService } from '../../Services/BranchesMaster/branches-master.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { AbcIdStudentDetailsService } from '../../Services/ABCIDStudentDetails/abc-id-student-details.service';
import { AbcIdStudentDetailsSearchModel, StudentMasterModel } from '../../Models/StudentMasterModels';
import { ABCIDStudentDetailsDataModel } from '../../Models/ABCIDStudentDetailsDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import * as XLSX from 'xlsx';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-abc-id-student-details',
  templateUrl: './abc-id-student-details.component.html',
  styleUrls: ['./abc-id-student-details.component.css'],
  standalone: false
})
export class AbcIdStudentDetailsComponent implements OnInit {
  ABCFormGroup!: FormGroup;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public AbcIdStudentDetailsList: any = [];
  public BranchList: any = [];
  public selectedStudent: any = {};  // Store selected student details
  public showModal: boolean = false; // Control modal visibility
  public searchByEnrollmentNo: string = '';
  public searchByBranch: string = '';
  public request = new StudentMasterModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  filledABCID: number = 0;
  pendingABCID: number = 0;
  public searchRequest = new AbcIdStudentDetailsSearchModel();

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
    private AbcIdStudentDetailsService: AbcIdStudentDetailsService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private branchservice: StreamMasterService,
    private http: HttpClient,
    public appsettingConfig: AppsettingService
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSOLoginDataModel.UserID;

    await this.GetBranchList();
    this.getABCIDRecordCount();
    this.GetAbcIdStudentDetailsList()
    //await this.GetAbcIdStudentDetailsList();
  }

  async GetBranchList() {
    try {
      this.loaderService.requestStarted();
      await this.branchservice.GetAllData().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        this.BranchList = data['Data'];
        console.log(this.BranchList, "BranchList")
      });
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetAbcIdStudentDetailsList() {
    this.searchRequest.DepartmentId = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.loaderService.requestStarted();
    await this.AbcIdStudentDetailsService.GetAllData(this.searchRequest)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.AbcIdStudentDetailsList = data['Data'];
          //table feature load
          this.loadInTable();
          //end table feature load
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
          this.AbcIdStudentDetailsList = data['Data'];
          this.loadInTable();
        } else {
          this.toastr.error(data.ErrorMessage || 'Error fetching data.');
        }
      }, error => console.error(error));
  }

  ResetControl() {
    this.searchRequest.BranchId = 0;
    this.searchRequest.EnrollmentNo = '';
    this.GetAbcIdStudentDetailsList();
  }

  onEdit(content: any, student: any) {
    this.selectedStudent = { ...student }; // Copy the selected student data to the modal form
    this.modalReference = this.modalService.open(content, { size: 'sm', backdrop: 'static' });
  }

  closeModal() {
    this.modalReference?.close();
  }

  async SaveABCIDData() {
    this.isSubmitted = true;

    if (!this.selectedStudent.StudentID || !this.selectedStudent.ABCID) {
      this.toastr.error('ABC ID are required');
      return;
    }

    if (!this.selectedStudent.ABCID || this.selectedStudent.ABCID === 0) {
      this.toastr.error('ABC ID is required and cannot be 0');
      return;
    }

    if (this.selectedStudent.ABCID == this.selectedStudent.ExistingABCID) {
      this.toastr.error('The provided ABC ID is the same as the existing ABC ID');
      return;
    }

    try {
      this.loaderService.requestStarted();
      this.isLoading = true;

      await this.AbcIdStudentDetailsService.SaveData(this.selectedStudent)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State === EnumStatus.Success) {
            this.toastr.success(this.Message);
            this.ResetControl();
            this.closeModal();
            this.ngOnInit();
          } else {
            this.toastr.error(this.ErrorMessage || 'Failed to save ABC ID');
          }
        });
    } catch (ex) {
      this.toastr.error('An unexpected error occurred');
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  async getABCIDRecordCount() {
    try {
      await this.AbcIdStudentDetailsService.GetABCIDCount(this.request)
        .then((data: any) => {
          if (data && Array.isArray(data.Data) && data.Data.length > 0) {
            const counts = data.Data[0];
            this.filledABCID = counts['Total Filled ABCID'];
            this.pendingABCID = counts['Total Pending ABCID'];
          } else {
          }
        }, (error) => {
          console.error('Error fetching ABC ID record count:', error);
        });
    } catch (ex) {
      console.error('Exception in getABCIDRecordCount:', ex);
    }
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
    this.paginatedInTableData = [...this.AbcIdStudentDetailsList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.AbcIdStudentDetailsList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.AbcIdStudentDetailsList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.AbcIdStudentDetailsList.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.AbcIdStudentDetailsList.forEach((x: any) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.AbcIdStudentDetailsList.filter((x: any) => x.StudentID == item.StudentID);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.AbcIdStudentDetailsList.every((r: any) => r.Selected);
  }
  // end table feature


  async DownloadABCIDSummaryReport() {
    let obj = {
      DepartmentId: this.sSOLoginDataModel.DepartmentID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      RoleID: this.sSOLoginDataModel.RoleID,
      FinancialYearID: this.sSOLoginDataModel.FinancialYearID
    }
    this.loaderService.requestStarted();
    await this.AbcIdStudentDetailsService.DownloadABCIDSummaryReport(obj)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          let DownloadABCIDSummaryReportList = data['Data'];
          //table feature load
          this.exportToExcel(DownloadABCIDSummaryReportList, "DownloadABCIDSummaryReportList");
          //end table feature load
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage || 'Error fetching data.');
        }
      }, error => console.error(error));
  }

  async DownloadConsolidateABCIDReport() {
    let obj = {
      DepartmentId : this.sSOLoginDataModel.DepartmentID,
      Eng_NonEng : this.sSOLoginDataModel.Eng_NonEng,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      RoleID : this.sSOLoginDataModel.RoleID,
      FinancialYearID : this.sSOLoginDataModel.FinancialYearID
    }
  
    this.loaderService.requestStarted();
    await this.AbcIdStudentDetailsService.DownloadConsolidateABCIDReport(obj)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          let DownloadConsolidateABCIDReportList = data['Data'];
          //table feature load
          this.exportToExcel(DownloadConsolidateABCIDReportList, "DownloadConsolidateABCIDReport");
          //end table feature load
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage || 'Error fetching data.');
        }
      }, error => console.error(error));
  }

  exportToExcel(ReportList:any[], type:any): void {
    const unwantedColumns = [
      'EndTermID', 'InstituteID', 'InstituteIDs', 'CenterID', 'DistrictID', 'InstituteNames', 'UserID'
    ];
    const filteredData = ReportList.map(item => {
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
    XLSX.writeFile(wb, type + '.xlsx');
  }

  DownloadFile(fileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${fileName}`;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe(blob => {
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = this.generateFileName('pdf');
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }


}
