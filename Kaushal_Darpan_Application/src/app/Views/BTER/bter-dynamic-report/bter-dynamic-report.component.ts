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
import { RequestBaseModel } from '../../../Models/RequestBaseModel';

@Component({
    selector: 'app-bter-dynamic-report',
    templateUrl: './bter-dynamic-report.component.html',
    styleUrls: ['./bter-dynamic-report.component.css'],
    standalone: false
})

export class BterDynamicReportComponent implements OnInit {
  public BterDynamicDataList: any[] = [];
  public BterDynamicData_ddl: any[] = [];
  public Table_SearchText: string = "";
  public searchRequest = new CompanyMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public requestObj= new RequestBaseModel();
  public RequestData = new RequestBaseModel();
  public ApprovedStatus: string = "0";
  public ActionType = '';
  //public columns:TableColumn[]=[];

  constructor(private commonMasterService: CommonFunctionService, private ReportService: ReportService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2, private Router: Router, private router: ActivatedRoute,public appsettingConfig: AppsettingService,) {

  }

// -------------------------------------------------------dynamic table portion---------------------------------------------------------------------

tableConfig: TableConfig = {

  //  showExport: false,  //for showing excel button, default true
  //  showColumnCustomizer: false, //for showing column customizer button,default true
  // showSerialNo: false, //for showing serial no. default true
   unwantedColumns: [  
        'id',     
        'AcademicYearID',
        'CollegeId'
    ],
    // showExport: false,   //default true 
    columns: [
    {
        dataField: 'ProfileImage',

        displayField: 'ProfileImage',

        type: 'image',

        sortable: false,

        align: 'center',

        width: '80px',

        imageConfig: {

          width: 40,

          height: 40,

          borderRadius: 'circle',

          hoverZoom: true,

          basePath: this.appsettingConfig.StaticFileRootPathURL ,

          defaultImage: this.appsettingConfig.StaticFileRootPathURL 
        },
      },
      
    {
        dataField: 'Division',       
        // visible: false,    //to show in list view
        lockVisibility: true   // to lock in customize column dropdown
    },
    {
      dataField: 'ActiveStatus',
      displayField: 'Status',
      type: 'badge',
      // align: 'center'
      sortable: true,
      align: 'center',
      width: '130px'

    },
    {
        dataField: 'ModifyDate',
        displayField: 'Modify Date',
        type: 'date',
        sortable: true,
        align: 'center',
        width: '150px',
        format: 'dd/MM/yyyy  hh:mm:ss a'
    },    
    {
        dataField: 'CreatedDate',
        displayField: 'Created Date',
        type: 'date',
        sortable: true,
        align: 'center',
        width: '150px',
        format: 'dd/MM/yyyy  hh:mm:ss a'
    },
    
  ],

 badgeConfig: [
      {
        value: 1,
        text: 'Active',
        cssClass: 'badge bg-success'
      },

      {
        value: 0,
        text: 'Inactive',
        cssClass: 'badge bg-danger'
      }
    ]



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
    const filteredData = this.BterDynamicDataList.map((item: any) => {
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
      this.requestObj.RoleID = this.sSOLoginDataModel.RoleID;
      this.requestObj.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestObj.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.requestObj.InstituteId = this.sSOLoginDataModel.InstituteID;
      this.requestObj.ActionFlag = "_getBterDynamicReport_ddl";

      await this.commonMasterService.GetBterDynamicReport_ddl(this.requestObj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.BterDynamicData_ddl = data.Data;
        console.log(this.BterDynamicData_ddl)
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

  async onActionTypeChange(event: any) {
    debugger
    this.ActionType = event.target.value;
    this.GetAllData();
  }
  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      this.RequestData.RoleID = this.sSOLoginDataModel.RoleID;
      this.RequestData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.RequestData.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.RequestData.InstituteId = this.sSOLoginDataModel.InstituteID;
      this.RequestData.ActionFlag = this.ActionType;

      // let obj = {
      //   FinancialYearID: this.sSOLoginDataModel.FinancialYearID,
      //   Action:this.ActionType
      // }
      this.loaderService.requestStarted();
      await this.ReportService.GetBterdynamicReport(this.RequestData).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.BterDynamicDataList = data.Data;
        console.log(this.BterDynamicDataList)
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
