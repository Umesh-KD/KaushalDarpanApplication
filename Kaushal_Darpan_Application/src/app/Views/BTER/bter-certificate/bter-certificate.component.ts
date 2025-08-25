import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { BterCertificateReportDataModel } from '../../../Models/BTER/BterCertificateReportDataModel';

export interface requestData {
  Action: string;
  InstituteID: number;
  StudentID: number;
  EndTermID: number;
  DepartmentID: number;
  Eng_NonEng: number;
  EnrollmentNo: string;
  RevisedType: number;
  ResultType: number;
  MigrationType: number;
  CertificateType: number;
  DiplomaType: number;
  SemesterType: number;
  RWHResultType: number;
  RWHEffectedEndTerm: number;
}

@Component({
  selector: 'app-bter-certificate',
  templateUrl: './bter-certificate.component.html',
  styleUrls: ['./bter-certificate.component.css'],
  standalone: false
})
export class BterCertificateComponent implements OnInit {
  ReportsListData: any[] = [];
  displayedColumns: string[] = [];
  columnSchema: Array<{ key: string; label: string; isAction?: boolean; isDate?: boolean }> = [];

  dataSource = new MatTableDataSource<any>();
  sSOLoginDataModel: any;
  InstituteMasterList: any;
  SemesterMasterList: any;
  EndTermList: any;
  selectedType: string = '';
  ReportTypelist: any;
  ResultTypeList: any;
  SemesterList: any;
  RWHResultTypeList: any;
  RWHEffectedEndTermList: any;
  MigrationTypeList: any;
  filterModel: requestData = {
    Action: "0",
    InstituteID: 0,
    StudentID: 0,
    EndTermID: 0,
    DepartmentID: 0,
    Eng_NonEng: 0,
    EnrollmentNo: '',
    RevisedType: 0,
    ResultType: 0,
    MigrationType: 0,
    CertificateType: 0,
    DiplomaType: 0,
    RWHResultType: 0,
    RWHEffectedEndTerm: 0,
    
    SemesterType:0
  };

  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;
  startInTableIndex = 1;
  endInTableIndex = 10;

  ssoLoginUser = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  Table_SearchText = '';
  ActionDynamic: string = '';
  public searchRequest = new BterCertificateReportDataModel();

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(
    private loaderService: LoaderService,
    private reportService: ReportService,
    private commonMasterService: CommonFunctionService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.sSOLoginDataModel = this.ssoLoginUser;
    this.filterModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.filterModel.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.filterModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

    this.loadMasterData();
    //this.GetAllData();
    //this.GetExamResultType();
    this.loadDropdownData('Semester');
  }

