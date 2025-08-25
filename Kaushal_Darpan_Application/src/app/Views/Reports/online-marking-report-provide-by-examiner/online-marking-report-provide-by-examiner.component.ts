import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { CollegesWiseReportsModel } from '../../../Models/CollegesWiseReportsModel';
import { CommonDDLSubjectCodeMasterModel } from '../../../Models/CommonDDLSubjectMasterModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ICompanyMasterDataModel, CompanyMasterSearchModel } from '../../../Models/CompanyMasterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CompanyMasterService } from '../../../Services/CompanyMaster/company-master.service.ts';
import { OnlineMarkingReportModel, OnlineMarkingSearchModel } from '../../../Models/OnlineMarkingReportDataModel';

@Component({
  selector: 'app-online-marking-report-provide-by-examiner',
  standalone: false,
  templateUrl: './online-marking-report-provide-by-examiner.component.html',
  styleUrl: './online-marking-report-provide-by-examiner.component.css'
})



export class OnlineMarkingReportProvideByExaminerComponent implements OnInit {
  public OnlineMarkingReportList: OnlineMarkingReportModel[] = [];
  public Table_SearchText: string = "";
  public searchRequest = new OnlineMarkingSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private commonMasterService: CommonFunctionService, private reportService: ReportService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllData();
  }


  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'GroupCodeID', 'ExaminerID'
    ];
    const filteredData = this.OnlineMarkingReportList.map((item: any) => {
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
    XLSX.writeFile(wb, 'MarkingReportData.xlsx');
  }

  async GetAllData() {
    try {
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.loaderService.requestStarted();
      await this.reportService.GetOnlineReportProvideByExaminer(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.OnlineMarkingReportList = data.Data;
        console.log(this.OnlineMarkingReportList,"GetOnlineReport")
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

  // get all data
  async ClearSearchData() {
    this.searchRequest.GroupCode = 0;
    this.searchRequest.IsPresentTheory = 2;
    await this.GetAllData();
  }

}
