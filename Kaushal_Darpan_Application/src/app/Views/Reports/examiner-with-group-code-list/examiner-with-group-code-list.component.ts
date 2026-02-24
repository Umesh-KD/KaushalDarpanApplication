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
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExaminerStaticReportFeedbackDataModel } from '../../../Models/BTER/StaticsReportDataModel';
import { ToastrService } from 'ngx-toastr';
import { ExaminerwithGroupcodeModel } from '../../../Models/MiscellaneousModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2';

@Component({
  selector: 'app-examiner-with-group-code-list',
  standalone: false,
  templateUrl: './examiner-with-group-code-list.component.html',
  styleUrl: './examiner-with-group-code-list.component.css'
})
export class ExaminerWithGroupCodeListComponent implements OnInit {

  // Data binding for College Wise Reports
  public CollegesWiseReportsModellList: ExaminerwithGroupcodeModel[] = [];

  // Columns to be displayed in the table
  displayedColumns: string[] = [
    'SNo', 'GroupCode', 'ExaminerName', 'SubjectCode', 'AllotedStudentTotal', 'ExaminerCode',
    //  'IsChecked', 
    // 'IsPresentTheory', 
    // 'PresentbyExami', 'AbsentbyExami', 
    // 'isFinalSubmit', 'MarksSubmittedTotal', 'MarksPendingTotal', 
    // 'StaffInatituteName', 'ExaminerCode',
    'Action'
    // ,'MobileNumber'
  ];

  // Data source for the table
  dataSource: MatTableDataSource<ExaminerwithGroupcodeModel> = new MatTableDataSource();
  sSOLoginDataModel: any;
  InstituteMasterList: any;
  SemesterMasterList: any;
  public requestData = new ExaminerwithGroupcodeModel();
  public unlockRequest=new ExaminerwithGroupcodeModel();
  filterForm!: FormGroup;
  feedbackForm: FormGroup | undefined;
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
  modalReference: NgbModalRef | undefined;
  public request = new ExaminerStaticReportFeedbackDataModel();

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(private loaderService: LoaderService,
    private reportService: ReportService,
    private Swal2:SweetAlert2,
    private commonMasterService: CommonFunctionService,
    private fb: FormBuilder,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) {}

  async ngOnInit() {
    // this.filterForm = this.fb.group({
    //   CenterCode: [''],
    //   GroupCode: [''],
    //   SubjectCode: [0],
    //   selectedSemester: [0],
    // });

    this.filterForm = this.fb.group({
      // displayColumns: [''],
      StateId: [''],
      StudentType: [''],
      SemesterID: ['0'],
      StreamID: [''],
      District: [''],
      gender: [''],
      Block: [''],
      CourseType: [''],
      Institute: [''],
      EndTerm: [this.ssoLoginUser.EndTermID],
      CategaryCast: [''],
      UniqueCol: [''],
      ReportFlagID:[''],
      // Type: [this.repType],
      SchemeID: ['0'],
    });

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.getTodayDate();
    await this.loadMasterData();
    // await this.GetAllData();
  }