  loadMasterData(): void {
    this.commonMasterService.InstituteMaster(this.filterModel.DepartmentID, this.filterModel.Eng_NonEng, this.filterModel.EndTermID)
      .then((data: any) => {
        this.InstituteMasterList = data['Data'];
      });

    this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        this.SemesterMasterList = data['Data'];
      });

    this.reportService.GetEndTerm().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.EndTermList = data['Data'];
    });

    this.ReportTypelist = [
      { ID: 1, Name: 'Provisional Certificate', URL: 'provisional-certificate' },
      { ID: 2, Name: 'Migration Certificate', URL: 'migration-certificate' },
      { ID: 3, Name: 'Certificate Letter', URL: 'certificate-letter' },
      { ID: 4, Name: 'Diploma Certificate', URL: 'diploma-certificate' },
      { ID: 5, Name: 'Diploma Forwarding Letter', URL: 'diploma-forwarding-letter' },
      { ID: 6, Name: 'Diploma I - Wise List', URL: 'diploma-i-wise-list' },
      { ID: 7, Name: 'Diploma Report', URL: 'diploma-report' },
      { ID: 8, Name: 'Waste Diploma Report', URL: 'waste-diploma-report' },
      { ID: 9, Name: 'Set Printing Date', URL: 'set-printing-date' },
      { ID: 10, Name: 'Diploma Data For DigiLocker', URL: 'diploma-date-for-digiLocker' },
      { ID: 11, Name: 'Appeared Passed Statistics', URL: 'Appeared-Passed-Statistics' },
      { ID: 12, Name: 'Appeared Passed Statistics InstituteWise', URL: 'Appeared-Passed-Statistics-InstituteWise' }
    ];
  }

  onTypeChange(selectedType: string): void {
    this.filterModel.InstituteID = 0;
    this.filterModel.StudentID = 0;
    this.filterModel.EnrollmentNo = '';
    this.filterModel.RevisedType = 0;
    this.filterModel.ResultType = 0;
    this.filterModel.MigrationType = 0;
    this.filterModel.CertificateType = 0;
    this.filterModel.DiplomaType = 0;
    this.filterModel.RWHResultType = 0;
    this.filterModel.RWHEffectedEndTerm = 0;
    this.selectedType = selectedType;
    this.ReportsListData = [];
    this.dataSource = new MatTableDataSource(this.ReportsListData);
    this.totalRecords = 0;
    this.displayedColumns = [];
    this.GetExamResultType();
    this.GetRWHResultType();
    this.GetMigrationType();
  }

  resetForm(): void {
    this.filterModel = {
      Action: "0",
      InstituteID: 0,
      StudentID: 0,
      EnrollmentNo: '',
      RevisedType: 0,
      ResultType: 0,
      MigrationType: 0,
      CertificateType: 0,
      DiplomaType: 0,
      RWHResultType: 0,
      RWHEffectedEndTerm: 0,
      SemesterType: 0,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng
    };
    this.selectedType = '';
    this.ReportsListData = [];
    this.dataSource = new MatTableDataSource(this.ReportsListData);
    this.totalRecords = 0;
    this.displayedColumns = [];
    //this.GetAllData();
  }

  filterFormSubmit(): void {
    
    if (this.filterModel.Action == "0") {
      this.toastrService.error('Please select Certificate Type');
      return;
    }
    if (this.filterModel.Action == "diploma-date-for-digiLocker")
    {
      this.GetAllDataDigilocker();
      return;
    }

    if (this.filterModel.Action == "Appeared-Passed-Statistics-InstituteWise") {
      this.AppearedPassedInstituteWiseDownload();
      return;
    }

    this.ActionDynamic = this.filterModel.Action;
    this.GetAllData();
   
  }

  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'Semester':
          this.SemesterList = data['Data'];
          break;
        default:
          break;
      }
    });
  }

  async GetAllData(): Promise<void> {
    debugger;
    this.ActionDynamic = this.filterModel.Action;
    this.ReportsListData = [];

    try {
      this.loaderService.requestStarted();
      const response = await this.reportService.GetBterCertificateReport(this.filterModel);
      const data = JSON.parse(JSON.stringify(response));
      if (data.State === EnumStatus.Success) {
        this.ReportsListData = data.Data;
        this.buildDynamicColumns();
        this.dataSource = new MatTableDataSource(this.ReportsListData);
        this.dataSource.sort = this.sort;
        this.totalRecords = this.ReportsListData.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.updateTable();
      } else {
        this.dataSource = new MatTableDataSource();
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  buildDynamicColumns(): void {
    if (!this.ReportsListData.length) return;

    const sampleItem = this.ReportsListData[0];
    const columnKeys = Object.keys(sampleItem);

    // List of columns you want to exclude
    const excludedColumns = ['StudentID', 'InstituteId', 'StreamCode', 'EndTermName', 'YearName', 'DiplomaDate', 'IssuDate', 'InstituteCode1','FatherName'];

    this.columnSchema = columnKeys
      .filter(key => !excludedColumns.includes(key))
      .map(key => ({
        key,
        label: this.formatColumnLabel(key),
        isDate: key.toLowerCase().includes('date')
      }));



    this.columnSchema.push({ key: 'Action', label: 'Action', isAction: true });
    this.displayedColumns = this.columnSchema.map(col => col.key);
  }

  formatColumnLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.updateTable();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
    this.dataSource.data = this.ReportsListData.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  exportToExcel(): void {
   
    const filteredData = this.ReportsListData.map(({ StudentID, ...rest }) => rest);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${this.filterModel.Action}.xlsx`);
  }

  async CertificateDownload(StudentId: number): Promise<void> {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.Action = this.ActionDynamic;
      this.searchRequest.StudentID = StudentId;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      const data = await this.reportService.BterCertificateReportDownload(this.searchRequest);
      if (data && data.Data) {
        this.downloadBase64PDF(data.Data, `${this.ActionDynamic}.pdf`);
      } else {
        this.toastrService.error('Data not found');
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async BulkCertificateDownload(): Promise<void> {
    try {
      this.loaderService.requestStarted();
      const studentIds = this.dataSource.data.map(row => row.StudentID);

      const requestArray = studentIds.map(id => ({
        StudentID: id,
        Action: this.ActionDynamic,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID
      }));

      const data = await this.reportService.BterCertificateBulkReportDownload(requestArray);
      if (data && data.Data) {
        this.downloadBase64PDF(data.Data, `${this.ActionDynamic}_bulk.pdf`);
      } else {
        this.toastrService.error('Data not found');
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async BulkDiplomaDownload(): Promise<void> {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.Action = this.ActionDynamic;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      const data = await this.reportService.BterDiplomaBulkReportDownload(this.searchRequest);
      debugger;
      if (data && data.Data) {
        this.downloadBase64PDF(data.Data, `${this.ActionDynamic}.pdf`);
      } else {
        this.toastrService.error('Data not found');
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async BulkAppearedPassedStatisticsDownload(): Promise<void> {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.Action = this.ActionDynamic;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

      const data = await this.reportService.AppearedPassedStatisticsReportDownload(this.searchRequest);
      debugger;
      if (data && data.Data) {
        this.downloadBase64PDF(data.Data, `${this.ActionDynamic}.pdf`);
      } else {
        this.toastrService.error('Data not found');
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async AppearedPassedInstituteWiseDownload(): Promise<void> {
    try {
      debugger;
      this.loaderService.requestStarted();
      this.searchRequest.Action = this.filterModel.Action;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

      const data = await this.reportService.AppearedPassedInstituteWiseDownload(this.searchRequest);
      debugger;
      if (data && data.Data) {
        this.downloadBase64PDF(data.Data, `${this.ActionDynamic}.pdf`);
      } else {
        this.toastrService.error('Data not found');
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }
  async BulkCertificateDownloadPreprinted(): Promise<void> {
    
    try {
      this.loaderService.requestStarted();
      const studentIds = this.dataSource.data.map(row => row.StudentID);

      const requestArray = studentIds.map(id => ({
        StudentID: id,
        Action: this.filterModel.Action,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID
      }));

      const data = await this.reportService.BterCertificatePrePrintedBulkReportDownload(requestArray);
      if (data && data.Data) {
        this.downloadBase64PDF(data.Data, `${this.ActionDynamic}_bulkPrePrinted.pdf`);
      } else {
        this.toastrService.error('Data not found');
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async CertificateLetterDownload() {
    this.ActionDynamic = this.filterModel.Action;
    try {
      this.loaderService.requestStarted();
      const response = await this.reportService.GetBterCertificateLetter(this.filterModel);
      const data = JSON.parse(JSON.stringify(response));
      if (data.State === EnumStatus.Success) {
        this.DownloadFile(data.Data);
      } else {
        this.dataSource = new MatTableDataSource();
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }


  async DiplomaCertificateDownload(id:any) {
    this.ActionDynamic = this.filterModel.Action;
    this.filterModel.StudentID = id;
    try {
      this.loaderService.requestStarted();
      const response = await this.reportService.GetBterDiplomaCertificate(this.filterModel);
      const data = JSON.parse(JSON.stringify(response));
      if (data.State === EnumStatus.Success) {
        this.DownloadFile(data.Data);
      } else {
        this.dataSource = new MatTableDataSource();
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
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

  downloadBase64PDF(base64: string, filename: string): void {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }

  async GetExamResultType(): Promise<void> {
    
    try {
      this.loaderService.requestStarted();
      const data = await this.commonMasterService.GetExamResultType();
      this.ResultTypeList = data?.Data || [];

      if (this.filterModel.Action == 'migration-certificate' || this.filterModel.Action == 'provisional-certificate') {

        this.ResultTypeList = this.ResultTypeList.filter((item: any) => item.ID != 4)
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }


  async GetRWHResultType(): Promise<void> {
    
    try {
      this.loaderService.requestStarted();
      const data = await this.commonMasterService.GetExamResultType();
      this.RWHResultTypeList = data?.Data || [];
      this.RWHResultTypeList = this.RWHResultTypeList.filter((item: any) => item.ID == 3 || item.ID == 5)
     
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetMigrationType(): Promise<void> {

    try {
      this.loaderService.requestStarted();
      const data: any = await this.commonMasterService.GetMigrationType();
      this.MigrationTypeList = data?.Data || [];      

    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }
  async GetDDL_RWHEffectedEndTerm(): Promise<void> {
    
    try {
      this.loaderService.requestStarted();

      const request = {
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        CourseType: this.sSOLoginDataModel.Eng_NonEng,
        ResultTypeID: this.filterModel.RWHResultType
      };
      
      const data: any = await this.commonMasterService.DDL_RWHEffectedEndTerm(request);
      this.RWHEffectedEndTermList = data?.Data || [];    

    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }
  async GetAllDataDigilocker(): Promise<void> {
    this.ActionDynamic = this.filterModel.Action;
    this.ReportsListData = [];

    try {
      this.loaderService.requestStarted();
      const response = await this.reportService.GetBterCertificateReport(this.filterModel);
      const data = JSON.parse(JSON.stringify(response));
      if (data.State === EnumStatus.Success) {
        this.ReportsListData = data.Data;
        this.exportToExcel();
      } else {
        this.dataSource = new MatTableDataSource();
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  onTypeResult(): void {
    this.filterModel.RWHEffectedEndTerm = 0;
    this.GetDDL_RWHEffectedEndTerm();

  }
  ResultTypeChange(): void {
    this.filterModel.RWHResultType = 0;
    this.filterModel.RWHEffectedEndTerm = 0;
    

  }
}
