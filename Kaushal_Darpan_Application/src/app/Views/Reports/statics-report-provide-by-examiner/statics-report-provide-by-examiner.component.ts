import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';  // Import MatSort
import { CollegesWiseReportsModel } from '../../../Models/CollegesWiseReportsModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { DTEApplicationDashboardDataModel } from '../../../Models/DTEApplicationDashboardDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { CommonDDLSubjectCodeMasterModel, CommonDDLSubjectMasterModel } from '../../../Models/CommonDDLSubjectMasterModel';
import { CommonDDLExaminerGroupCodeModel } from '../../../Models/CommonDDLExaminerGroupCodeModel';

@Component({
  selector: 'app-statics-report-provide-by-examiner',
  standalone: false,
  templateUrl: './statics-report-provide-by-examiner.component.html',
  styleUrl: './statics-report-provide-by-examiner.component.css'
})
export class StaticsReportProvideByExaminerComponent implements OnInit {

  // Data binding for College Wise Reports
  public CollegesWiseReportsModellList: CollegesWiseReportsModel[] = [];

  // Columns to be displayed in the table
  displayedColumns: string[] = [
    'SrNo', 'ExamName', 'ExaminerName', 'SubjectCode', 'GroupCode', 'CenterCode', 'Present', 'Absent', 'Below14MarksStudent', 'Below15to17MarksStudent', 'Below18to54MarksStudent', 'Below55to60MarksStudent','Above60MarksStudent'
  ];

  // Data source for the table
  dataSource: MatTableDataSource<CollegesWiseReportsModel> = new MatTableDataSource();
  sSOLoginDataModel: any;
  InstituteMasterList: any;
  SemesterMasterList: any;
  filterForm: FormGroup | undefined;
  // Pagination Properties
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  ssoLoginUser = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  // Search text for table filter
  Table_SearchText: string = '';
  GroupMasterDDLList: any;
  SubjectCodeMasterDDLList: any;

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(private loaderService: LoaderService,
    private reportService: ReportService,
    private commonMasterService: CommonFunctionService,
    private fb: FormBuilder,
    public appsettingConfig: AppsettingService,
    private http: HttpClient) {
  }

  ngOnInit(): void {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.loadMasterData();
    this.GetAllData();
    this.filterForm = this.fb.group({
      CenterCode: [''],
      GroupCode: [''],
      SubjectCode: [0],
      selectedSemester: [0],
    });
  }

