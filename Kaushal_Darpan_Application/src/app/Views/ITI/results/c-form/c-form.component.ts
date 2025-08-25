// result.component.ts

import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumRole, GlobalConstants, EnumStatus } from '../../../../Common/GlobalConstants';
import { StudentExamDetails } from '../../../../Models/DashboardCardModel';
import { DownloadMarksheetSearchModel } from '../../../../Models/DownloadMarksheetDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { ResultService } from '../../../../Services/Results/result.service';
import { ITIResultService } from '../../../../Services/ITIResult/iti-result.service';
import { ItiGetResultDataModel } from '../../../../Models/ITI/ITI_ResultModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-c-form',
  standalone: false,
  templateUrl: './c-form.component.html',
  styleUrl: './c-form.component.css'
})
export class CFormComponent implements OnInit {
  Message: string = '';
  ErrorMessage: string = '';
  State: boolean = false;
  public DateConfigSetting: any = [];
  MapKeyEng: number = 0;
  ReportHtml: SafeHtml = "";
  isGenerateResult: boolean = true;
  viewAdminDashboardList: StudentExamDetails[] = [];
  displayedColumns: string[] = [
    'SrNo',
    'StudentName',
    'FatherName',
    'RollNo',
    'EnrollmentNo',
    'Division',
    'Percentage',
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
  sSOLoginDataModel = new SSOLoginDataModel();
  url: any;
  instituteId: any;
  _EnumRole = EnumRole;
  InstituteMasterList: any = [];
  lstAcedmicYear: any = [];
  SemesterMasterList: any = [];
  SemesterReMasterList: any = [];
  Table_SearchText: string = '';
  ReportData: any = [];
  TradeList: any = [];
  public searchRequest = new DownloadMarksheetSearchModel();

  @ViewChild(MatSort) sort!: MatSort;
  filterForm!: FormGroup;
  resultGenerateForm!: FormGroup;
  resultReGenerateForm!: FormGroup;

  requestModel: ItiGetResultDataModel = new ItiGetResultDataModel();


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
    private itiResultService: ITIResultService,
    private http: HttpClient,
    private menuService: MenuService,
    private sanitizer: DomSanitizer
  ) {
    // Get user data from localStorage

  }

