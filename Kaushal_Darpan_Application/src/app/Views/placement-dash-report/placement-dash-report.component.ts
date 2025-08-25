import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { StudentExamDetails } from '../../Models/DashboardCardModel';
import { EnumRole } from '../../Common/GlobalConstants';
import { PlacementReportService } from '../../Services/PlacementReport/PlacementReport.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { PlacementReportSearchModels } from '../../Models/PlacementDashReportModel';

@Component({
  selector: 'app-placement-dash-report',
  templateUrl: './placement-dash-report.component.html',
  styleUrls: ['./placement-dash-report.component.css'],
  standalone: false
})
export class PlacementDashReportComponent implements OnInit {
  Message: string = '';
  ErrorMessage: string = '';
  State: boolean = false;
  viewAdminDashboardList: StudentExamDetails[] = [];
  filteredData: any[] = [];
  displayedColumns: string[] = ['SrNo', 'StudentName', 'EnrollmentNo', 'InstituteName', 'InstitutionManagementType', 'Email', 'FatherName', 'DOB', 'Age', 'GenderName'];
  dataSource: MatTableDataSource<StudentExamDetails> = new MatTableDataSource();
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  sSOLoginDataModel: any;
  id: any;
  _EnumRole = EnumRole;
  InstituteMasterList: any = [];
  SemesterMasterList: any = [];
  Table_SearchText: string = '';
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(
    private PlacementDashService: PlacementReportService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private commonMasterService: CommonFunctionService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id')
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetAllData();

    await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterList = data['Data'];
      }, (error: any) => console.error(error));

    await this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterList = data['Data'];
      }, (error: any) => console.error(error));
  }


  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.viewAdminDashboardList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  }

  async GetAllData() {
    let requestData: PlacementReportSearchModels = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      CollegeID : this.sSOLoginDataModel.InstituteID,
      Id: this.id,
      Gender: '',
      StudentName: ''
    }

    await this.PlacementDashService.GetAllData(requestData)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        this.viewAdminDashboardList = data['Data'];
        this.filteredData = [...this.viewAdminDashboardList]; // Copy full dataset
        this.dataSource = new MatTableDataSource(this.filteredData);
        this.dataSource.sort = this.sort;
        this.totalRecords = this.filteredData.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.updateTable();
      }, (error: any) => console.error(error)
      );
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    this.updateTable();
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim().toLowerCase();

    if (filterValue === "all" || filterValue === "") {
      this.filteredData = [...this.viewAdminDashboardList]; // Reset to full dataset
    } else {
      this.filteredData = this.viewAdminDashboardList.filter(item =>
        Object.values(item).some(value =>
          value != null && value.toString().toLowerCase().includes(filterValue)
        )
      );
    }

    this.totalRecords = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.currentPage = 1; // Reset to first page after filtering
    this.updateTable();
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);

    this.dataSource.data = this.filteredData.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }


}


