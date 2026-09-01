import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ReportService } from '../../../Services/Report/report.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CompanyMasterSearchModel, ICompanyMasterDataModel } from '../../../Models/CompanyMasterDataModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { TableColumn } from '../../../../app/Common/data-table/DatatableModels/table-column.model';
import { TableConfig } from '../../../Common/data-table/DatatableModels/table-config.model';
import { ActionType } from '../../../Common/data-table/DatatableModels/table-action.model';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
    selector: 'app-admission-allotment-report',
    templateUrl: './admission-allotment-report.component.html',
    styleUrls: ['./admission-allotment-report.component.css'],
    standalone: false
})

export class AdmissionAllotmentReportComponent implements OnInit {
  public AdmissionAllotmentDataList: any[] = [];
  public AdmissionAllotmentData_ddl: any[] = [];
  public Table_SearchText: string = "";
  public searchRequest = new CompanyMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";
  public ActionType = '';
  //public columns:TableColumn[]=[];

  constructor(private commonMasterService: CommonFunctionService, private ReportService: ReportService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2, private Router: Router, private router: ActivatedRoute,public appsettingConfig: AppsettingService,) {

  }

// -------------------------------------------------------dynamic table portion---------------------------------------------------------------------

tableConfig: TableConfig = {

   unwantedColumns: [
        'ID',
        'InstituteID',
        'CreatedBy',
        'CreatedDate',
        'StateID',
        'TradeId',
        'AcademicYearID'
    ],

};


// ----------------------------------------------------------dynamic table portion-----------------------------------------------------



  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAdmissionAllotment_ddl();
    await this.GetAllData();
  }


  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID','TradeId','AcademicYearID'
    ];
    const filteredData = this.AdmissionAllotmentDataList.map((item: any) => {
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
    XLSX.writeFile(wb, `${this.ActionType}.xlsx`);
  }

  async GetAdmissionAllotment_ddl() {
    try {
      debugger
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData("DynamicDDL_AdmissionAllotment").then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.AdmissionAllotmentData_ddl = data.Data;
        console.log(this.AdmissionAllotmentData_ddl)
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

  async GetAllData() {
    try {
      let obj = {
        FinancialYearID: this.sSOLoginDataModel.FinancialYearID,
        Action:this.ActionType
      }
      this.loaderService.requestStarted();
      await this.ReportService.GetZoneWiseAllotmentReport(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.AdmissionAllotmentDataList = data.Data;
        console.log(this.AdmissionAllotmentDataList)
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
    this.ActionType = '';
    await this.GetAllData();
  }


  // ------------------------------------------dynamic table portion----------------------------
}
