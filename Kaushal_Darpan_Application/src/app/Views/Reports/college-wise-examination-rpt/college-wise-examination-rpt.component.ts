import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';  // Import MatSort
import { CollegesWiseExaminationRptsModel } from '../../../Models/CollegesWiseExaminationRptsModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-college-wise-examination-rpt',
  standalone: false,
  templateUrl: './college-wise-examination-rpt.component.html',
  styleUrl: './college-wise-examination-rpt.component.css'
})
export class CollegeWiseExaminationRptComponent {
  public CollegeWiseExaminationRptModellList: CollegesWiseExaminationRptsModel[] = [];
  // Columns to be displayed in the table
  displayedColumns: string[] = [
    'SrNo', 'CollegeName', 'TotalStudents',
    'PendingToSubmitted', 'PendingToFeePaid',
    'PendingToExamination', 'EligibleForExamination', 'FirstYearExamination', 'SecondYearExamination'
  ];
  dataSource: MatTableDataSource<CollegesWiseExaminationRptsModel> = new MatTableDataSource();

  // Pagination Properties
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;

  // Search text for table filter
  Table_SearchText: string = '';

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(private loaderService: LoaderService, private reportService: ReportService) { }

  ngOnInit(): void {
    this.GetAllData();
  }


  exportToExcel(): void {
    //const unwantedColumns = [
    //  'EndTermID', 'InstituteID', 'Selected', 'SemesterID', 'Status', 'StreamID', 'StudentID'
    //];
    //const filteredData = this.viewAdminDashboardList.map(item => {
    //  const filteredItem: any = {};
    //  Object.keys(item).forEach(key => {
    //    if (!unwantedColumns.includes(key)) {
    //      filteredItem[key] = item[key];
    //    }
    //  });
    //  return filteredItem;
    //});
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.CollegeWiseExaminationRptModellList);
    // Create a new Excel workbook this.PreExamStudentData
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  }


  // Fetching the data from the service and updating the table
  async GetAllData() {
    this.CollegeWiseExaminationRptModellList = [];
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetCollegesWiseExaminationReportsData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.CollegeWiseExaminationRptModellList = data['Data'];
            this.dataSource = new MatTableDataSource(this.CollegeWiseExaminationRptModellList);
            this.dataSource.sort = this.sort;  // Apply sorting
            this.totalRecords = this.CollegeWiseExaminationRptModellList.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
            console.log(this.CollegeWiseExaminationRptModellList,"examination data")
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  // Handle page change event for pagination
  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    this.updateTable();
  }

  // Apply the filter for College Name
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    if (startIndex >= this.totalRecords) {
      this.currentPage = Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
    }
    const adjustedEndIndex = Math.min(endIndex, this.totalRecords);
    this.dataSource.data = this.CollegeWiseExaminationRptModellList.slice(startIndex, adjustedEndIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

}