  async getTodayDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    this.request.Date = `${day}-${month}-${year}`;
  }

  async loadMasterData() {
    // this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
    //   .then((data: any) => {
    //     this.InstituteMasterList = data['Data'];
    //     //this.filterForm?.patchValue({
    //     //  selectedInstitute: parseInt(this.instituteId),
    //     //});
    //   }, (error: any) => console.error(error));

    this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        this.SemesterMasterList = data['Data'];
      }, (error: any) => console.error(error));  
  
  }

  applyFilter(filterValue: string): void {
    if (filterValue === "all") {

      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }
   
  // async GetSubjectCodeMasterDDL() {
  //   try {
  //     let subjectCodeDDLRequest = new CommonDDLSubjectCodeMasterModel();
  //     subjectCodeDDLRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //     subjectCodeDDLRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
  //     subjectCodeDDLRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
  //     subjectCodeDDLRequest.SemesterID = this.filterForm?.value.selectedSemester;
  //     await this.commonMasterService.GetSubjectCodeMasterDDL(subjectCodeDDLRequest)
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.SubjectCodeMasterDDLList = data['Data'];

  //       }, error => console.error(error));
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  // }

  // Fetching the data from the service and updating the table
  async GetAllData() {
    debugger
    this.requestData.EndTermID=this.sSOLoginDataModel.EndTermID;
    this.requestData.DepartmentID=this.sSOLoginDataModel.DepartmentID;
    this.requestData.Eng_NonEng=this.sSOLoginDataModel.Eng_NonEng;
    // this.requestData.SchemeID = this.filterForm.seme
    this.requestData.SchemeID = !isNaN(Number(this.filterForm.value.SchemeID)) ? Number(this.filterForm.value.SchemeID) : 0;
    this.requestData.SemesterID = !isNaN(Number(this.filterForm.value.SemesterID)) ? Number(this.filterForm.value.SemesterID) : 0;
    this.CollegesWiseReportsModellList = [];
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetExaminerWithGroupCodeList(this.requestData)
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

  async UnlockRow(GroupCode: any) {
    debugger;
    this.unlockRequest.GroupCode = GroupCode;
    this.unlockRequest.EndTermID=this.sSOLoginDataModel.EndTermID;
    this.unlockRequest.DepartmentID=this.sSOLoginDataModel.DepartmentID;
    this.unlockRequest.Eng_NonEng=this.sSOLoginDataModel.Eng_NonEng;
    this.loaderService.requestStarted();
    this.Swal2.Confirmation("Are you sure you want Unlock ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            await this.reportService.UnlockExaminerWithGroupCode(this.unlockRequest).then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data.State == EnumStatus.Success) {
                this.toastr.success(data.Message);
                // window.location.reload();
              }
              else if (data.State == EnumStatus.Error){
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
      });

  }

  // async PDFDownload(row: any) {
    
  //   let requestData: any = {
  //     CenterCode: this.filterForm?.value.CenterCode != "" && this.filterForm?.value.CenterCode != undefined && this.filterForm?.value.CenterCode != 0 ? this.filterForm?.value.CenterCode : 0,
  //     // GroupCode: this.filterForm?.value.GroupCode != "" && this.filterForm?.value.GroupCode != undefined && this.filterForm?.value.GroupCode != 0 ? this.filterForm?.value.GroupCode : 0,
  //     SubjectCode: this.filterForm?.value.SubjectCode != "" && this.filterForm?.value.SubjectCode != undefined && this.filterForm?.value.SubjectCode != 0 ? this.filterForm?.value.SubjectCode : '',
  //     //InstituteID: this.filterForm?.value.selectedInstitute != "" && this.filterForm?.value.selectedInstitute != undefined && this.filterForm?.value.selectedInstitute != 0 ? this.filterForm?.value.selectedInstitute : 0,
  //     SemesterID: this.filterForm?.value.selectedSemester != "" && this.filterForm?.value.selectedSemester != undefined && this.filterForm?.value.selectedSemester != 0 ? this.filterForm?.value.selectedSemester : 0,
  //     EndTermID: this.ssoLoginUser.EndTermID,
  //     DepartmentID: this.ssoLoginUser.DepartmentID,
  //     Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
  //     RoleID: this.ssoLoginUser.RoleID,
  //     SSOID: this.ssoLoginUser.SSOID,
  //     GroupCode: row.GroupCode,
  //     Action: 'ReportData'     
  //   }
  //   //this.CollegesWiseReportsModellList = [];
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.reportService.StatisticsInformationReportPdf(requestData)
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         if (data.State === EnumStatus.Success) {
  //           //this.CollegesWiseReportsModellList = data['Data'];
  //           this.DownloadFile(data.Data,'')

  //           //this.dataSource = new MatTableDataSource(this.CollegesWiseReportsModellList);
  //           //this.dataSource.sort = this.sort;  // Apply sorting
  //           //this.totalRecords = this.CollegesWiseReportsModellList.length;
  //           //this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  //           //this.updateTable();
  //         //} else if (data.State === 3) {
  //           //this.CollegesWiseReportsModellList = [];
  //           //this.dataSource = new MatTableDataSource(this.CollegesWiseReportsModellList);
  //           //this.dataSource.sort = this.sort;  // Apply sorting
  //           //this.totalRecords = this.CollegesWiseReportsModellList.length;
  //           //this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  //           //this.updateTable();
  //         }
  //       }, (error: any) => console.error(error));
  //   } catch (ex) {
  //     console.log(ex);
  //   } finally {
  //     this.loaderService.requestEnded();
  //   }
  // }

  // Handle page change event for pagination
  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    this.updateTable();
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


  async openFeedbackForm(content: any, row: any) {
    this.request.ExamName = row.ExamName
    this.request.ExaminerName = row.ExaminerName
    this.request.SubjectCode = row.SubjectCode
    this.request.GroupCode = row.GroupCode
    this.request.ExaminerID = row.ExaminerID
    this.request.CenterID = row.CenterID
    this.request.SubjectID = row.SubjectID
    this.request.GroupCodeID = row.GroupCodeID
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: true, centered: true });
    return;
  }

  async closeFeedbackForm() {
    this.modalService.dismissAll();
    this.modalReference?.close();   
    this.request = new ExaminerStaticReportFeedbackDataModel();
  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];

      if (this.file) {
        //  Check file size (max 2MB)
        if (this.file.size > 2 * 1024 * 1024) {
          this.toastr.error('Select a file less than 2MB');
          return;
        }
        //  Proceed with upload
        this.loaderService.requestStarted();
        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State == EnumStatus.Success) {
              if (Type === "sign") {
                this.request.SignPhoto = data['Data'][0]["FileName"];
                this.request.Dis_SignPhoto = data['Data'][0]["Dis_FileName"];
              } else if (Type === "MassCopyDocument") {
                this.request.MassCopyDocument = data['Data'][0]["FileName"];
                this.request.Dis_MassCopyDocument = data['Data'][0]["Dis_FileName"];
              }

              event.target.value = null; // Clear file input
            } else if (data.State === EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage);
            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }
          })
          .catch((error: any) => {
            console.error("Upload Error:", error);
            this.toastr.error("An error occurred while uploading the file.");
          });
      }
    } catch (Ex) {
      console.log("Exception in file upload:", Ex);
      this.toastr.error("Unexpected error occurred.");
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async SaveExaminerStaticReportFeedbackForm() {
    try {
      this.request.UserID = this.sSOLoginDataModel.UserID
      this.request.CourseType = this.sSOLoginDataModel.Eng_NonEng
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      await this.reportService.SaveExaminerStaticReportFeedbackForm(this.request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.closeFeedbackForm();
        }
        else if (data.State == EnumStatus.Error) {
          this.toastr.error(data.ErrorMessage);
        }
        else {
          this.toastr.warning(data.Message);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  ResetReport() {
    // this.filterForm.reset();
    this.filterForm.reset({
      SchemeID: 0,
      SemesterID: 0
    });
    // this.filter = {};
    // this.displayedColumns = [];
    // this.UniqueKeys = [];
    // this.CustomizeReportCoulmnDataPush = [];
    this.requestData = new ExaminerwithGroupcodeModel();
  }
  
}
