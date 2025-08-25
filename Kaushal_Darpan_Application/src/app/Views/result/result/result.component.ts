// result.component.ts

import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { StudentExamDetails } from '../../../Models/DashboardCardModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ReportService } from '../../../Services/Report/report.service';
import { ResultService } from '../../../Services/Results/result.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { DownloadMarksheetSearchModel } from '../../../Models/DownloadMarksheetDataModel';
import { MenuService } from '../../../Services/Menu/menu.service';

@Component({ 
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  standalone: false
})
export class ResultComponent implements OnInit {
  Message: string = '';
  ErrorMessage: string = '';
  State: boolean = false;
  public DateConfigSetting: any = [];
  MapKeyEng: number = 0;
  isGenerateResult: boolean = true; 
  viewAdminDashboardList: StudentExamDetails[] = [];
  displayedColumns: string[] = [
    'SrNo',
    'StudentName',
    'FatherName',
    'RollNo',
    'EnrollmentNo',   
    'Result',
    'Action'
  ];
  dataSource: MatTableDataSource<StudentExamDetails> = new MatTableDataSource();
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  sSOLoginDataModel: any;
  url: any;
  instituteId: any;
  _EnumRole = EnumRole;
  InstituteMasterList: any = [];
  lstAcedmicYear: any = [];
  SemesterMasterList: any = [];
  SemesterReMasterList: any = [];
  Table_SearchText: string = '';
  public searchRequest = new DownloadMarksheetSearchModel();

