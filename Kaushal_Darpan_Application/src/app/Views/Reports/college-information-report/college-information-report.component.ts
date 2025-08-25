import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';  // Import MatSort
import {  GetCollegeInformationReport } from '../../../Models/GenerateAdmitCardDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { OnlineMarkingReportModel, OnlineMarkingSearchModel } from '../../../Models/OnlineMarkingReportDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-college-information-report',
  standalone: false,
  templateUrl: './college-information-report.component.html',
  styleUrl: './college-information-report.component.css'
})
export class CollegeInformationReportComponent {

  public CollegeInformationReportList: GetCollegeInformationReport[] = [];
  public Table_SearchText: string = "";
  public searchRequest = new GetCollegeInformationReport();
  public sSOLoginDataModel = new SSOLoginDataModel();

  // Pagination Properties
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;

  constructor(private loaderService: LoaderService, private reportService: ReportService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetAllData();
  }

  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'GroupCodeID', 'ExaminerID'
    ];
    const filteredData = this.CollegeInformationReportList.map((item: any) => {
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
    XLSX.writeFile(wb, 'CollegeInformationReportData.xlsx');
  }

  async GetAllData() {
    try {
      this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
 
      this.loaderService.requestStarted();
      await this.reportService.GetCollegesInformationReportsData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CollegeInformationReportList = data.Data;
      }, (error: any) => console.error(error))
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

}
