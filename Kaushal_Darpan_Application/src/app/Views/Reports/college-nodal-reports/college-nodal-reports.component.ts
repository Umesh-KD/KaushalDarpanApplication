
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { StudentExamDetails } from '../../../Models/DashboardCardModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { EnumDepartment, EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { DTEApplicationDashboardDataModel } from '../../../Models/DTEApplicationDashboardDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ReportService } from '../../../Services/Report/report.service';
import { BterSearchmodel } from '../../../Models/ApplicationFormDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-college-nodal-reports',
  standalone: false,
  templateUrl: './college-nodal-reports.component.html',
  styleUrl: './college-nodal-reports.component.css'
})
export class CollegeNodalReportsComponent {
  Message: string = '';
  ErrorMessage: string = '';
  State: boolean = false;
  viewAdminDashboardList: any[] = [];
  displayedColumns: string[] = ['SrNo', 'ApplicantName', 'ApplicationNo', 'Dis_Gender', 'MobileNo', 'CategoryA_Name', 'CategoryB_Name', 'CategoryC_Name', 'CategoryD_Name', 'Status', 'Action'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  sSOLoginDataModel: any;
  public searchrequest = new BterSearchmodel();
  pageName: any;
  _EnumRole = EnumRole;
  InstituteMasterList: any = [];
  SemesterMasterList: any = [];
  Table_SearchText: string = '';
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(
    private collegeDashboardService: ReportService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private http: HttpClient,
    public appsettingConfig: AppsettingService  ) {
  }

  async ngOnInit(): Promise<void> {
    this.pageName = this.activatedRoute.snapshot.paramMap.get('url');
    this.activatedRoute.paramMap.subscribe(params => {
      this.pageName = params.get('url')
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.loadCenterData();

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

  loadCenterData(): void {
    this.GetAllData();
  }

  exportToExcel(): void {
    // const unwantedColumns = [
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.viewAdminDashboardList);
    const columnWidths = Object.keys(this.viewAdminDashboardList[0] || {}).map(key => ({
      wch: Math.max(
        key.length, // Header length
        ...this.viewAdminDashboardList.map(item => (item[key] ? item[key].toString().length : 0)) // Max content length
      ) + 2 // Extra padding
    }));

    ws['!cols'] = columnWidths; 
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CollegesNodalReports.xlsx');
  }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      const ssoLoginUser = JSON.parse(localStorage.getItem('SSOLoginUser') || '{}');

      let requestData: DTEApplicationDashboardDataModel = {
          "EndTermID": ssoLoginUser.EndTermID,
          "DepartmentID": ssoLoginUser.DepartmentID,
          "Eng_NonEng": ssoLoginUser.Eng_NonEng,
          "Menu": this.pageName,
          "ModifyBy": this.sSOLoginDataModel.UserID,
          ApplicationID: 0,
          UserID: ssoLoginUser.UserID,
        RoleID: ssoLoginUser.RoleID,
        FinancialYearID: this.sSOLoginDataModel.FinancialYearID
      }


      await this.collegeDashboardService.GetCollegeNodalReportsData(requestData)
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
        this.loaderService.requestEnded();
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

  async DownloadApplicationForm(id: any) {
    try {
      
      const ssoLoginUser = JSON.parse(localStorage.getItem('SSOLoginUser') || '{}');
      this.loaderService.requestStarted();
      this.searchrequest.DepartmentID = EnumDepartment.BTER;
      this.searchrequest.ApplicationID = id;
      await this.collegeDashboardService.GetApplicationFormPreview(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastr.error(data.ErrorMessage)
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

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf');
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }
}

