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
import { ExaminerStaticReportFeedbackDataModel, ExaminerStaticReportSearchModel } from '../../../Models/BTER/StaticsReportDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionHelper } from '../../../Common/commonFunctionHelper';

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
    'SrNo', 'ExamName', 'ExaminerName', 'SubjectCode', 'GroupCode', 
    // 'PresentbyExami', 'AbsentbyExami', 'CCCode',
     'Action'
  ];

  // Data source for the table
  dataSource: MatTableDataSource<CollegesWiseReportsModel> = new MatTableDataSource();
  sSOLoginDataModel: any;
  InstituteMasterList: any;
  SemesterMasterList: any;
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
  public requestData = new ExaminerStaticReportSearchModel();
  public requestDataPdf = new ExaminerStaticReportSearchModel();
  public requestMarksData = new ExaminerStaticReportSearchModel();

  public MarksDataList: any = [];

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(private loaderService: LoaderService,
    private reportService: ReportService,
    private commonMasterService: CommonFunctionService,
    private fb: FormBuilder,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public commonFunctionHelper: CommonFunctionHelper,
  ) {}

  async ngOnInit() {
    this.feedbackForm = this.fb.group({
      ExaminerID: [''],
      ExaminerCode: [''],
      GroupCodeID: [0],
      SubjectID: [0],
      CommonRemarkForQueAns: [''],
      IsMassCoping: [''],
      Syllabus: [''],
      InstituteLevel: [''],
      TeachingByTeacher: [''],
      StudyOfStudent: [''],
      SuggestionForImprovement: [''],
      Date: [''],
    });

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.getTodayDate();
    await this.loadMasterData();
    await this.GetAllData();
  }

  async getTodayDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    this.request.Date = `${year}-${month}-${day}`;
  }

  async loadMasterData() {
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
      subjectCodeDDLRequest.SemesterID = this.requestData.SemesterID ?? 0;
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

  async resetForm() {
    this.requestData = new ExaminerStaticReportSearchModel();
    await this.GetAllData();
  }

  async filterFormSubmit() {
    await this.GetAllData();
  }

  // Fetching the data from the service and updating the table
  async GetAllData() {

    this.requestData.EndTermID = this.ssoLoginUser.EndTermID;
    this.requestData.DepartmentID = this.ssoLoginUser.DepartmentID;
    this.requestData.Eng_NonEng = this.ssoLoginUser.Eng_NonEng;
    this.requestData.RoleID = this.ssoLoginUser.RoleID;
    this.requestData.SSOID = this.ssoLoginUser.SSOID;
    this.requestData.Action = 'StaticsReportProvideByExaminer';
    this.CollegesWiseReportsModellList = [];
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetStaticsReportProvideByExaminer(this.requestData)
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


  async PDFDownload(row: any) {
    debugger
    this.requestDataPdf.CenterCode = this.requestData.CenterCode;
    this.requestDataPdf.GroupCode = row.GroupCode;
    this.requestDataPdf.SubjectCode = this.requestData.SubjectCode;
    this.requestDataPdf.SemesterID = this.requestData.SemesterID;
    this.requestDataPdf.EndTermID = this.ssoLoginUser.EndTermID;
    this.requestDataPdf.DepartmentID = this.ssoLoginUser.DepartmentID;
    this.requestDataPdf.Eng_NonEng = this.ssoLoginUser.Eng_NonEng;
    this.requestDataPdf.RoleID = this.ssoLoginUser.RoleID;
    this.requestDataPdf.SSOID = this.ssoLoginUser.SSOID;
    this.requestDataPdf.Action = 'ReportData';

    //this.CollegesWiseReportsModellList = [];
    
    try {
      this.loaderService.requestStarted();
      await this.reportService.StatisticsInformationReportPdf(this.requestDataPdf)
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
          //alert(data.Data)
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }


  exportToExcel(): void {
    const unwantedColumns = [
     'ExaminerID', 'GroupCodeID', 'CenterCode', 'CCCode', 'Status', 'MassCopyDocument',
    ];
    const filteredData = this.CollegesWiseReportsModellList.map((item: any) => {
     const filteredItem: any = {};
     Object.keys(item).forEach(key => {
       if (!unwantedColumns.includes(key)) {
         filteredItem[key] = item[key];
       }
     });
     return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    // Create a new Excel workbook this.PreExamStudentData
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    // Export the Excel file
    XLSX.writeFile(wb, `StaticsReportExaminer_${timestamp}.xlsx`);
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
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const timestamp = `${day}-${month}-${year}_${hours}-${minutes}`;
    return `Download_Marks_Data_List_${timestamp}.${extension}`;
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
    this.getTodayDate();
  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];


      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png') {
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
        }
        else {
          this.toastr.error('Select Only jpeg/jpg/png file')
          return
        }

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
      if(this.request.CommonRemarkForQueAns == null || this.request.CommonRemarkForQueAns == undefined || this.request.CommonRemarkForQueAns == ''){
        this.toastr.error("Please Enter परीक्षार्थियों के उत्तरों के बारे में सामान्य टिप्पणियाँ एवं प्रत्येक प्रश्न पर टिप्पणी");
        return
      } else if(this.request.IsMassCoping == null || this.request.IsMassCoping == undefined){
        this.toastr.error("Please Select नकल/सामूहिक नकल (Mass Copying) यदि हो तो के संबंध में विस्तृत ठोस सूचना नियम पत्र में विस्तृत ब्यौरा लिखें |");
        return
      } else if(this.request.InstituteLevel == null || this.request.InstituteLevel == undefined || this.request.InstituteLevel == 0){
        this.toastr.error("Please Select संस्थान स्तर");
        return
      } else if(this.request.StudyOfStudent == null || this.request.StudyOfStudent == undefined || this.request.StudyOfStudent == 0){
        this.toastr.error("Please Select विद्यार्थियों के अध्ययन");
        return
      } else if (this.request.TeachingByTeacher == null || this.request.TeachingByTeacher == undefined || this.request.TeachingByTeacher == 0) {
        this.toastr.error("Please Select शिक्षक द्वारा शिक्षण");
        return
      } else if (this.request.SuggestionForImprovement == null || this.request.SuggestionForImprovement == undefined || this.request.SuggestionForImprovement == '') {
        this.toastr.error("Please Enter उन्नति हेतु सुझाव एवं अन्य");
        return
      } else if (this.request.Syllabus == null || this.request.Syllabus == undefined || this.request.Syllabus == 0) {
        this.toastr.error("Please Select पाठ्यक्रम");
        return
      } else if (this.request.SignPhoto == null || this.request.SignPhoto == undefined || this.request.SignPhoto == '') {
        this.toastr.error("Please Upload Sign Photo");
        return
      } else if (this.request.IsMassCoping == true && (this.request.MassCopyDocument == null || this.request.MassCopyDocument == undefined || this.request.MassCopyDocument == '')) {
        this.toastr.error("Please Upload Mass Copy Document");
        return
      }


      this.request.UserID = this.sSOLoginDataModel.UserID
      this.request.CourseType = this.sSOLoginDataModel.Eng_NonEng
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      await this.reportService.SaveExaminerStaticReportFeedbackForm(this.request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.closeFeedbackForm();
          await this.GetAllData();
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

  async closeMarksDataList() {
    this.modalService.dismissAll();
    this.modalReference?.close();   
    this.requestMarksData = new ExaminerStaticReportSearchModel();
  }

  async openMarksDataList(content: any, row: any) {
    await this.GetStaticsReportExaminerMarksData(row);
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: true, centered: true });
    return;
  }

  async GetStaticsReportExaminerMarksData(row: any) {
    try {
      this.requestMarksData.RoleID = this.ssoLoginUser.RoleID
      this.requestMarksData.EndTermID = this.ssoLoginUser.EndTermID
      this.requestMarksData.DepartmentID = this.ssoLoginUser.DepartmentID
      this.requestMarksData.Eng_NonEng = this.ssoLoginUser.Eng_NonEng
      this.requestMarksData.GroupCode = row.GroupCode
      this.requestMarksData.SSOID = this.ssoLoginUser.SSOID
      this.requestMarksData.SubjectCode = row.SubjectCode

      await this.reportService.GetStaticsReportExaminerMarksData(this.requestMarksData).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.MarksDataList = data.Data;
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
  
  async PDFDownload_theoryMarksReport(row: any) {
    try {
      //session
      const searchRequest: any = {};
      searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      searchRequest.RollNo = row.GroupCode;   // using RollNo param as in theory marks same is used

      await this.reportService.TheorymarksReportPdf_BTER(searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.commonFunctionHelper.downloadBase64OfPdf(data.Data, 'TheoryMarksReport.pdf');
          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.error(data.Message);
          }
          else {
            this.toastr.error(data.Message);
            console.log(data.ErrorMessage);
          }
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
}
