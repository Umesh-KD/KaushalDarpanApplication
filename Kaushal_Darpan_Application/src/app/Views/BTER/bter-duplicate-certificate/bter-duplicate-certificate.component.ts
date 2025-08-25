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
import { MarksheetDownloadService } from '../../../Services/MarksheetDownload/marksheet-download.service';
import { DownloadMarksheetSearchModel } from '../../../Models/DownloadMarksheetDataModel';

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
  RollNo: number;
}
@Component({
  selector: 'app-bter-duplicate-certificate',
  standalone: false,
  templateUrl: './bter-duplicate-certificate.component.html',
  styleUrl: './bter-duplicate-certificate.component.css'
})

export class BterDuplicateCertificateComponent {
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
    RollNo: 0,
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
  public searchRequestMarksheet = new DownloadMarksheetSearchModel();

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(
    private loaderService: LoaderService,
    private reportService: ReportService,
    private commonMasterService: CommonFunctionService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private toastrService: ToastrService,
    private marksheetDownloadService: MarksheetDownloadService,
  ) { }

  ngOnInit(): void {
    this.sSOLoginDataModel = this.ssoLoginUser;
    this.filterModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.filterModel.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.filterModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

    this.loadMasterData();
    //this.GetAllData();
    this.GetExamResultType();
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
      { ID: 1, Name: 'Duplicate Provisional Certificate', URL: 'duplicate-provisional-certificate' },
      { ID: 2, Name: 'Duplicate Marksheet', URL: 'duplicate-marksheet' },
      
    ];
  }

  onTypeChange(selectedType: string): void {
    this.selectedType = selectedType;
    this.ReportsListData = [];
    this.dataSource = new MatTableDataSource(this.ReportsListData);
    this.totalRecords = 0;
    this.displayedColumns = [];
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
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng
      ,RollNo: 0
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

    this.ActionDynamic = this.filterModel.Action;
    this.GetAllData();
  }

  async GetAllData(): Promise<void> {
    this.ActionDynamic = this.filterModel.Action;
    this.ReportsListData = [];
    try {
      this.loaderService.requestStarted();
      const response = await this.reportService.GetBterDuplicateCertificateReport(this.filterModel);
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
    const excludedColumns = ['StudentID','SemesterID','DepartmentID','EndTermID','InstituteID','ResultTypeID','IsReval','IsRevised'];

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
      debugger
      const data = await this.reportService.BterDuplicateProvisionalCertificateDownload(this.searchRequest);
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
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async DownloadDuplicateMarksheet(element: any) {
    try {
      this.searchRequestMarksheet.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequestMarksheet.Eng_NonEngID = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequestMarksheet.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequestMarksheet.StudentID = element.StudentID;
      this.searchRequestMarksheet.SemesterID = element.SemesterID;
      
      this.searchRequestMarksheet.ResultTypeID = element.ResultTypeID;
      this.searchRequestMarksheet.IsRevised = element.IsRevised;
      this.searchRequestMarksheet.IsReval = element.IsReval;
      this.loaderService.requestStarted();

      await this.reportService.DownloadDuplicateMarksheet(this.searchRequestMarksheet)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "Data");
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data);
          }
          else {
            this.toastrService.error(data.ErrorMessage)
            //    data.ErrorMessage
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


}
