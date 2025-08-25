import { Component, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EnumRole } from '../../../Common/GlobalConstants';
import { PlacementReportSearchData, StudentExamDetails } from '../../../Models/DashboardCardModel';
import { ViewPlacedStudentService } from '../../../Services/ViewPlacedStudent/View-placed-student.service';
import * as XLSX from 'xlsx';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-placement-data-report',
  standalone: false,
  templateUrl: './placement-data-report.component.html',
  styleUrl: './placement-data-report.component.css'
})
export class PlacementDataReportComponent {
  Message: string = '';
  ErrorMessage: string = '';
  State: boolean = false;
  viewAdminDashboardList: StudentExamDetails[] = [];
  public searchRequest = new PlacementReportSearchData();
  displayedColumns: string[] = ['SrNo', 'CollegeName', 'StudentName', 'Branch', 'Company', 'Date', 'Gender', 'Category', 'Package'];
  dataSource: MatTableDataSource<StudentExamDetails> = new MatTableDataSource();
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;

  public BranchList: any = []
  public CollegeList: any = [] 

  id: any;
  _EnumRole = EnumRole;
  Table_SearchText: string = '';
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  public sSOLoginDataModel = new SSOLoginDataModel();
  constructor(
    private ViewPlacedStudentService: ViewPlacedStudentService, private commonMasterService: CommonFunctionService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.loadDropdownData('CollegeName');
    this.loadDropdownData('Branchname');
    this.GetAllData();
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.viewAdminDashboardList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'PlacementDataReports.xlsx');
  }


  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'CollegeName':
          this.CollegeList = data['Data'];
          break;
        case 'Branchname':
          this.BranchList = data['Data'];
          console.log(this.BranchList, "datatatata")
          break;
        default:
          break;
      }
    });
  }


  async GetAllData() {
    try {
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.CourseType = this.sSOLoginDataModel.Eng_NonEng;

      await this.ViewPlacedStudentService.GetAllPlacementReportData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.viewAdminDashboardList = data['Data'];
          this.dataSource = new MatTableDataSource(this.viewAdminDashboardList);
          this.dataSource.sort = this.sort;
          this.totalRecords = this.viewAdminDashboardList.length;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          this.updateTable();
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        // this.loaderService.requestEnded();
      }, 200);
    }
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    this.updateTable();
  }

  applyFilter(filterValue: string): void {
    if (filterValue === "all") {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    if (startIndex >= this.totalRecords) {
      this.currentPage = Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
    }
    const adjustedEndIndex = Math.min(endIndex, this.totalRecords);
    this.dataSource.data = this.viewAdminDashboardList.slice(startIndex, adjustedEndIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

}
