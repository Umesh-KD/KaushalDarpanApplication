import { Component } from '@angular/core';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ExamMasterService } from '../../Services/ExamMaster/exam-master.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { BlankReportModel, ExamMasterDataModel } from '../../Models/ExamMasterDataModel';
import { SweetAlert2 } from '../../Common/SweetAlert2'
import { EnumRole, EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { ReportService } from '../../Services/Report/report.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { SetExamAttendanceService } from '../../Services/SetExamAttendance/set-exam-attendance.service';
import { SetExamAttendanceSearchModel } from '../../Models/SetExamAttendanceDataModel';
@Component({
  selector: 'app-blank-report',
  standalone: false,
  templateUrl: './blank-report.component.html',
  styleUrl: './blank-report.component.css'
})
export class BlankReportComponent {


  ParentMenuDDLList: any;
  isParentMenuVisible: boolean = false;
  MenuMasterList: any;
  State: any;
  Message: any;
  ErrorMessage: any;
  public Table_SearchText: string = "";
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  closeResult: string | undefined;
  isAddMenuModalVisible: boolean = false;
  isDropdownVisible: boolean = false; // Checkbox state
  ParentId: number | null = null;
  public request = new BlankReportModel();
  public BranchList: any = []
  public SemesterMasterList: any = []
  public StreamMasterList: any = []
  public ExamTypeList: any = []
  public sSOLoginDataModel = new SSOLoginDataModel(); 
  public SubjectMasterList: any[] = [];
  public ExamShiftList: any = []
  public BlankReportList: any = []
  public StreamTypeList: any = []
  public ExamCategoryList: any = []      
  public ExamMasterID: number | null = null;
  public ExamFormGroup!: FormGroup;
  filteredSemesterList = [...this.SemesterMasterList];
  public BranchDDLList: any = [];
  CenterId: number = 0;
  CSId: number = 0;
  public searchRequest = new SetExamAttendanceSearchModel();
  public BlankReportDataList_admin: any = [];
  _EnumRole = EnumRole
  _GlobalConstants = GlobalConstants

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  StreamMasterDDL: any = [];
  public StudentList: any[] = [];
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "1000";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default
  
  constructor(private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private examMasterService: ExamMasterService,
    private toastr: ToastrService,
    private reportService: ReportService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private setExamAttendanceService: SetExamAttendanceService,
  ) {

  }
  get _ExamFormGroup() { return this.ExamFormGroup.controls; }
  async ngOnInit() {
    this.ExamFormGroup = this.fb.group({
        ddlBranch: ['', [DropdownValidators]],
        DateID: [''],
        StudentExamYear: ['', [DropdownValidators]],
        TimetableTime: ['', [DropdownValidators]],
        ddlSubject: ['', [DropdownValidators]],
        ddlExamCategoryID: ['', [DropdownValidators]]

      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.CenterId = Number( this.activatedRoute.snapshot.queryParamMap.get('centerid'));
    this.CSId = Number( this.activatedRoute.snapshot.queryParamMap.get('csid'));
    await this.GetExamShift();
    await this.GetMasterData();
    this.loadDropdownData('Branch');
    this.loadDropdownData('Semester');
    this.loadDropdownData('ResultExamType');
    await this.GetTradeDDL();

    if((this.sSOLoginDataModel.RoleID === EnumRole.Admin
      || this.sSOLoginDataModel.RoleID === EnumRole.AdminNon
      || this.sSOLoginDataModel.RoleID === EnumRole.JDConfidential_Eng
      || this.sSOLoginDataModel.RoleID === EnumRole.JDConfidential_NonEng
      || this.sSOLoginDataModel.RoleID === EnumRole.Secretary_JD
      || this.sSOLoginDataModel.RoleID === EnumRole.Secretary_JD_NonEng)
      && this.CenterId > 0
    ) {
      await this.GetBlankReportData_Admin();
    }
  }

  async GetTradeDDL() {
    try {
      this.loaderService.requestStarted();
      //await this.ItiTradeService.GetAllData(this.searchTradeRequest)
      //await this.commonFunctionService.StreamMaster()
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BranchDDLList = data['Data'];
        }, error => console.error(error));
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

  async GetExamShift() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamShift()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamShiftList = data['Data'];
        }, error => console.error(error));
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

  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'ResultExamType':
          this.ExamCategoryList = data['Data'];
          this.ExamCategoryList =this.ExamCategoryList.filter((item: any) => item.ID == 77 || item.ID == 78);
          break;
        default:
          break;
      }
    });
  }
  async GetMasterData() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
          this.SemesterMasterList = this.SemesterMasterList.filter((item: any) => ![7, 8, 9].includes(item.SemesterID));
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



  async ddlStream_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SubjectMaster_StreamIDWise(this.request.BranchID, this.sSOLoginDataModel.DepartmentID, this.request.SemesterID,)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectMasterList = data.Data;
        }, error => console.error(error));
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

  async DownloadDataList() {
    debugger
    //if (this._ExamFormGroup.invalid)
    //{
    //  return;
    //}
    this.isSubmitted = true;
    try {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.loaderService.requestStarted();
      
      if((this.sSOLoginDataModel.RoleID === EnumRole.Admin || this.sSOLoginDataModel.RoleID === EnumRole.AdminNon) && this.CenterId > 0){
        this.request.InstituteID = this.CenterId;
      }

      await this.reportService.BlankReport(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          } else if (data.State == 3) {
            this.toastr.warning("Data Not found");
          } else {
            this.toastr.error(data.ErrorMessage || 'Error fetching data.');
          }
        }, (error: any) => {
          console.error(error);
        });
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async ResetControls() {
    this.isSubmitted = false;
    this.request = new BlankReportModel()
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

  getSemesterCode(semesterId: number): string {
    debugger
    const semester = this.SemesterMasterList.find(
      (s: any) => s.SemesterID === Number(semesterId)
    );
  
    // Take first character from "1st Semester", "2nd Semester", etc.
    return semester ? semester.SemesterName.charAt(0) : '';
    // return semester ? semester.SemesterName.match(/\d/)?.[0] ?? '' : '';
  }
  getBranchCode(streamId: number): string {
    debugger
    const stream = this.BranchDDLList.find(
      (s:any) => s.StreamID === Number(streamId)
    );
  
    // Extract text inside first ()
    return stream
      ? stream.StreamName.match(/\(([^)]+)\)/)?.[1] ?? ''
      : '';
  }

  getInstituteCode(instituteName: string): string {
    // Extract text before "-"
    return instituteName.split('-')[0].trim();
  }
  

  generateFileName(extension: string): string {
    // const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    // return `file_${timestamp}.${extension}`;

    debugger;
    // const today = new Date();
    // const dd = String(today.getDate()).padStart(2, '0');
    // const mm = String(today.getMonth() + 1).padStart(2, '0');
    // const yyyy = today.getFullYear();
  
    // const formattedDate = `${dd}${mm}${yyyy}`; // 22012026

      if (!this.request.ExamDate) {
        this.toastr.error('Exam Date not selected');
        return '';
      }

      const datePart = this.request.ExamDate.split('T')[0]; // "2025-12-16

      const [yyyy, mm, dd] = datePart.split('-');
      const formattedDate = `${dd}${mm}${yyyy}`; // 16122025
      
    const instituteCode = this.getInstituteCode(this.sSOLoginDataModel.InstituteName);  
    const semestercode = this.getSemesterCode(this.request.SemesterID); 
    const branchCode = this.getBranchCode(this.request.BranchID);    
  
    return `13A_${formattedDate}_${instituteCode}_${semestercode}_${branchCode}.${extension}`;
  }

  async onBranchChange() {
    this.request.ExamDate = '';
    this.request.SemesterID = 0;
    this.request.ShiftID = 0;
    this.request.SubjectID = 0;
    this.request.SubjectCode = '';
    this.request.ExamCategoryID = 0;
  }

  async GetBlankReportData_Admin() {
    this.searchRequest.InvigilatorAppointmentID = this.sSOLoginDataModel.UserID
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID;

    if((this.sSOLoginDataModel.RoleID === EnumRole.Admin
      || this.sSOLoginDataModel.RoleID === EnumRole.AdminNon
      || this.sSOLoginDataModel.RoleID === EnumRole.JDConfidential_Eng
      || this.sSOLoginDataModel.RoleID === EnumRole.JDConfidential_NonEng
      || this.sSOLoginDataModel.RoleID === EnumRole.Secretary_JD
      || this.sSOLoginDataModel.RoleID === EnumRole.Secretary_JD_NonEng)
      && this.CenterId > 0
    ) {
      this.searchRequest.InstituteID = this.CenterId
      this.searchRequest.InstituteId = this.CenterId
    }
    
    try {
      this.loaderService.requestStarted();

      await this.setExamAttendanceService.GetBlankReportData_Admin(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success){
          this.BlankReportDataList_admin = data.Data
          this.loadInTable();
        } else {
          this.BlankReportDataList_admin = []
          this.loadInTable();
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.BlankReportDataList_admin].slice(this.startInTableIndex, this.endInTableIndex);
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
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.BlankReportDataList_admin] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.BlankReportDataList_admin.length;
  }
  // (replace org.list here)
  // get totalInTableSelected(): number {
  //   return this.BlankReportDataList_admin.length;
  // }
  // get sortInTableDirectionAero(): string {
  //   return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  // }
  // end table feature
}