  loadMasterData(): void {
    this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
      .then((data: any) => {
        this.InstituteMasterList = data['Data'];
        //this.filterForm?.patchValue({
        //  selectedInstitute: parseInt(this.instituteId),
        //});
      }, (error: any) => console.error(error));

    this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        this.SemesterMasterList = data['Data'];
      }, (error: any) => console.error(error));  
  
  }
   
  async GetSubjectCodeMasterDDL() {
    try {
      let subjectCodeDDLRequest = new CommonDDLSubjectCodeMasterModel();
      subjectCodeDDLRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      subjectCodeDDLRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      subjectCodeDDLRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      subjectCodeDDLRequest.SemesterID = this.filterForm?.value.selectedSemester;
      await this.commonMasterService.GetSubjectCodeMasterDDL(subjectCodeDDLRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectCodeMasterDDLList = data['Data'];

        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  resetForm(): void {
    this.filterForm?.reset({
      CenterCode: '',
      GroupCode: '',
      SubjectCode: 0,
      selectedSemester: 0,
    });
    this.GetAllData();
  }

  filterFormSubmit() {
    this.GetAllData();
  }

  // Fetching the data from the service and updating the table
  async GetAllData() {
    let requestData: any = {
      CenterCode: this.filterForm?.value.CenterCode != "" && this.filterForm?.value.CenterCode != undefined && this.filterForm?.value.CenterCode != 0 ? this.filterForm?.value.CenterCode : 0,
      GroupCode: this.filterForm?.value.GroupCode != "" && this.filterForm?.value.GroupCode != undefined && this.filterForm?.value.GroupCode != 0 ? this.filterForm?.value.GroupCode : 0,
      SubjectCode: this.filterForm?.value.SubjectCode != "" && this.filterForm?.value.SubjectCode != undefined && this.filterForm?.value.SubjectCode != 0 ? this.filterForm?.value.SubjectCode : '',
      //InstituteID: this.filterForm?.value.selectedInstitute != "" && this.filterForm?.value.selectedInstitute != undefined && this.filterForm?.value.selectedInstitute != 0 ? this.filterForm?.value.selectedInstitute : 0,
      SemesterID: this.filterForm?.value.selectedSemester != "" && this.filterForm?.value.selectedSemester != undefined && this.filterForm?.value.selectedSemester != 0 ? this.filterForm?.value.selectedSemester : 0,
      EndTermID: this.ssoLoginUser.EndTermID,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      RoleID: this.ssoLoginUser.RoleID,
      SSOID: this.ssoLoginUser.SSOID,
      Action: 'StaticsReportProvideByExaminer'

      /*Action:'ReportData'*/
    }
    this.CollegesWiseReportsModellList = [];
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetStaticsReportProvideByExaminer(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.CollegesWiseReportsModellList = data['Data'];
            this.dataSource = new MatTableDataSource(this.CollegesWiseReportsModellList);
            this.dataSource.sort = this.sort;  // Apply sorting
            this.totalRecords = this.CollegesWiseReportsModellList.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
          } else if (data.State === 3) {
            this.CollegesWiseReportsModellList = [];
            this.dataSource = new MatTableDataSource(this.CollegesWiseReportsModellList);
            this.dataSource.sort = this.sort;  // Apply sorting
            this.totalRecords = this.CollegesWiseReportsModellList.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }


  async PDFDownload() {
    


   let requestData: any = {
     CenterCode: this.filterForm?.value.CenterCode != "" && this.filterForm?.value.CenterCode != undefined && this.filterForm?.value.CenterCode != 0 ? this.filterForm?.value.CenterCode : 0,
     GroupCode: this.filterForm?.value.GroupCode != "" && this.filterForm?.value.GroupCode != undefined && this.filterForm?.value.GroupCode != 0 ? this.filterForm?.value.GroupCode : 0,
     SubjectCode: this.filterForm?.value.SubjectCode != "" && this.filterForm?.value.SubjectCode != undefined && this.filterForm?.value.SubjectCode != 0 ? this.filterForm?.value.SubjectCode : '',
     //InstituteID: this.filterForm?.value.selectedInstitute != "" && this.filterForm?.value.selectedInstitute != undefined && this.filterForm?.value.selectedInstitute != 0 ? this.filterForm?.value.selectedInstitute : 0,
     SemesterID: this.filterForm?.value.selectedSemester != "" && this.filterForm?.value.selectedSemester != undefined && this.filterForm?.value.selectedSemester != 0 ? this.filterForm?.value.selectedSemester : 0,
     EndTermID: this.ssoLoginUser.EndTermID,
     DepartmentID: this.ssoLoginUser.DepartmentID,
     Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
     RoleID: this.ssoLoginUser.RoleID,
     SSOID: this.ssoLoginUser.SSOID,
     Action: 'ReportData'

     
   }
   //this.CollegesWiseReportsModellList = [];
   try {
     this.loaderService.requestStarted();
     await this.reportService.StatisticsInformationReportPdf(requestData)
       .then((data: any) => {
         data = JSON.parse(JSON.stringify(data));
         if (data.State === EnumStatus.Success) {
           //this.CollegesWiseReportsModellList = data['Data'];
           this.DownloadFile(data.Data,'')

           //this.dataSource = new MatTableDataSource(this.CollegesWiseReportsModellList);
           //this.dataSource.sort = this.sort;  // Apply sorting
           //this.totalRecords = this.CollegesWiseReportsModellList.length;
           //this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
           //this.updateTable();
         //} else if (data.State === 3) {
           //this.CollegesWiseReportsModellList = [];
           //this.dataSource = new MatTableDataSource(this.CollegesWiseReportsModellList);
           //this.dataSource.sort = this.sort;  // Apply sorting
           //this.totalRecords = this.CollegesWiseReportsModellList.length;
           //this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
           //this.updateTable();
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
    this.dataSource.data = this.CollegesWiseReportsModellList.slice(startIndex, adjustedEndIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  async CenterDailyReportsDownload(element: any) {
    let requestData: any = {
      CenterCode: element.CenterCode,
      SemesterID: element.SemesterID,
      InstituteID: element.InstituteID,
      StreamID: element.StreamId,
      SubjectID: element.SubjectID,
      CenterID: element.CenterID,
      EndTermID: this.ssoLoginUser.EndTermID,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      RoleID: this.ssoLoginUser.RoleID
    }
    this.CollegesWiseReportsModellList = [];
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetDownloadCenterDailyReports(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DownloadFile(data.Data, 'file download');
          alert(data.Data)
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.CollegesWiseReportsModellList);
    // Create a new Excel workbook this.PreExamStudentData
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  }

  DownloadFile(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  }

  
}
