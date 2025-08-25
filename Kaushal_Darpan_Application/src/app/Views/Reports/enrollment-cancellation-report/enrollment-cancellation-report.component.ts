import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { DocumentDetailsService } from '../../../Common/document-details';
import { EnumRole, enumExamStudentStatus, EnumStatus, GlobalConstants, EnumStudentExamType } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonDDLSubjectCodeMasterModel } from '../../../Models/CommonDDLSubjectMasterModel';
import { CommonSubjectDetailsMasterModel } from '../../../Models/CommonSubjectDetailsMasterModel';
import { DeleteDocumentDetailsModel } from '../../../Models/DeleteDocumentDetailsModel';
import { DocumentDetailsModel } from '../../../Models/DocumentDetailsModel';
import { GenerateAdmitCardSearchModel } from '../../../Models/GenerateAdmitCardDataModel';
import { PreExamStudentDataModel, PreExam_UpdateEnrollmentNoModel, OptionalSubjectRequestModel, AnnexureDataModel } from '../../../Models/PreExamStudentDataModel';
import { ReportBasedModel } from '../../../Models/ReportBasedDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StudentMasterModel, Student_DataModel, M_StudentMaster_QualificationDetailsModel, StudentMarkedModel } from '../../../Models/StudentMasterModels';
import { SubjectSearchModel } from '../../../Models/SubjectMasterDataModel';
import { UploadFileModel } from '../../../Models/UploadFileModel';
import { ViewStudentDetailsRequestModel } from '../../../Models/ViewStudentDetailsRequestModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { PreExamStudentExaminationService } from '../../../Services/PreExamStudent/pre-exam-student-examination.service';
import { ReportService } from '../../../Services/Report/report.service';
import { PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-enrollment-cancellation-report',
  standalone: false,
  templateUrl: './enrollment-cancellation-report.component.html',
  styleUrl: './enrollment-cancellation-report.component.css'
})


export class EnrollmentCancellationReportComponent {

  // Pagination Properties
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();


  public _GlobalConstants: any = GlobalConstants;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public SubjectID: any[] = [];
  public UserID: number = 0
  public RoleID: number = 0
  public StudentStatusList: any = [];
  request = new PreExamStudentDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public SearchStudentDataFormGroup!: FormGroup;
  public isSubmitted: boolean = false;

  //table feature default
  public EnrollmentCancellationReportsList: any[] = [];//copy of main data
  public PreExamStudentData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default
  public StatusId: any;
  constructor(private commonMasterService: CommonFunctionService,
    private preExamStudentExaminationService: PreExamStudentExaminationService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private Swal2: SweetAlert2,
    public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute,
    private reportService: ReportService,
    private http: HttpClient,
    private documentDetailsService: DocumentDetailsService
  ) {

  }

  async ngOnInit() {

    this.SearchStudentDataFormGroup = this.formBuilder.group(
      {
        txtEnrollmentNo: [''],
        ddlInstituteID: [{ value: '', disabled: false }],
        //ddlFinancialYearID: ['', [DropdownValidators]],
        ddlStreamID: [''],
        ddlSemesterID: [''],
        /*        ddlExamstatus: ['', [DropdownValidators]],*/
        ddlStudentTypeID: [''],
        ddlManagementID: [''],
        ddlstatus: [''],
        ddlsubjectstaus: [''],
        ddlbridege: [''],
        ddlExamCategoryID: [''],
        txtStudentName: [''],
        txtMobileNo: [''],
        SessionType: ['']
      })

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    

    this.UserID = this.sSOLoginDataModel.UserID
    
    await this.GetMasterData();

    // for dashboard tiles search
    let _studentFilterStatusId = Number(this.activatedRoute.snapshot.paramMap.get('id')?.toString());
    if (_studentFilterStatusId > 0) {
      this.request.StudentFilterStatusId = _studentFilterStatusId;
      this.btn_SearchClick();
    }
  }


  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.EnrollmentCancellationReportsList = [...this.PreExamStudentData].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }
  // (replace org. list here)
  async sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.EnrollmentCancellationReportsList = ([...this.PreExamStudentData] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }

  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  resetInTableValiable() {
    this.EnrollmentCancellationReportsList = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.PreExamStudentData.length;
  }
  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetEnrollmentCancelStatusByRole(this.sSOLoginDataModel.RoleID, 2)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentStatusList = data['Data'];
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.EnrollmentCancellationReportsList);
    // Create a new Excel workbook this.PreExamStudentData
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'EnrollmentCancellationReports.xlsx');
  }

  async btn_SearchClick() {
    this.isSubmitted = true;
    //if (this.SearchStudentDataFormGroup.invalid) {
    //  return
    //}
    try {
      await this.GetPreExamStudent();

      //if (this.request.Year_SemID == 3) {
      //  this.showSubject = true

      //} else {
      //  this.showSubject = false
      //}

    }
    catch (Ex) {
      console.log(Ex);
    }


  }

  async GetPreExamStudent() {
    try {
      
      this.isSubmitted = true;
      //session
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      //call
      this.loaderService.requestStarted();
      await this.preExamStudentExaminationService.GetEnrollmentCancelStudent(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //
          if (data.State == EnumStatus.Success) {
            this.EnrollmentCancellationReportsList = data['Data'];
            this.PreExamStudentData = data['Data'];
            //table feature load
            //this.loadInTable();
            //end table feature load
          }
          else {
            this.toastr.error(data.ErrorMessage);
          }
          /*await this.GetSubjectMasterDDL()*/
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isSubmitted = false;
      }, 200);
    }
  }

  async btn_Clear() {
    /* this.SearchStudentDataFormGroup.reset()*/
    this.request.ApplicationNo = '';
    this.request.Name = '';
    this.GetMasterData()
    this.request.StudentFilterStatusId = 0;
  }
  
}