  @ViewChild(MatSort) sort!: MatSort;
  filterForm!: FormGroup;
  resultGenerateForm!: FormGroup;
  resultReGenerateForm!: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private resultService: ResultService,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private reportService: ReportService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private menuService: MenuService
  ) {
    // Get user data from localStorage
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }

  async ngOnInit(): Promise<void> {
    // Get URL parameter
    this.activatedRoute.paramMap.subscribe((params) => {
      this.url = params.get('url');
      // Load master data required for dropdowns or other UI elements
      this.loadMasterData();
      this.GetDateConfig();
    });
    // Initialize forms
    this.filterForm = this.fb.group({
      searchTerm: ['']
    });
    this.resultGenerateForm = this.fb.group({
      selectedSemester: ['all']
    });
    this.resultReGenerateForm = this.fb.group({
      selectedSemester: ['all']
    });
    

    // Optionally, you can call GetAllData() here if you want data loaded on init.
    // this.GetAllData();
  }

  //date Setting

  async GetDateConfig() {
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: "Result",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'][0];
        this.MapKeyEng = this.DateConfigSetting.Result;
      }, (error: any) => console.error(error));
  }

  async SubmitGenerateResultData() {
    try {
      
      // Check which form has a selected semester other than "all"
      if (this.resultGenerateForm.value.selectedSemester !== "all") {
        this.isGenerateResult = false; 
        const ssoLoginUser = JSON.parse(localStorage.getItem('SSOLoginUser') || '{}');
        const requestData: any = {
          EndTermID: ssoLoginUser.EndTermID,
          DepartmentID: ssoLoginUser.DepartmentID,
          Eng_NonEng: ssoLoginUser.Eng_NonEng,
          UserID: ssoLoginUser.UserID,
          RoleID: ssoLoginUser.RoleID,
          SemesterID: this.resultGenerateForm.value.selectedSemester,
          ResultType: this.url
        };
        await this.resultService.GetStudentResults(requestData)
          .then((data: any) => {
            if (data['State'] === 1 || data['State'] === 3) {
              this.viewAdminDashboardList = data['Data'];
              this.totalRecords = this.viewAdminDashboardList.length;
              this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
              this.currentPage = 1; // Reset pagination
              this.updateTable();
              // Subscribe to filter changes
              this.filterForm.valueChanges.subscribe((values) => {
                this.applyFilter(values);
              });
            }
            if (data['State'] === 2) {
              this.toastr.error("Something went wrong");
            }
          }, (error: any) => console.error(error));
      } else if (this.resultReGenerateForm.value.selectedSemester !== "all") {
        const ssoLoginUser = JSON.parse(localStorage.getItem('SSOLoginUser') || '{}');
        const requestData: any = {
          EndTermID: ssoLoginUser.EndTermID,
          DepartmentID: ssoLoginUser.DepartmentID,
          Eng_NonEng: ssoLoginUser.Eng_NonEng,
          UserID: ssoLoginUser.UserID,
          RoleID: ssoLoginUser.RoleID,
          SemesterID: this.resultReGenerateForm.value.selectedSemester,
          ResultType: this.url
        };

        await this.resultService.GetStudentResults(requestData)
          .then((data: any) => {
            if (data['State'] === 1 || data['State'] === 3) {
              this.viewAdminDashboardList = data['Data'];
              this.totalRecords = this.viewAdminDashboardList.length;
              this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
              this.currentPage = 1;
              this.updateTable();
              this.filterForm.valueChanges.subscribe((values) => {
                this.applyFilter(values);
              });
            }
            if (data['State'] === 2) {
              this.toastr.error("Something went wrong");
            }
          }, (error: any) => console.error(error));
      } else {
        this.toastr.warning("Please select Semester");
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  loadMasterData(): void {
    // Load Institute master data
    this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
      .then((data: any) => {
        this.InstituteMasterList = data['Data'];
      }, (error: any) => console.error(error));

    this.menuService.GetAcedmicYearList()
      .then((AcedmicYear: any) => {
        AcedmicYear = JSON.parse(JSON.stringify(AcedmicYear));
        let lstAcedmicYearData = AcedmicYear['Data'];
        this.lstAcedmicYear = lstAcedmicYearData.filter((x: { EndTermID: any; }) => x.EndTermID == this.sSOLoginDataModel.EndTermID);

        //this.loaderService.requestEnded();
      }, error => console.error(error));

    // Load Semester master data for generate   
    this.commonMasterService.SemesterGenerateMaster()
      .then((data: any) => {
        let SemesterMaster: any = data['Data'];
        this.SemesterMasterList = SemesterMaster;
        

        setTimeout(() => {
          if (SemesterMaster && this.lstAcedmicYear[0].TermName == "Nov") {
            this.SemesterMasterList = SemesterMaster.filter((x: { SemesterID: number }) => {
              return x.SemesterID % 2 !== 0 || x.SemesterID == 6; // Filter out odd SemesterIDs
            });
          } else {
            if (SemesterMaster) {
              this.SemesterMasterList = SemesterMaster.filter((x: { SemesterID: number }) => {
                return x.SemesterID % 2 === 0; // Filter out even SemesterIDs
              });
            }
          }
        },.500)
        
      }, (error: any) => console.error(error));
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.viewAdminDashboardList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.updateTable();
  }

  applyFilter(values: any): void {
    const { searchTerm } = values;
    // Filter based on student name (adjust as needed)
    const filteredData = this.viewAdminDashboardList.filter(item => {
      return item.StudentName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    this.totalRecords = filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.currentPage = 1; // Optionally reset pagination when filtering
    this.updateTable(filteredData);
  }

  updateTable(filteredData: StudentExamDetails[] = this.viewAdminDashboardList): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource.data = filteredData.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
    // If needed, force table update:
    // this.dataSource._updateChangeSubscription();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  resetForm(): void {
    this.filterForm.reset({ searchTerm: '' });
    this.applyFilter(this.filterForm.value);
  }

  //async DownloadMarksheet(request: any) {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.reportService.DownloadMarksheet(request)
  //      .then((data: any) => {
  //        if (data.State == EnumStatus.Success) {
  //          this.DownloadFile(data.Data, 'file download');
  //        } else {
  //          this.toastrService.error(data.ErrorMessage);
  //        }
  //      }, (error: any) => console.error(error));
  //  } catch (ex) {
  //    console.error(ex);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

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

  async DownloadMarksheet(StudentID: any, SemesterID: any) {
    try {
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEngID = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.StudentID = StudentID;
      this.searchRequest.SemesterID = SemesterID;
      console.log(JSON.stringify(this.searchRequest), 'SearchRequestData')
      const requestArray = [this.searchRequest];
      this.loaderService.requestStarted();

      await this.reportService.DownloadMarksheet(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "Data");
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastr.error(data.ErrorMessage)
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