  async ngOnInit(): Promise<void> {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
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
      selectedSemester: ['all'],
      SemesterID: [0, [DropdownValidators]],
      ExamType: [0, [DropdownValidators]]
    });
    this.resultReGenerateForm = this.fb.group({
      selectedSemester: ['all']
    });
    this.searchRequest.SemesterID = 0;

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
      Key: "Result"
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'][0];
        this.MapKeyEng = this.DateConfigSetting.Result;
      }, (error: any) => console.error(error));
  }


  async GetCFormReport() {
    // console.log("Generate Order called")
    // const Selected = this.CenterObserverData.filter(x => x.Selected == true)
    // Selected.forEach((x: any) => {
    //   x.UserID = this.sSOLoginDataModel.UserID;
    //   x.DeploymentStatus = EnumDeploymentStatus.OrderGenerated;
    // })
    if (this.searchRequest.SemesterID==0) {
      this.toastr.error("Please select Year");
      return;
    }
    if (this.searchRequest.ExamType == 0) {
      this.toastr.error("Please select Exam Type");
      return;
    }
    try {
      this.loaderService.requestStarted();
      this.requestModel.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.requestModel.UserID = this.sSOLoginDataModel.UserID;
      this.requestModel.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.requestModel.SemesterID = this.searchRequest.SemesterID;
      this.requestModel.ExamType = this.searchRequest.ExamType;
      this.requestModel.InstituteId = this.sSOLoginDataModel.InstituteID;
      this.requestModel.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
      await this.itiResultService.GetCFormReport(this.requestModel).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success("Result Generated Successfully");
          this.ReportData = data.Data.Table1; // Assuming data.Data contains the result data
          debugger;
          //var Trade = data.Data.filter(function (x: any) {  }).select(x=>x.TradeName);
          //this.TradeList.push() 
         // this.TradeList = data.Data.Table1[0];
         // this.ReportHtml = data.Data.Table1[0].Reportdata;
          this.ReportHtml = this.sanitizer.bypassSecurityTrustHtml(data.Data.Table1[0].Reportdata);
          // this.GetAllDataForVerify();
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })



    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }
  async DowanloadCFormReport() {

    if (this.searchRequest.SemesterID == 0) {
      this.toastr.error("Please select Year");
      return;
    }
    if (this.searchRequest.ExamType == 0) {
      this.toastr.error("Please select Exam Type");
      return;
    }

    try {

      this.loaderService.requestStarted();
      this.requestModel.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
      this.requestModel.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.requestModel.UserID = this.sSOLoginDataModel.UserID;
      this.requestModel.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.requestModel.SemesterID = this.searchRequest.SemesterID;
      this.requestModel.ExamType = this.searchRequest.ExamType;
      await this.itiResultService.DownloadCFormReport(this.requestModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          data = JSON.parse(JSON.stringify(data));
          debugger
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'C_Form_Report.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
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
          ResultType: this.url,
          TradeScheme: this.sSOLoginDataModel.Eng_NonEng
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
        }, .500)

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
      this.requestModel.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
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

  checkTrade(index: number, trdae: any) {
    if (this.ReportData.length <= index + 1) {
      return trdae == this.ReportData[index + 1].TradeName;
    } else {
      return false;
    }
  }

  checkInstitute(index: number, name: any) {
    if (this.ReportData.length <= index + 1) {
      return name == this.ReportData[index + 1].InstitueName;
    } else {
      return false;
    }
  }

  ReporInstitudeDataList(TradeId: number): any[] {
    const filtered = this.ReportData.filter((x: any) => x.TradeId === TradeId);
    const data: any[] = [];
    filtered.forEach((x: any) => {
      const exists = data.find((y: any) => y.InstituteID === x.InstituteID);
      if (!exists) {
        data.push({
          InstituteID: x.InstituteID,
          InstituteName: x.InstituteName
        });
      }
    });
    return data;
  }

  ReporSubjectNameDataList(TradeId: number): any[] {
   // debugger;
    const filtered = this.ReportData.filter((x: any) => x.TradeId === TradeId);
    const data: any[] = [];
    filtered.forEach((x: any) => {
      const exists = data.find((y: any) => y.SubjectID === x.SubjectID);
      if (!exists) {
        data.push({
          SubjectID: x.SubjectID,
          SubjectName: x.SubjectName,
          MaxMarks: x.MaxMarks,
          MinMarks: x.MinMarks

        });
      }
    });
    return data;
  }

  ReporColspan(TradeId: number): number {
    const filtered = this.ReportData.filter((x: any) => x.TradeId === TradeId);
    const data: any[] = [];
    filtered.forEach((x: any) => {
      const exists = data.find((y: any) => y.SubjectID === x.SubjectID);
      if (!exists) {
        data.push({
          SubjectID: x.SubjectID,
          SubjectName: x.SubjectName
        });
      }
    });
    return data.length + 9;
  }

  getInstitutesByTrade(tradeId: number) {
    debugger;
    const filtered = this.ReportData.filter((x: any) => x.TradeId === tradeId);
    const unique = new Map<number, any>();
    filtered.forEach((x: any) => {
      if (!unique.has(x.InstituteID)) {
        unique.set(x.InstituteID, { InstituteID: x.InstituteID, InstituteName: x.InstituteName });
      }
    });
    return Array.from(unique.values());
  }

  getTraineesByInstitute1111(tradeId: number, InstituteID: number) {

    const filtered = this.ReportData.filter((x: any) => x.TradeId === tradeId && x.InstituteID === InstituteID);
    const unique = new Map<number, any>();
    filtered.forEach((x: any) => {
      if (!unique.has(x.StudentID)) {
        unique.set(x.StudentID, { StudentID: x.StudentID, TraineeName: x.TraineeName, DOB: x.DOB, RollNo: x.RollNo, LastAppeared: x.LastAppeared });
      }
    });
    return Array.from(unique.values());


    //return this.ReportData.filter((x: any) => x.TradeId === tradeId && x.InstituteId === instituteId);
  }

  getTraineesByInstitute(tradeId: number, InstituteID: number) {
    const filtered = this.ReportData.filter(
      (x: any) => x.TradeId === tradeId && x.InstituteID === InstituteID
    );

    const unique = new Map<number, any>();

    filtered.forEach((x: any) => {
      // If student doesn't exist yet, create a new entry
      if (!unique.has(x.StudentID)) {
        unique.set(x.StudentID, {
          StudentID: x.StudentID,
          TraineeName: x.TraineeName,
          DOB: x.DOB,
          RollNo: x.RollNo,
          LastAppeared: x.LastAppeared,
          GrandTotal: filtered
            .filter((y: any) => y.StudentID === x.StudentID)
            .reduce((sum: any, y: any) => sum + y.ObtainedMarks, 0),
          Result: x.Result == 1 ? 'P' : x.Result == 2 ? 'F':'',
          OriginalCertificateNumber: x.OriginalCertificateNumber,
          AcadSession: x.AcadSession,
          EnrollmentNo: x.EnrollmentNo
        });
      }

      // Add subject and marks to the student object
      const student = unique.get(x.StudentID);
      student[x.SubjectName] = x.ObtainedMarks;
    });

    return Array.from(unique.values());
  }



}

