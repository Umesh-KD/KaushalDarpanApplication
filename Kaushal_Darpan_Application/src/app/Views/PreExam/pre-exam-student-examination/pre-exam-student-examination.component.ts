import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AnnexureDataModel, OptionalSubjectRequestModel, PreExamStudentDataModel, PreExam_UpdateEnrollmentNoModel } from '../../../Models/PreExamStudentDataModel';
import { SubjectSearchModel } from '../../../Models/SubjectMasterDataModel';
import { ForSMSEnrollmentStudentMarkedModel, ForSMSNotifyStudentModel, M_StudentMaster_QualificationDetailsModel, StudentMarkedModel, StudentMasterModel, Student_DataModel } from '../../../Models/StudentMasterModels';
import { EnumFileUpload, EnumRole, EnumStatus, EnumStudentExamType, GlobalConstants, enumExamStudentStatus, EnumStudentType, EnumCourseType, EnumMessageType } from '../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CommonSubjectDetailsMasterModel } from '../../../Models/CommonSubjectDetailsMasterModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { PreExamStudentExaminationService } from '../../../Services/PreExamStudent/pre-exam-student-examination.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { UserMasterService } from '../../../Services/UserMaster/user-master.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ActivatedRoute } from '@angular/router';
import { DropdownValidators, notZeroValidator } from '../../../Services/CustomValidators/custom-validators.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { ReportBasedModel } from '../../../Models/ReportBasedDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { DeleteDocumentDetailsModel } from '../../../Models/DeleteDocumentDetailsModel';
import { UploadBTERFileModel, UploadFileModel } from '../../../Models/UploadFileModel';
import { ViewStudentDetailsRequestModel } from '../../../Models/ViewStudentDetailsRequestModel';
import { DocumentDetailsModel } from '../../../Models/DocumentDetailsModel';
import { DocumentDetailsService } from '../../../Common/document-details';
import { DataPagingListModel } from '../../../Models/DataPagingListModel';
import { AfterViewInit } from '@angular/core';
import { CommonDDLSubjectCodeMasterModel, OptionalSubjectDDLDataModel } from '../../../Models/CommonDDLSubjectMasterModel';
import { GenerateAdmitCardModel, GenerateAdmitCardSearchModel } from '../../../Models/GenerateAdmitCardDataModel';
import { CampusPostMaster_Action } from '../../../Models/CampusPostDataModel';
import { ApplicationMessageDataModel } from '../../../Models/ApplicationMessageDataModel';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';

declare function tableToExcel(table: any, name: any, fileName: any): any;

@Component({
  selector: 'app-pre-exam-student-examination',
  templateUrl: './pre-exam-student-examination.component.html',
  styleUrls: ['./pre-exam-student-examination.component.css'],
  standalone: false
})
export class PreExamStudentExaminationComponent {
  public _GlobalConstants: any = GlobalConstants;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public SubjectID: any[] = [];
  public UserID: number = 0
  public RoleID: number = 0
  public InstituteMasterList: any = [];
  public InstitutionManagementMasterList: any = [];
  public StreamMasterList: any = [];
  public SemesterMasterList: any = [];
  public StudentTypeList: any = [];
  public StudentStatusList: any = [];
  public ExamCategoryList: any = [];
  public PreExamStudentData: StudentMasterModel[] = [];
  public PreExamStudentDataForExcel: StudentMasterModel[] = [];
  public RejectAtBTERList: any[] = [];
  public AnnexureMainList: any[] = [];
  public AnnexureSpecialList: any[] = [];
  public SubjectCode: any = [];
  public SelectedSubjectList: any = [];
  public SessionTypeList: any = [];
  public filteredSemesterList: any = [];
  public OptionalSubjectDDLList: any = [];

  public StudentProfileDetailsData: any = [];
  public Student_QualificationDetailsData: any = [];
  public documentDetails: DocumentDetailsModel[] = [];
  public SubjectCodeMasterDDLList: any[] = [];
  public settingsMultiselect: object = {};
  public commonSubjectDetails: CommonSubjectDetailsMasterModel[] = [];
  public Student_DataList: Student_DataModel[] = []
  public rejectAtBter_StudentDetails: any = []
  public statusID: number = 0
  public InstituteID: number = 0
  public showSubject: boolean = false
  public subjectCodeDDLRequest = new CommonDDLSubjectCodeMasterModel();
  request = new PreExamStudentDataModel();
  searchrequest = new SubjectSearchModel()
  requestStudent = new StudentMasterModel();
  RequestStudent = new M_StudentMaster_QualificationDetailsModel();
  requestUpdateEnrollmentNo = new PreExam_UpdateEnrollmentNoModel();
  optSubRequest = new OptionalSubjectRequestModel();
  AnnexureDataModel = new AnnexureDataModel();
  public _EnumRole = EnumRole;
  sSOLoginDataModel = new SSOLoginDataModel();
  public messageModel = new ApplicationMessageDataModel();
  public optionalSubRequest = new OptionalSubjectDDLDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public IsShowViewStudent: boolean = false;
  public StudentTypeMasterList: any = [];
  public BoardMasterList: any = [];
  public PassingYearList: any = [];
  public ExamStudentStatusDDLList: any = [];
  public CasteCategoryAMasterData: any = [];
  public CasteCategoryBMasterData: any = [];
  public SubjectMasterDDLList: any[] = [];
  public selectedSubjects: any = [];
  public optionalSubjectList: any = [];
  public optionalChildSubjectList: any = [];
  public studentOptionalSubjectList: any = [];
  public status: number = 0
  public FinancialYear: any = []
  public isShowdrop: boolean = true
  isSearchEnabled: boolean = false;
  IsVerified: boolean = false;
  isDropdownVisible: boolean = false;
  public NewExamStudentStatusDDLList: any = []
  EditStudentDataFormGroup!: FormGroup;
  formUpdateEnrollmentNo!: FormGroup;
  public SearchStudentDataFormGroup!: FormGroup;
  public OptionalSubjectFormGroup!: FormGroup;
  public InstitutesListForStudent: any = []
  public isShowImageDeleteButton: boolean = false
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;

  public TodayDate = new Date()

  public _enumExamStudentStatus = enumExamStudentStatus;

  public ReportBasedModelSearch = new ReportBasedModel()
  public file!: File;

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default
  public StatusId: any;
  public SubCasteCategoryADDLList: any[] = [];
  public reportRequest = new ReportBasedModel()
  public AdmitcardModel = new GenerateAdmitCardSearchModel()
  MapKeyEng: number = 0;
  StudentExamID: number = 0;
  public DateConfigSetting: any = [];
  public minDate: string = '';
  public settingsMultiselector: object = {};
  modalRef!: NgbModalRef;

  public IsYearly: boolean = false;
  public _enumStudentType = EnumStudentType;

  public PromoteStatusList: any[] = [];
  public StudentExamTypeList: any[] = [];

  public _EnumCourseType = EnumCourseType;

  @ViewChild('MyModel_Action') myModalTemplate!: TemplateRef<any>;
  public IsRejectAtBter: boolean = false;
  public IsFormActionSubmitted: boolean = false;
  public requestRejectDoc: any;
  formAction!: FormGroup;
  requestAction = new CampusPostMaster_Action();
  public RejectDocumentDetail: any = []

  public UpdateOptionalAfterEligibleFG!: FormGroup;
  public updateOptionalAfterEligibleList: any = [];
  public updateOptionalChildAfterEligibleList: any = [];
  public alreadyAssignedOptionalSubject: any = [];

  constructor(private commonMasterService: CommonFunctionService,
    private preExamStudentExaminationService: PreExamStudentExaminationService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private UserMasterService: UserMasterService,
    private Swal2: SweetAlert2,
    public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute,
    private reportService: ReportService,
    private http: HttpClient,
    private documentDetailsService: DocumentDetailsService,
    private smsMailService: SMSMailService,
  ) {



  }

  async ngOnInit() {
    this.settingsMultiselect =
    {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      IsVerified: false,
    };

    this.settingsMultiselector = {
      singleSelection: false,
      idField: 'Code',
      textField: 'Name',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.SearchStudentDataFormGroup = this.formBuilder.group(
      {
        txtEnrollmentNo: [''],
        ddlInstituteID: [{ value: '', disabled: false }],
        //ddlFinancialYearID: ['', [DropdownValidators]],
        ddlStreamID: [''],
        ddlSemesterID: [''],
        IsYearly: [''],
        /*        ddlExamstatus: ['', [DropdownValidators]],*/
        ddlStudentTypeID: [''],
        ddlManagementID: [''],
        ddlstatus: [''],
        ddlsubjectstaus: [''],
        ddlbridege: [''],
        ddlExamCategoryID: [''],
        txtStudentName: [''],
        txtMobileNo: [''],
        SessionType: [''],
        PromoteStatus: [''],
        StudentExamType: [''],
        txtAbc: [''],
        OptionalSubjectID: ['']
      })

    this.OptionalSubjectFormGroup = this.formBuilder.group(
      {
        ddlOptParentSubjectID: [''],
        ddlOptSubjectID: [''],
      })

    this.UpdateOptionalAfterEligibleFG = this.formBuilder.group(
      {
        ddlOptParentSubjectID: [''],
        ddlOptSubjectID: [''],
      })

    this.EditStudentDataFormGroup = this.formBuilder.group(
      {
        txtStudentName: [{ value: '', disabled: true }, Validators.required],
        txtStudentNameHindi: [{ value: '', disabled: true }, Validators.required],
        txtFatherName: [{ value: '', disabled: true }, Validators.required],
        txtFatherNameHindi: [{ value: '', disabled: true }, Validators.required],
        txtMotherName: [{ value: '', disabled: true }, Validators.required],
        txtMotherNameHindi: [{ value: '', disabled: true }, Validators.required],
        ddlStudentTypeID: [{ value: '', disabled: true }, Validators.required],
        ddlGender: [{ value: '', disabled: true }, Validators.required],
        txtPapers: [''],
        ddlInstituteID: [{ value: '', disabled: true }, [DropdownValidators]],
        ddlStreamID: [{ value: '', disabled: true }, [DropdownValidators]],
        txtMobileNo: ['', Validators.required],

        ddlCategoryA_ID: [{ value: '', disabled: true }, [DropdownValidators]],
        ddlCategoryB_ID: [{ value: '', disabled: true }, [DropdownValidators]],
        txtDOB: [{ value: '', disabled: true }, Validators.required],
        txtAbc: ['',],
        txtEmail: [{ value: '' }],
        txtAadharNo: [{ value: '', disabled: true }],
        txtBhamashahNo: [{ value: '', disabled: true }],
        txtAddress: [{ value: '', disabled: true }],
        txtBankName: [{ value: '', disabled: true }],
        txtIFSCCode: [{ value: '', disabled: true }],
        txtBankAccountNo: [{ value: '', disabled: true }],
        IsVerified: [''],
        ddlSubCategoryA_ID: [{ value: '', disabled: true }, Validators.required],
        frmMultiSelect: ['']
      })
    this.requestStudent.commonSubjectDetails = [];

    this.formUpdateEnrollmentNo = this.formBuilder.group(
      {
        //txtEnrollmentNo: ['', Validators.required, disable: true],
        txtEnrollmentNo: [{ value: '', disabled: true }, Validators.required],
        ddlInstituteID: ['', [DropdownValidators]],
        ddlBranch: ['', [DropdownValidators]],
        txtOrderNo: ['', Validators.required],
        txtOrderDate: ['', Validators.required],
        txtUpdatedDate: ['', Validators.required]
      })

    this.formAction = this.formBuilder.group({
      txtActionRemarks: ['', Validators.required],
      OrderNo: ['', Validators.required],
      OrderDate: ['', Validators.required],
    })

    this.requestStudent.QualificationDetails = [];
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.InstituteID = Number(this.activatedRoute.snapshot.paramMap.get('instituteId') ?? 0);
    //debugger
    // handle for found both
    let _studentFilterStatusId = Number(this.activatedRoute.snapshot.paramMap.get('id')?.toString());// or
    if (isNaN(_studentFilterStatusId) == true) {
      _studentFilterStatusId = Number(this.activatedRoute.snapshot.queryParamMap.get('status')?.toString());// either
    }
    this.statusID = _studentFilterStatusId;
    //

    this.UserID = this.sSOLoginDataModel.UserID
    if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID
    }
    if (this.InstituteID > 0) {
      this.request.InstituteID = this.InstituteID
    }

    if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
      this.isShowdrop = true;

      this.SearchStudentDataFormGroup.get('ddlInstituteID')?.disable();

    } else {
      this.isShowdrop = false;
      this.SearchStudentDataFormGroup.get('ddlInstituteID')?.enable();
    }
    this.showImageDeleteButton()
    await this.GetMasterData();
    await this.GetDateConfig();
    await this.GetOptionalSubjectDDL();
    this.request.IsYearly = this.sSOLoginDataModel.ExamScheme;
    //setTimeout(() => {
    //  this.GetPreExamStudent();
    //}, 2000); 
    // for dashboard tiles search


    if (isNaN(this.statusID) == false) {
      this.request.StudentFilterStatusId = this.statusID;
      await this.btn_SearchClick();
      this.SearchStudentDataFormGroup.get('ddlstatus')?.disable();
    }


    this.setMinDate();
    this.ExaminationSchemeChange();

  }

  get EditStudentDataform() { return this.EditStudentDataFormGroup.controls; }
  get FormUEM() { return this.formUpdateEnrollmentNo.controls; }
  get _OptionalSubjectFormGroup() { return this.OptionalSubjectFormGroup.controls; }
  get FormAction() { return this.formAction.controls; }

  setMinDate(): void {
    const today = new Date();
    this.minDate =
      this.minDate = today.toISOString().split('T')[0];
  }

  showImageDeleteButton() {
    if (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon) {
      this.isShowImageDeleteButton = true
    } else {
      this.isShowImageDeleteButton = false
    }
  }

  async GetMasterData() {
    //debugger
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {
            this.InstituteMasterList = data['Data'];
            this.request.InstituteID = this.sSOLoginDataModel.InstituteID
            this.InstituteMasterList = this.InstituteMasterList.filter((x: any) => { return x.InstituteID == this.request.InstituteID });
            //console.log(this.sSOLoginDataModel.InstituteID,'ss1')
            //console.log(this.InstituteMasterList,'ss2')
          } else {
            this.InstituteMasterList = data['Data'];
            //this.request.InstituteID = 0
          }
        }, (error: any) => console.error(error));


      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstitutesListForStudent = data['Data'];
          console.log("InstitutesListForStudent", this.InstitutesListForStudent);
        }, (error: any) => console.error(error));

      await this.commonMasterService.GetManagType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstitutionManagementMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
          this.StreamMasterList = data['Data'];
        }, (error: any) => console.error(error));
      await this.commonMasterService.SemesterMaster(1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.StudentType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentTypeList = data['Data'];
          this.StudentTypeMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.GetStudentStatusByRole(this.sSOLoginDataModel.RoleID, 2)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentStatusList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.ExamCategory()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamCategoryList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CasteCategoryAMasterData = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.CasteCategoryB()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CasteCategoryBMasterData = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.Board_UniversityMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BoardMasterList = data['Data'];
          //console.error(this.BoardMasterList);
        }, (error: any) => console.error(error));

      await this.commonMasterService.PassingYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PassingYearList = data['Data'];
        }, (error: any) => console.error(error));
      await this.commonMasterService.GetFinancialYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.FinancialYear = data['Data'];
          console.log(this.FinancialYear, "Year")
        }, (error: any) => console.error(error));
      await this.commonMasterService.ExamStudentStatus(this.sSOLoginDataModel.RoleID, 2)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamStudentStatusDDLList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.GetExamType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.SessionTypeList = data['Data'];
          console.log("this.SessionTypeList", this.SessionTypeList);
        }, error => console.error(error));

      await this.commonMasterService.GetCommonMasterDDLByType('PromoteStudentStatus')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PromoteStatusList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.GetCommonMasterDDLByType('StudentExamType')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentExamTypeList = data['Data'];
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

  async GetSubjectMasterDDL() {
    this.searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetParentSubjectDDL(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.SubjectMasterDDLList = data['Data'];
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

  ExaminationSchemeChange() {
    this.request.Year_SemID = 0
    if (this.request.IsYearly == 0) {
      this.filteredSemesterList = this.SemesterMasterList.filter((item: any) => item.SemesterID <= 6);
    } else if (this.request.IsYearly == 1) {
      this.filteredSemesterList = this.SemesterMasterList.filter((item: any) => item.SemesterID >= 7);
    } else {
      this.filteredSemesterList = this.SemesterMasterList
    }
  }

  updateSelectedSubjects() {
    // Filter the SubjectMasterDDLList to get subjects whose IDs are in SubjectID
    this.selectedSubjects = this.SubjectMasterDDLList.filter(subject =>
      this.SubjectID.includes(subject.SubjectID)
    );
  }

  async btn_SearchClick() {
    this.isSubmitted = true;
    if (this.SearchStudentDataFormGroup.invalid) {
      return
    }
    try {
      await this.GetPreExamStudent();

      if (this.request.Year_SemID == 3) {
        this.showSubject = true

      } else {
        this.showSubject = false
      }

    }
    catch (Ex) {
      console.log(Ex);
    }


  }

  async GetPreExamStudent() {

    //debugger
    try {
      this.isSubmitted = true;
      //session
      this.PreExamStudentData = []
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      //call
      this.loaderService.requestStarted();
      await this.preExamStudentExaminationService.GetPreExamStudent(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //
          if (data.State == EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.PreExamStudentData = data['Data'];
            this.PreExamStudentDataForExcel = data['Data'];
            console.log(this.PreExamStudentData, "daataa")
            //table feature load
            this.loadInTable();
            //end table feature load
          }
          else {
            this.toastr.error(data.ErrorMessage);
          }
          this.searchrequest.BranchID = this.request.BranchID
          this.searchrequest.SemesterID = this.request.Year_SemID
          await this.GetSubjectMasterDDL()
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
    this.StudentTypeList = []
    this.InstituteMasterList = []
    this.GetMasterData()

    this.showSubject = false

    this.request.ManagementTypeID = 0;
    this.request.MobileNo = '';
    this.request.BranchID = 0;
    this.request.Year_SemID = 0;

    this.request.StudentStatusID = 0;
    this.request.StudentFilterStatusId = 0;
    this.request.ExamCategoryID = 0;
    this.request.OptionalSubjectStatus = '0';
    this.request.BridgeCourseID = '0';
  }

  async ViewStudentDetails(content: any, StudentID: number, StudentExamID: number) {
    if (this.request.StudentFilterStatusId == enumExamStudentStatus.Addimited) {
      return
    }

    this.IsShowViewStudent = true;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.GetStudentProfileDetails(StudentID, StudentExamID)
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  CloseViewStudentDetails() {

    this.modalService.dismissAll();
    this.requestStudent = new StudentMasterModel()
    this.SubjectID = []
    this.SubjectMasterDDLList = []
    this.GetSubjectMasterDDL()
    this.IsVerified = false;
    this.ResetUpdateEnroll()

  }

  async GetStudentProfileDetails(StudentID: number, StudentExamID: number) {
    try {
      this.loaderService.requestStarted();
      //model
      let model = new ViewStudentDetailsRequestModel()
      model.StudentID = StudentID;
      model.StudentFilterStatusId = this.request.StudentFilterStatusId;
      model.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      model.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      model.EndTermID = this.sSOLoginDataModel.EndTermID;
      model.StudentExamID = StudentExamID;
      model.FileNameWithDynamicPath = EnumFileUpload.FileNameWithDynamicPath;
      //
      await this.preExamStudentExaminationService.ViewStudentDetails(model)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentProfileDetailsData = data['Data']['ViewStudentDetails'];
          this.Student_QualificationDetailsData = data['Data']['Student_QualificationDetails'];
          this.documentDetails = data['Data']['documentDetails'];
          // for admitted/new admitted
          if (this.StudentProfileDetailsData[0].status == null || this.StudentProfileDetailsData[0].status == "") {
            this.StudentProfileDetailsData[0].status = this.StudentProfileDetailsData[0].status1;
          }
          this.IsYearly = data['Data']['ViewStudentDetails'][0]['IsYearly'];
          //this.setStudentFilesForOldBterview()
          console.log(data['Data']['ViewStudentDetails'][0]['IsYearly'], "yearly")
          console.log(this.StudentProfileDetailsData, "view student")
          console.log(data)

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

  //get edit student
  async GetPreExam_StudentMaster(StudentID: number, StudentExamID: number) {
    var DepartmentID = this.sSOLoginDataModel.DepartmentID
    var Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    var EndTermID = this.sSOLoginDataModel.EndTermID
    var FileNameWithDynamicPath = EnumFileUpload.FileNameWithDynamicPath
    try {
      this.loaderService.requestStarted();
      await this.preExamStudentExaminationService.PreExam_StudentMaster(StudentID, this.request.StudentFilterStatusId, DepartmentID, Eng_NonEng, EndTermID, StudentExamID, FileNameWithDynamicPath)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.requestStudent = data['Data'];
          console.log(data)
          this.requestStudent.StudentID = data['Data']['StudentID'];
          this.requestStudent.ApplicationNo = data['Data']['ApplicationNo'];
          this.requestStudent.EnrollmentNo = data['Data']['EnrollmentNo'];
          this.requestStudent.AdmissionCategoryID = data['Data']['AdmissionCategoryID'];
          this.requestStudent.InstituteID = data['Data']['InstituteID'];
          this.requestStudent.StreamID = data['Data']['StreamID'];
          this.requestStudent.InstituteStreamID = data['Data']['InstituteStreamID'];
          this.requestStudent.StudentName = data['Data']['StudentName'];
          this.requestStudent.StudentNameHindi = data['Data']['StudentNameHindi'];
          this.requestStudent.FatherName = data['Data']['FatherName'];
          this.requestStudent.FatherNameHindi = data['Data']['FatherNameHindi'];
          this.requestStudent.MotherName = data['Data']['MotherName'];
          this.requestStudent.StudentExamStatus = data['Data']['StudentExamStatus'];
          this.requestStudent.MotherNameHindi = data['Data']['MotherNameHindi'];
          this.requestStudent.Gender = data['Data']['Gender'];
          // this.requestStudent.Dis_DOB = new Date(data['Data']['DOB']).toISOString().split('T').shift().toString();
          const dob = new Date(data['Data']['DOB']);
          const year = dob.getFullYear();
          const month = String(dob.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1
          const day = String(dob.getDate()).padStart(2, '0');
          this.requestStudent.DOB = `${year}-${month}-${day}`;

          this.requestStudent.CategoryA_ID = data['Data']['CategoryA_ID'];
          this.requestStudent.CategoryB_ID = data['Data']['CategoryB_ID'];
          this.requestStudent.MobileNo = data['Data']['MobileNo'];
          this.requestStudent.TelephoneNo = data['Data']['TelephoneNo'];
          this.requestStudent.Email = data['Data']['Email'];
          this.requestStudent.Address1 = data['Data']['Address1'];
          this.requestStudent.AadharNo = data['Data']['AadharNo'];
          this.requestStudent.FatherAadharNo = data['Data']['FatherAadharNo'];
          this.requestStudent.JanAadharNo = data['Data']['JanAadharNo'];
          this.requestStudent.JanAadharMobileNo = data['Data']['JanAadharMobileNo'];
          this.requestStudent.JanAadharName = data['Data']['JanAadharName'];
          this.requestStudent.BankAccountNo = data['Data']['BankAccountNo'];
          this.requestStudent.IFSCCode = data['Data']['IFSCCode'];
          this.requestStudent.BankAccountName = data['Data']['BankAccountName'];
          this.requestStudent.BankName = data['Data']['BankName'];

          this.requestStudent.Remark = data['Data']['Remark'];
          this.requestStudent.TypeOfAdmissionID = data['Data']['TypeOfAdmissionID'];
          this.requestStudent.StudentStatusID = data['Data']['StudentStatusID'];
          this.requestStudent.SemesterID = data['Data']['SemesterID'];
          this.requestStudent.StudentTypeID = data['Data']['StudentTypeID'];
          this.requestStudent.BhamashahNo = data['Data']['BhamashahNo'];
          this.requestStudent.JanAadharMemberId = data['Data']['JanAadharMemberId'];
          this.requestStudent.JanAadharMemberId = data['Data']['JanAadharMemberId'];
          this.requestStudent.Papers = data['Data']['Papers'];
          this.requestStudent.CourseTypeID = data['Data']['CourseTypeID'];
          this.requestStudent.FinancialYearName = data['Data']['FinancialYearName'];

          if (data['Data']['Dis_StudentPhoto'] != null) {

            this.requestStudent.Dis_StudentPhoto = data['Data']['Dis_StudentPhoto'];
          } else {
            this.requestStudent.Dis_StudentPhoto = ''
          }
          if (data['Data']['Dis_StudentSign'] != null) {

            this.requestStudent.Dis_StudentSign = data['Data']['Dis_StudentSign'];
          } else {
            this.requestStudent.Dis_StudentSign = ''
          }
          if (data['Data']['StudentPhoto'] != null) {

            this.requestStudent.StudentPhoto = data['Data']['StudentPhoto'];
          } else {
            this.requestStudent.StudentPhoto = ''
          }
          if (data['Data']['StudentSign'] != null) {

            this.requestStudent.StudentSign = data['Data']['StudentSign'];
          } else {
            this.requestStudent.StudentSign = ''
          }

          try {
            this.requestStudent.Dis_DOB = (new Date(data['Data']['Dis_DOB'])?.toISOString()?.split('T')?.shift()?.toString()) ?? "";
          }
          catch (ex) {
          }

          this.requestStudent.QualificationDetails = data['Data']['QualificationDetails'];
          this.requestStudent.commonSubjectDetails = data['Data']['Subjects'];
          this.requestStudent.Status_old = data['Data']['Status_old'];

          /*this.requestStudent.QualificationDetails = data['Data'].QualificationDetails ;*/

          this.requestUpdateEnrollmentNo.StudentID = data['Data']['StudentID'];
          this.requestUpdateEnrollmentNo.EnrollmentNo = data['Data']['EnrollmentNo'];
          this.requestUpdateEnrollmentNo.InstituteID = data['Data']['InstituteID'];

          this.requestUpdateEnrollmentNo.StreamID = data['Data']['StreamID'];

          this.requestUpdateEnrollmentNo.StudentExamID = data['Data']['StudentExamID'];
          this.requestUpdateEnrollmentNo.SemesterID = data['Data']['SemesterID'];

          console.log(this.requestStudent.Papers, 'Papers')
          /*this.requestUpdateEnrollmentNo.OrderNo = data['Data']['OrderNo'];*/
          const selectedSubjectIDs = this.requestStudent.commonSubjectDetails?.map((x: any) => x.SubjectId);

          //sub caste
          this.requestStudent.SubCategoryA_ID = data.Data.SubCategoryA_ID;
          await this.GetSubCasteCategoryADDL();//ddl

          // Map the SubjectIDs to the corresponding full object in SubjectMasterDDLList
          this.SubjectID = this.SubjectMasterDDLList.filter((subject: any) =>
            selectedSubjectIDs?.includes(subject.ID)
          );
          this.requestStudent.StudentExamID = data['Data']['StudentExamID'];


          if (this.requestStudent.StudentTypeID == 2) {
            this.EditStudentDataFormGroup.get('txtPapers')?.enable()
          } else {
            this.EditStudentDataFormGroup.get('txtPapers')?.disable()
          }

          this.SelectedSubjectList = [];
          const paperArray = this.requestStudent.StudentPaper.split(',');

          paperArray.forEach(paper => {
            this.SelectedSubjectList.push({ Name: paper.trim(), Code: paper.trim() });
          });
          // FOR is yearly check
          this.IsYearly = data['Data']['IsYearly'];
          //this.setStudentFilesForOldBter();
          //
          await this.GetSubjectCodeMasterDDL();
          await this.GetBackSubjectList();

          console.log(this.SelectedSubjectList + "TestData");

          //history verified status
          this.requestStudent.His_StatusId = data['Data']['His_StatusId'];

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

  async GetStudentupdateEnrollData(StudentID: number, StudentExamID: number) {
    var DepartmentID = this.sSOLoginDataModel.DepartmentID
    var Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    var EndTermID = this.sSOLoginDataModel.EndTermID
    try {
      this.loaderService.requestStarted();
      await this.preExamStudentExaminationService.GetStudentupdateEnrollData(StudentID, this.request.StudentFilterStatusId, DepartmentID, Eng_NonEng, EndTermID, StudentExamID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          console.log(data)


          this.requestUpdateEnrollmentNo.StudentID = data['Data']['StudentID'];
          this.requestUpdateEnrollmentNo.EnrollmentNo = data['Data']['EnrollmentNo'];
          this.requestUpdateEnrollmentNo.InstituteID = data['Data']['InstituteID'];
          this.requestUpdateEnrollmentNo.StreamID = data['Data']['StreamID'];
          this.requestUpdateEnrollmentNo.StudentExamID = data['Data']['StudentExamID'];
          this.requestUpdateEnrollmentNo.IsUpdate = data['Data']['IsUpdate'];
          this.requestUpdateEnrollmentNo.OrderNo = data['Data']['OrderNo'];
          this.requestUpdateEnrollmentNo.SemesterID = data['Data']['SemesterID'];

          if (data['Data']['OrderDate'] != null && data['Data']['OrderDate'] !== '') {
            const OrderDate = new Date(data['Data']['OrderDate']);

            // Check if the date is valid to avoid "1-1-1970"
            if (!isNaN(OrderDate.getTime())) {
              const Orderyear = OrderDate.getFullYear();
              const OrderMonth = String(OrderDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1
              const day = String(OrderDate.getDate()).padStart(2, '0');
              this.requestUpdateEnrollmentNo.OrderDate = `${Orderyear}-${OrderMonth}-${day}`;
            } else {
              this.requestUpdateEnrollmentNo.OrderDate = ''; // Handle invalid date
            }
          } else {
            this.requestUpdateEnrollmentNo.OrderDate = '';
          }


          if (data['Data']['UpdatedDate'] != null && data['Data']['UpdatedDate'] !== '') {
            const UpdateDate = new Date(data['Data']['UpdatedDate']);

            // Ensure the date is valid
            if (!isNaN(UpdateDate.getTime())) {
              const Updateyear = UpdateDate.getFullYear();
              const UpdateMonth = String(UpdateDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1
              const Updateday = String(UpdateDate.getDate()).padStart(2, '0');
              this.requestUpdateEnrollmentNo.UpdatedDate = `${Updateyear}-${UpdateMonth}-${Updateday}`;
            } else {
              this.requestUpdateEnrollmentNo.UpdatedDate = ''; // Set empty if the date is invalid
            }
          } else {
            this.requestUpdateEnrollmentNo.UpdatedDate = ''; // Handle null or empty values
          }





          console.log(this.requestUpdateEnrollmentNo.UpdatedDate)

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



  // get edit student
  async EditStudentData(content: any, StudentID: number, StudentExamID: number, SemesterID: number, StudentTypeID: number) {
    //debugger
    let needCheckOptionalSubjectAdded = false;
    // check optional subject already added or not for condition base
    if ((this.sSOLoginDataModel.RoleID == EnumRole.Principal)
      && [4, 5, 6].includes(SemesterID) && StudentTypeID == 1) {
      needCheckOptionalSubjectAdded = true;
    }

    // check
    await this.preExamStudentExaminationService.HaveOptionalSubject(StudentExamID)
      .then(async (data: any) => {
        if (needCheckOptionalSubjectAdded == true && this.toBoolean(data?.Data) != true) {
          this.toastr.warning("Please add optional subject first!");
          return;
        }

        // continue
        this.IsShowViewStudent = true;
        this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        //
        await this.GetPreExam_StudentMaster(StudentID, StudentExamID);
      });
  }


  async SaveData_EditStudentDetails() {

    // not allowed for all filter
    if (this.request.StudentFilterStatusId == 0) {
      this.toastr.warning("Please choose valid 'Status' filter to perform further action!");
      return;
    }

    const sPaperString = this.SelectedSubjectList.map((subject: any) => subject.Code).join(',');

    this.isSubmitted = true;

    //reset    
    if (this.SubCasteCategoryADDLList.length > 0) {
      this.resetValidationSubCastCategoryA(true);
    }
    else {
      this.resetValidationSubCastCategoryA(false);
    }

    //form
    if (this.EditStudentDataFormGroup.invalid) {
      return
    }

    //document required
    if (this.documentDetailsService.HasRequiredDocument(this.requestStudent.DocumentDetails)) {
      return;
    }


    if (this.requestStudent.StudentTypeID == 2) //Document Validatiion
    {
      const isAtLeastOneSelected = this.requestStudent.BackSubjectList.some(subject => subject.Selected);
      //if (!isAtLeastOneSelected) {
      //  this.toastr.error('Please Selected At Least One Subject');
      //  return;
      //}
    }

    if (this.requestStudent.MobileNo.length != 10) {
      this.toastr.error('Please Enter Valid Mobile Number');
      return
    }


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.requestStudent.CreatedBy = this.sSOLoginDataModel.UserID;
    this.requestStudent.RoleID = this.sSOLoginDataModel.RoleID;

    //debugger

    // verified
    if (this.IsVerified) {
      this.requestStudent.status = enumExamStudentStatus.VerifiedForExamination// verified for examination(principle)
    }
    this.requestStudent.IsVerified = this.IsVerified;

    //
    this.loaderService.requestStarted();
    try {

      // this.requestStudent.StudentPaper = sPaperString;

      await this.preExamStudentExaminationService.EditStudentData_PreExam(this.requestStudent)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            await this.GetPreExamStudent();
            await this.ResetControls();
            await this.CloseViewStudentDetails();
            this.requestStudent.DocumentDetails = []
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  // Update Enrollment No
  async EditEnrollmentNo(content: any, StudentID: number, StudentExamID: number) {



    this.IsShowViewStudent = true;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    await this.GetStudentupdateEnrollData(StudentID, StudentExamID);

  }

  async SaveData_PreExam_UpdateEnrollmentNo() {
    this.resetValidationUpdateEnrollment();
    this.isSubmitted = true;

    if (this.formUpdateEnrollmentNo.invalid) {
      return
    }
    //Show Loading
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.requestUpdateEnrollmentNo.CreatedBy = this.sSOLoginDataModel.UserID;
    this.requestUpdateEnrollmentNo.Action = 'Update'
    this.requestUpdateEnrollmentNo.EndTermID = this.sSOLoginDataModel.EndTermID

    this.loaderService.requestStarted();
    try {
      await this.preExamStudentExaminationService.SaveData_PreExam_UpdateEnrollmentNo(this.requestUpdateEnrollmentNo)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message);




            await this.CloseViewStudentDetails();
            this.GetPreExamStudent()


          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async ResetUpdateEnroll() {
    this.requestUpdateEnrollmentNo.OrderDate = ''
    this.requestUpdateEnrollmentNo.OrderNo = ''
    this.requestUpdateEnrollmentNo.UpdatedDate = ''
    this.CloseModal();
  }


  async Revert_PreExam_UpdateEnrollmentNo() {
    this.resetValidationUpdateEnrollment();
    this.isSubmitted = true;

    if (this.formUpdateEnrollmentNo.invalid) {
      return
    }
    //Show Loading
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.requestUpdateEnrollmentNo.CreatedBy = this.sSOLoginDataModel.UserID;
    this.requestUpdateEnrollmentNo.EndTermID = this.sSOLoginDataModel.EndTermID
    this.requestUpdateEnrollmentNo.Action = 'Revert'
    this.loaderService.requestStarted();
    try {
      await this.preExamStudentExaminationService.SaveData_PreExam_UpdateEnrollmentNo(this.requestUpdateEnrollmentNo)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message);


            await this.CloseViewStudentDetails();
            this.GetPreExamStudent()



          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  // ---------- save marked student with exam flow ------
  async SaveDataMarked() {
    //debugger

    // not allowed for all filter
    if (this.request.StudentFilterStatusId == 0) {
      this.toastr.warning("Please choose valid 'Status' filter to perform further action!");
      return;
    }

    // status marked
    if (this.status <= 0) {
      this.toastr.error("Please select 'Mark As' status!");
      return;
    }
    // any student selected
    const anyStudentSelected = this.PreExamStudentData.some(student => student.Selected);
    if (!anyStudentSelected) {
      this.toastr.error("Please select at least one Student!");
      return;
    }
    // Reject at BTER any stage
    if (this.status != enumExamStudentStatus.RejectatBTER && this.status != enumExamStudentStatus.Detained) {
      //verified for examination for each edit student
      if (this.request.StudentFilterStatusId == enumExamStudentStatus.SelectedForExamination && this.status != enumExamStudentStatus.VerifiedForExamination && this.status != enumExamStudentStatus.ExaminationFeesPaid && this.status != enumExamStudentStatus.Dropout && this.status != enumExamStudentStatus.RevokeDropout && this.status != enumExamStudentStatus.Detained) {
        this.toastr.error("Please 'Verify and pay examination fee' then choose 'Eligible For Examination' student!");
        return;
      }
      // Examination Fee Paid

      if (this.request.StudentFilterStatusId == enumExamStudentStatus.EligibleForExamination || this.request.StudentFilterStatusId == enumExamStudentStatus.NewEligibleForExamination) {
        this.toastr.warning("Student already 'Examination Fees Paid' and 'Eligible For Examination'!");
        return;
      }
    }

    // all steps
    try {
      // reject at BTER (at any level)
      if (this.status == enumExamStudentStatus.RejectatBTER) {
        if (this.request.StudentFilterStatusId != enumExamStudentStatus.RejectatBTER && this.request.StudentFilterStatusId != enumExamStudentStatus.Dropout && this.request.StudentFilterStatusId != enumExamStudentStatus.Detained && (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon)) {
          await this.openModal_RejectStudent();
        }
        else {
          this.toastr.error("Please do not choose 'Reject at BTER' Mark As with 'Reject at BTER' status!");
        }
        return;
      }
      //dropout
      if (this.status == enumExamStudentStatus.Dropout) {
        if (this.request.StudentFilterStatusId != enumExamStudentStatus.RejectatBTER && this.request.StudentFilterStatusId != enumExamStudentStatus.Dropout && this.request.StudentFilterStatusId != enumExamStudentStatus.Detained && (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon)) {
          await this.SaveDropout();
        }
        else {
          this.toastr.error("Please do not choose 'Dropout' Mark As with 'Dropout' status!");
        }
        return;
      }
      //revoke dropout
      if (this.status == enumExamStudentStatus.RevokeDropout) {
        if (this.request.StudentFilterStatusId != enumExamStudentStatus.RejectatBTER && (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon)) {
          if (this.request.StudentFilterStatusId != enumExamStudentStatus.Dropout) {
            this.toastr.error("Please choose 'Revoke Dropout' only for 'Dropout' Status")
            return
          } else {
            await this.SaveRevokeDropout();
          }

        }
        else {
          this.toastr.error("Please do not choose 'Revoke Dropout' Mark As with 'Revoke Dropout' status!");
        }
        return;
      }
      //detained
      if (this.status == enumExamStudentStatus.Detained) {
        if (this.request.StudentFilterStatusId != enumExamStudentStatus.RejectatBTER && this.request.StudentFilterStatusId != enumExamStudentStatus.Dropout && this.request.StudentFilterStatusId != enumExamStudentStatus.Detained && (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon)) {
          await this.SaveDetained();
        }
        else {
          this.toastr.error("Please do not choose 'Detained' Mark As with 'Detained' status!");
        }
        return;
      }

      if (this.status == enumExamStudentStatus.DetainedRevoke) {
        if (this.request.StudentFilterStatusId != enumExamStudentStatus.RejectatBTER && (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon)) {
          if (this.request.StudentFilterStatusId != enumExamStudentStatus.Detained) {
            this.toastr.error("Please choose 'Revoke Detain' only for 'Detain' Status")
            return
          } else {
            await this.SaveRevokeDetained();
          }

        }
        else {
          this.toastr.error("Please do not choose 'Revoke Detain' Mark As with 'Revoke Detain' status!");
        }
        return;
      }



      // selected for (admin)
      if (this.request.StudentFilterStatusId == enumExamStudentStatus.Enrolled || this.request.StudentFilterStatusId == enumExamStudentStatus.New_Enrolled) {
        if (this.status == enumExamStudentStatus.SelectedForExamination && (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon)) {
          await this.SaveSelectedForExamination();
        }
        else {
          this.toastr.error("Please choose 'Selected For Examination' Mark As with 'Enrolled or New Enrolled' status!");
        }
        return;
      }
      // eligible for 
      if (this.request.StudentFilterStatusId == enumExamStudentStatus.ExaminationFeesPaid) {
        if (this.status == enumExamStudentStatus.EligibleForExamination && (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon || this.sSOLoginDataModel.RoleID == EnumRole.Registrar || this.sSOLoginDataModel.RoleID == EnumRole.Registrar_NonEng)) {
          await this.SaveEligibleForExamination();
        }
        else {
          this.toastr.error("Please choose 'Eligible For Examination' Mark As with 'Examination Fees Paid' status!");
        }
        return;
      }

      // invalid
      this.toastr.error("Not a valid action!");
    } catch (ex) {
      console.log(ex);
    }
  }

  // Selected For Examination
  async SaveSelectedForExamination() {
    // confirm
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {

      //confirmed
      if (result.isConfirmed) {
        try {
          this.isSubmitted = true;
          this.loaderService.requestStarted();
          // Filter out only the selected students
          var request: StudentMarkedModel[] = [];
          const selectedStudents = this.PreExamStudentData.filter(x => x.Selected);
          selectedStudents.forEach(x => {
            request.push({
              StudentId: x.StudentID,
              Status: this.status,
              StudentFilterStatusId: this.request.StudentFilterStatusId,
              ModifyBy: this.sSOLoginDataModel.UserID,
              RoleId: this.sSOLoginDataModel.RoleID,
              Marked: x.Selected,
              StudentExamID: x.StudentExamID,
              EndTermID: this.sSOLoginDataModel.EndTermID,
              DepartmentID: this.sSOLoginDataModel.DepartmentID,
              Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
              RoleID: this.sSOLoginDataModel.RoleID,
              SemesterID: x.SemesterID
            })
          });
          // Call service to save student exam status
          await this.preExamStudentExaminationService.SaveSelectedForExamination(request)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                await this.GetPreExamStudent();
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
            this.isSubmitted = false;
          }, 200);
        }
      }
    });
  }
  // Eligible For Examination
  async SaveEligibleForExamination() {
    // confirm
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {

      //confirmed
      if (result.isConfirmed) {
        try {
          this.isSubmitted = true;
          this.loaderService.requestStarted();
          // Filter out only the selected students
          var request: StudentMarkedModel[] = [];
          const selectedStudents = this.PreExamStudentData.filter(x => x.Selected);
          selectedStudents.forEach(x => {
            request.push({
              StudentId: x.StudentID,
              Status: this.status,
              StudentFilterStatusId: this.request.StudentFilterStatusId,
              ModifyBy: this.sSOLoginDataModel.UserID,
              RoleId: this.sSOLoginDataModel.RoleID,
              Marked: x.Selected,
              StudentExamID: x.StudentExamID,
              EndTermID: this.sSOLoginDataModel.EndTermID,
              DepartmentID: this.sSOLoginDataModel.DepartmentID,
              Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
              RoleID: this.sSOLoginDataModel.RoleID
            })
          });
          // Call service to save student exam status
          await this.preExamStudentExaminationService.SaveEligibleForExamination(request)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                await this.GetPreExamStudent();
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
                if (data['Data'] == -6) {
                  // MSG_SAVE_SUCCESS_EXCEPT_UNVERIFIED_STUDENTS
                  await this.GetPreExamStudent();
                }
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
            this.isSubmitted = false;
          }, 200);
        }
      }
    });
  }
  // Reject At BTER
  async SaveRejectAtBTER() {

    this.IsFormActionSubmitted = true;
    if (this.formAction.invalid) {
      this.toastr.error("Please fill required fields")
      return
    }

    try {
      this.isSubmitted = true;
      this.loaderService.requestStarted();
      // Filter out only the selected students
      var request: StudentMarkedModel[] = [];
      const selectedStudents = this.PreExamStudentData.filter(x => x.Selected);
      selectedStudents.forEach(x => {
        request.push({
          StudentId: x.StudentID,
          Status: this.status,
          StudentFilterStatusId: this.request.StudentFilterStatusId,
          ModifyBy: this.sSOLoginDataModel.UserID,
          RoleId: this.sSOLoginDataModel.RoleID,
          Marked: x.Selected,
          StudentExamID: x.StudentExamID,
          EndTermID: this.sSOLoginDataModel.EndTermID,
          DepartmentID: this.sSOLoginDataModel.DepartmentID,
          Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
          RoleID: this.sSOLoginDataModel.RoleID,
          Remark: this.requestAction.ActionRemarks,
          RejectDocName: this.requestAction.SuspendDocumnet,
          Dis_RejectDocName: this.requestAction.Dis_SuspendDoc,
          OrderNo: this.requestAction.OrderNo,
          OrderDate: this.requestAction.OrderDate,
        })
      });
      // Call service to save student exam status
      await this.preExamStudentExaminationService.SaveRejectAtBTER(request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.CloseModalPopup();
            await this.GetPreExamStudent();
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isSubmitted = false;
      }, 200);
    }
  }
  // DropOut
  async SaveDropout() {
    // confirm
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {

      //confirmed
      if (result.isConfirmed) {
        try {
          this.isSubmitted = true;
          this.loaderService.requestStarted();
          // Filter out only the selected students
          var request: StudentMarkedModel[] = [];
          const selectedStudents = this.PreExamStudentData.filter(x => x.Selected);
          selectedStudents.forEach(x => {
            request.push({
              StudentId: x.StudentID,
              Status: this.status,
              StudentFilterStatusId: this.request.StudentFilterStatusId,
              ModifyBy: this.sSOLoginDataModel.UserID,
              RoleId: this.sSOLoginDataModel.RoleID,
              Marked: x.Selected,
              StudentExamID: x.StudentExamID,
              EndTermID: this.sSOLoginDataModel.EndTermID,
              DepartmentID: this.sSOLoginDataModel.DepartmentID,
              Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
              RoleID: this.sSOLoginDataModel.RoleID
            })
          });
          // Call service to save student exam status
          await this.preExamStudentExaminationService.SaveDropout(request)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                await this.GetPreExamStudent();
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
            this.isSubmitted = false;
          }, 200);
        }
      }
    });
  }
  //revoke dropout
  async SaveRevokeDropout() {
    // confirm
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {

      //confirmed
      if (result.isConfirmed) {
        try {
          this.isSubmitted = true;
          this.loaderService.requestStarted();
          // Filter out only the selected students
          var request: StudentMarkedModel[] = [];
          const selectedStudents = this.PreExamStudentData.filter(x => x.Selected);
          selectedStudents.forEach(x => {
            request.push({
              StudentId: x.StudentID,
              Status: this.status,
              StudentFilterStatusId: this.request.StudentFilterStatusId,
              ModifyBy: this.sSOLoginDataModel.UserID,
              RoleId: this.sSOLoginDataModel.RoleID,
              Marked: x.Selected,
              StudentExamID: x.StudentExamID,
              EndTermID: this.sSOLoginDataModel.EndTermID,
              DepartmentID: this.sSOLoginDataModel.DepartmentID,
              Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
              RoleID: this.sSOLoginDataModel.RoleID

            })
          });
          // Call service to save student exam status
          await this.preExamStudentExaminationService.SaveRevokeDropout(request)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                await this.GetPreExamStudent();
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
            this.isSubmitted = false;
          }, 200);
        }
      }
    });
  }
  //detain
  async SaveDetained() {
    // confirm
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {

      //confirmed
      if (result.isConfirmed) {
        try {
          this.isSubmitted = true;
          this.loaderService.requestStarted();
          // Filter out only the selected students
          var request: StudentMarkedModel[] = [];
          const selectedStudents = this.PreExamStudentData.filter(x => x.Selected);
          selectedStudents.forEach(x => {
            request.push({
              StudentId: x.StudentID,
              Status: this.status,
              StudentFilterStatusId: this.request.StudentFilterStatusId,
              ModifyBy: this.sSOLoginDataModel.UserID,
              RoleId: this.sSOLoginDataModel.RoleID,
              Marked: x.Selected,
              StudentExamID: x.StudentExamID,
              EndTermID: this.sSOLoginDataModel.EndTermID,
              DepartmentID: this.sSOLoginDataModel.DepartmentID,
              Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
              RoleID: this.sSOLoginDataModel.RoleID
            })
          });
          // Call service to save student exam status
          await this.preExamStudentExaminationService.SaveDetained(request)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                await this.GetPreExamStudent();
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
            this.isSubmitted = false;
          }, 200);
        }
      }
    });
  }



  async SaveRevokeDetained() {
    // confirm
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {

      //confirmed
      if (result.isConfirmed) {
        try {
          this.isSubmitted = true;
          this.loaderService.requestStarted();
          // Filter out only the selected students
          var request: StudentMarkedModel[] = [];
          const selectedStudents = this.PreExamStudentData.filter(x => x.Selected);
          selectedStudents.forEach(x => {
            request.push({
              StudentId: x.StudentID,
              Status: this.status,
              StudentFilterStatusId: this.request.StudentFilterStatusId,
              ModifyBy: this.sSOLoginDataModel.UserID,
              RoleId: this.sSOLoginDataModel.RoleID,
              Marked: x.Selected,
              StudentExamID: x.StudentExamID,
              EndTermID: this.sSOLoginDataModel.EndTermID,
              DepartmentID: this.sSOLoginDataModel.DepartmentID,
              Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
              RoleID: this.sSOLoginDataModel.RoleID
            })
          });
          // Call service to sav  e student exam status
          await this.preExamStudentExaminationService.SaveRevokeDetained(request)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                await this.GetPreExamStudent();
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
            this.isSubmitted = false;
          }, 200);
        }
      }
    });
  }




  // ---------- end save marked student with exam flow ------

  //
  ResetControls() {
    this.commonSubjectDetails = [];
    this.SubjectID = [];
    this.Student_DataList = []
    //this.multiSelect.toggleSelectAll();
  }

  //
  async GetStudentSubject_ByID(StudentID: number) {
    try {
      this.loaderService.requestStarted();

      await this.preExamStudentExaminationService.GetStudentSubject_ByID(StudentID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.requestStudent = data['Data'];

          console.log(this.requestStudent, "Shubh")
          this.requestStudent.StudentID = data['Data']['StudentID'];
          this.requestStudent.EnrollmentNo = data['Data']['EnrollmentNo'];


          this.requestStudent.StudentName = data['Data']['StudentName'];

          this.requestStudent.FatherName = data['Data']['FatherName'];


          this.requestStudent.Gender = data['Data']['Gender'];
          /*     this.requestStudent.DOB = data['Data']['DOB'];*/



          this.requestStudent.Dis_DOB = (new Date(data['Data']['Dis_DOB'])?.toISOString()?.split('T')?.shift()?.toString()) ?? "";


          this.requestStudent.commonSubjectDetails = data['Data']['Subjects'];
          /*        console.log(this.requestStudent.commonSubjectDetails, "commonsubject")*/


          ///*this.requestUpdateEnrollmentNo.OrderNo = data['Data']['OrderNo'];*/
          //const selectedSubjectIDs = this.requestStudent.commonSubjectDetails.map((x: any) => x.SubjectName);
          //console.log(selectedSubjectIDs, "subjectId")
          //// Map the SubjectIDs to the corresponding full object in SubjectMasterDDLList
          //this.SubjectID = this.SubjectMasterDDLList.filter((subject: any) =>
          //  selectedSubjectIDs.includes(subject.SubjectName)
          //);


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

  async SaveAllData() {

    this.isSubmitted = true;
    //
    /*    this.refreshBranchRefValidation(true);*/
    //
    //if (this.PlacementShortListStudentForm.invalid) {CloseViewStudentDetailsEditStudentData
    //  return console.log("error")
    //}



    try {
      this.loaderService.requestStarted();

      const isAnySelected = this.PreExamStudentData.some(x => x.Selected);
      if (!isAnySelected) {
        this.toastr.error('Please select at least one checkbox!');
        return;
      }
      // Validate if at least one subject is selected
      if (!this.SubjectID || this.SubjectID.length === 0) {
        this.toastr.error('Please select at least one subject!');
        this.loaderService.requestEnded();
        return;
      }

      if (this.sSOLoginDataModel.RoleID = EnumRole.Principal) {
        const isStudentType = this.PreExamStudentData.filter(x => x.StudentTypeID = 2)
        if (!isStudentType) {
          this.toastr.error('Please Select Only Ex Students(Type)');
          return;
        }
      }





      this.PreExamStudentData.forEach(x => {
        this.Student_DataList.push({
          StudentSubjectID: 0,
          StudentId: x.StudentID,
          Selected: x.Selected,
          StreamId: x.StreamID,
          SemesterId: x.SemesterID,
          EndTermID: 0,
          FeeAmount: 0,
          status: this.status,
          ActiveStatus: true,
          DeleteStatus: false,
          IsParent: true,
          ModifyBy: 0
        });
      })


      this.commonSubjectDetails = this.commonSubjectDetails || [];

      this.commonSubjectDetails = this.commonSubjectDetails.filter(subjectDetail =>
        this.SubjectID.some(selectedSubject => selectedSubject.ID === subjectDetail.SubjectID)
      );


      this.SubjectID.forEach(subject => {
        if (!this.commonSubjectDetails.some(detail => detail.SubjectID === subject.ID)) {
          this.commonSubjectDetails.push({
            SubjectID: subject.ID,
            CommonSubjectDetailsID: 0,
            CommonSubjectID: 0,
            StreamID: 0
          });
        }

        this.Student_DataList.forEach(x => {
          x.ModifyBy = this.sSOLoginDataModel.UserID;

        });



      });


      const selectedSubjects = this.Student_DataList.filter(student => student.Selected);
      console.log(' student Subjects:', selectedSubjects);
      console.log(' Common Subjects:', this.commonSubjectDetails);
      await this.preExamStudentExaminationService.Save_Student_Subject(this.commonSubjectDetails, selectedSubjects)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {

            this.toastr.success(this.Message)
            await this.GetPreExamStudent();
            await this.ResetControls()

          }
          else {

            this.toastr.error(this.ErrorMessage)

          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to Action Short List!');
        });
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


  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.PreExamStudentData].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.PreExamStudentData] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.PreExamStudentData.length;
  }
  // (replace org. list here)
  get totalInTableSelected(): number {
    return this.PreExamStudentData.filter(x => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.PreExamStudentData.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.PreExamStudentData.filter(x => x.StudentID == item.StudentID && x.SemesterID == item.SemesterID);
    data.forEach(x => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.PreExamStudentData.every(r => r.Selected);
  }
  // end table feature

  async exportToExcel() {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress', 'Selected', 'status', 'StudentID',
      'EndTermID', 'StreamID', 'SemesterID', 'StudentType', 'StudentTypeID', 'StudentExamID'
    ];
    //
    await this.GetPreExamStudentForExcel();
    //
    const filteredData = this.PreExamStudentDataForExcel.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    const columnWidths = Object.keys(filteredData[0] || {}).map(key => ({
      wch: Math.max(
        key.length, // Header length
        ...filteredData.map(item => (item[key] ? item[key].toString().length : 0)) // Max content length
      ) + 2 // Extra padding
    }));

    ws['!cols'] = columnWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'fulldata.xlsx');
  }

  async GetSubCasteCategoryADDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSubCasteCategoryA(this.requestStudent.CategoryA_ID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.SubCasteCategoryADDLList = data['Data'];
          console.log(this.SubCasteCategoryADDLList);
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

  resetValidationSubCastCategoryA(isValidate: boolean) {
    // clear
    this.EditStudentDataFormGroup.get('ddlSubCategoryA_ID')?.clearValidators();
    // set
    if (isValidate) {
      this.EditStudentDataFormGroup.get('ddlSubCategoryA_ID')?.setValidators(Validators.required);
    }
    // update
    this.EditStudentDataFormGroup.get('ddlSubCategoryA_ID')?.updateValueAndValidity();
  }

  async GetStudentEnrolled(item: any) {
    console.log(item, 'qqqqqq')
    try {
      this.ReportBasedModelSearch.StudentID = item.StudentID;
      this.ReportBasedModelSearch.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.ReportBasedModelSearch.StudentExamID = item.StudentExamID;
      this.loaderService.requestStarted();
      await this.reportService.GetExaminationForm(this.ReportBasedModelSearch)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
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

  async GetStudentFeeReceipt(TransactionId: any, StudentExamID: number) {
    try {
      this.loaderService.requestStarted();

      await this.reportService.GetStudentFeeReceipt(TransactionId, StudentExamID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
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

  //2025-01-21 #Pradeep

  // add student optional subject
  async StudentOptionalSubjectModelView(content: any, StudentID: number, StudentExamID: number) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.optSubRequest.StudentID = StudentID;
    await this.GetOptionalSubjectMaster(StudentID, StudentExamID);
  }

  async GetOptionalSubjectMaster(StudentID: number, StudentExamID: number) {
    try {
      await this.commonMasterService.GetOptionalSubjectsByStudentID(StudentID, this.sSOLoginDataModel.DepartmentID, StudentExamID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.optionalSubjectList = data['Data']["Table"];// exam id
          this.optionalChildSubjectList = data['Data']["Table1"];
          this.optionalSubjectList.forEach((x: any) => {
            if (x.SubjectID == 0) {
              let i = 0;
              this.optionalChildSubjectList.forEach((c: any) => {
                if (x.ParentSubjectID == c.ParentSubjectID && i == 0) {
                  x.SubjectID = c.SubjectID;
                  i++;
                }
              });
            }
          });
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  async UpdateSubjectValue(ParentSubjectID: number, SubjectID: any) {
    this.optionalSubjectList.forEach((x: any) => {
      if (x.ParentSubjectID == ParentSubjectID) {
        x.SubjectID = SubjectID;
      }
    });

  }

  async SaveOptionalSubjectData() {

    if (this.optionalSubjectList.filter((x: any) => x.SubjectID == 0)?.length > 0) {
      this.toastr.error("Please choose all optional subject");
      return;
    }
    this.isSubmitted = true;
    this.optSubRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.optSubRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.optSubRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.optSubRequest.CreatedBy = this.sSOLoginDataModel.UserID
    this.optSubRequest.RowJson = JSON.stringify(this.optionalSubjectList);
    try {
      await this.preExamStudentExaminationService.Save_Student_Optional_Subject(this.optSubRequest)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message);
            this.CloseModal()
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to save optional subject!');
        });
    }
    catch (ex) {
      console.log(ex);
    }
  }
  checkStatusForOptional(status: number) {
    if (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.Registrar) {
      return ([
        enumExamStudentStatus.SelectedForExamination,
        enumExamStudentStatus.VerifiedForExamination,
        enumExamStudentStatus.ExaminationFeesPaid
      ]).includes(status);
    }
    return false;
  }
  CloseModal() {
    this.isSubmitted = false
    this.modalService.dismissAll();
    this.optionalSubjectList = [];
    this.optionalChildSubjectList = [];
  }

  // end add student optional subject

  //document
  async UploadDocument(event: any, item: any) {
    try {
      //upload model
      // let uploadModel = new UploadFileModel();
      // uploadModel.FileExtention = item.FileExtention ?? "";
      // uploadModel.MinFileSize = item.MinFileSize ?? "";
      // uploadModel.MaxFileSize = item.MaxFileSize ?? "";
      // uploadModel.FolderName = item.FolderName ?? "";

      let uploadModel: UploadBTERFileModel = {
        ApplicationID: this.requestStudent.StudentID?.toString() ?? "0",
        AcademicYear: item.AcademicYear?.toString() ?? "0",
        DepartmentID: '1',
        EndTermID: item.EndTermID?.toString() ?? "0",
        Eng_NonEng: item.CourseType?.toString() ?? "0",
        FileName: item.ColumnName ?? "",
        FileExtention: item.FileExtention ?? "",
        MinFileSize: item.MinFileSize ?? "",
        MaxFileSize: item.MaxFileSize ?? "",
        FolderName: item.FolderName ?? "",
        FilePrefix: this.requestStudent.FinancialYearName + "/" + this.requestStudent.CourseTypeID + "/" + this.requestStudent.StudentID,
        //IsCopy: true 
        FileNameWithDynamicPath: EnumFileUpload.FileNameWithDynamicPath,
      }
      //call
      await this.documentDetailsService.UploadBTERDocument(event, uploadModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (this.State == EnumStatus.Success) {
            //add/update document in js list
            const index = this.requestStudent.DocumentDetails.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.requestStudent.DocumentDetails[index].FileName = data.Data[0].FileName;
              this.requestStudent.DocumentDetails[index].Dis_FileName = data.Data[0].Dis_FileName;
            }
            console.log(this.requestStudent.DocumentDetails)
            //reset file type
            event.target.value = null;
          }
          if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  async DeleteDocument(item: any) {
    try {
      // delete from server folder
      let deleteModel = new DeleteDocumentDetailsModel()
      deleteModel.FolderName = item.FolderName ?? "";
      deleteModel.FileName = item.FileName;
      //call
      await this.documentDetailsService.DeleteDocument(deleteModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State != EnumStatus.Error) {
            //add/update document in js list
            const index = this.requestStudent.DocumentDetails.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.requestStudent.DocumentDetails[index].FileName = '';
              this.requestStudent.DocumentDetails[index].Dis_FileName = '';
            }
            console.log(this.requestStudent.DocumentDetails)
          }
          if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  //end document
  async GetDateConfig() {

    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: "Examination",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'][0];
        this.MapKeyEng = this.DateConfigSetting.Examination;
      }, (error: any) => console.error(error)
      );
  }



  async DownloadAdmitCard(row: any) {
    try {
      this.loaderService.requestStarted();
      this.AdmitcardModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.AdmitcardModel.StudentID = row.StudentID;
      this.AdmitcardModel.StudentExamID = row.StudentExamID;
      this.AdmitcardModel.EnrollmentNo = row.EnrollmentNo;
      await this.reportService.GetStudentAdmitCard(this.AdmitcardModel)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
            //await this.();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to Action Short List!');
        });
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

  async GetSubjectCodeMasterDDL() {
    try {

      this.subjectCodeDDLRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.subjectCodeDDLRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.subjectCodeDDLRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.subjectCodeDDLRequest.SemesterID = this.requestStudent.SemesterID
      this.subjectCodeDDLRequest.StreamID = this.requestStudent.StreamID;
      console.log(this.subjectCodeDDLRequest, "this.subjectCodeDDLRequest")
      await this.commonMasterService.GetSubjectTheoryParctical(this.subjectCodeDDLRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectCodeMasterDDLList = data['Data'];

        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }




  async GetBackSubjectList() {
    try {



      this.subjectCodeDDLRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.subjectCodeDDLRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.subjectCodeDDLRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.subjectCodeDDLRequest.SemesterID = this.requestStudent.SemesterID
      this.subjectCodeDDLRequest.StreamID = this.requestStudent.StreamID;

      this.subjectCodeDDLRequest.StudentExamID = this.requestStudent.StudentExamID;

      console.log(this.subjectCodeDDLRequest, "this.subjectCodeDDLRequest")
      await this.commonMasterService.GetBackSubjectList(this.subjectCodeDDLRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.requestStudent.BackSubjectList = data['Data'];

          console.log("Ravi Test data " + this.requestStudent.BackSubjectList);


        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }




  async exportRejectAtBTERToExcel() {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress', 'Selected', 'status', 'StudentID',
      'EndTermID', 'StreamID', 'SemesterID', 'StudentType', 'StudentTypeID', 'StudentExamID'
    ];
    await this.GetRejectBTERExcelData();//get data
    const filteredData = this.RejectAtBTERList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    const columnWidths = Object.keys(filteredData[0] || {}).map(key => ({
      wch: Math.max(
        key.length, // Header length
        ...filteredData.map(item => (item[key] ? item[key].toString().length : 0)) // Max content length
      ) + 2 // Extra padding
    }));

    ws['!cols'] = columnWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'rejecteddata.xlsx');
  }

  async GetRejectBTERExcelData() {
    try {
      this.isSubmitted = true;
      //session
      this.RejectAtBTERList = []
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      //call
      await this.preExamStudentExaminationService.GetRejectBTERExcelData(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //
          if (data.State == EnumStatus.Success) {
            this.RejectAtBTERList = data['Data'];
            console.log(this.RejectAtBTERList, "daataa")
          }
          else {
            this.toastr.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async exportAnnexureMainToExcel() {
    debugger
    try {
      this.isSubmitted = true;
      //session
      this.AnnexureDataModel.EndTermID = this.sSOLoginDataModel.EndTermID
      this.AnnexureDataModel.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.AnnexureDataModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.AnnexureDataModel.StudentExamType = EnumStudentExamType.Main;
      this.AnnexureDataModel.InstitueID = this.sSOLoginDataModel.InstituteID;

      //call
      await this.preExamStudentExaminationService.GetMainAnnexure(this.AnnexureDataModel)
        .then((response: any) => {
          // Create a blob from the response
          const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

          // Create an anchor element and trigger the download
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'mainanex2.xlsx'; // This is the filename to save
          link.click();
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  onItemSelect(item: any, centerID: number) {

    //if (!this.SelectedBranchMasterList.includes(item))
    //{
    //  this.SelectedBranchMasterList.push(item);
    //}

  }

  onDeSelect(item: any, centerID: number) {

    /*this.SelectedBranchMasterList = this.SelectedBranchMasterList.filter((i: any) => i.StreamID !== item.StreamID);*/

  }

  onSelectAll(items: any[], centerID: number) {

    // this.SelectedInstituteList = [...items];

  }

  onDeSelectAll(centerID: number) {

    //this.SelectedInstituteList = [];

  }

  onFilterChange(event: any) {
    // Handle filtering logic (if needed)
    console.log(event);
  }

  onDropDownClose(event: any) {
    // Handle dropdown close event
    console.log(event);
  }


  async exportAnnexureSpecialToExcel() {
    try {
      this.isSubmitted = true;
      //session
      this.AnnexureDataModel.EndTermID = this.sSOLoginDataModel.EndTermID
      this.AnnexureDataModel.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.AnnexureDataModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.AnnexureDataModel.StudentExamType = EnumStudentExamType.Special;
      //call
      await this.preExamStudentExaminationService.GetSpecialAnnexure(this.AnnexureDataModel)
        .then((response: any) => {
          // Create a blob from the response
          const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

          // Create an anchor element and trigger the download
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'specialanex2.xlsx'; // This is the filename to save
          link.click();
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  // multiselect events
  public onFilterChangesSubject(item: any) {
    console.log(item);
  }
  public onDropDownClosesSubject(item: any) {
    console.log(item);
  }

  public onItemSelectsSubject(item: any) {

    if (!this.SelectedSubjectList.includes(item)) {
      this.SelectedSubjectList.push(item);
    }

    //console.log(item);
  }
  public onDeSelectsSubject(item: any) {
    console.log(item);
  }

  public onSelectAllsSubject(items: any) {
    console.log(items);
  }
  public onDeSelectAllsSubject(items: any) {
    console.log(items);
  }


  onCheckboxChange(event: any, item: any) {

    if (item.is_th == true || item.is_pr == true || item.is_ia == true) {
      item.Selected = true;
    }
    else {
      item.Selected = false;
    }

    console.log('Checkbox value:', event.target.checked);
    // Perform your logic here
  }

  onSelectedChange(event: any, item: any) {

    if (event.target.checked == false) {
      item.is_th = false;
      item.is_pr = false;
      item.is_ia = false;
    }
    else {
      if (item.IsPracticalSubject) {
        item.is_th = false;
        item.is_pr = true;
        item.is_ia = false;
      }
      else if (item.IsTheorySubject) {
        item.is_th = true;
        item.is_pr = false;
        item.is_ia = false;
      }
    }
    console.log('Checkbox value:', event.target.checked);
    // Perform your logic here
  }



  // add student optional subject
  async BackSubjectModel(content: any, StudentExamID: number) {
    //this.modalRef = content;
    //this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
    //  this.closeResult = `Closed with: ${result}`;
    //}, (reason: any) => {
    //  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //});


    this.modalRef = this.modalService.open(content, {
      size: 'sm',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  CloseModalBackSubjectList() {

    if (this.modalRef) {
      this.modalRef.close('Modal Closed');  // Close the modal
    }

  }

  ValidateBackSubject() {

    const isAtLeastOneSelected = this.requestStudent.BackSubjectList.some(subject => subject.Selected);
    if (!isAtLeastOneSelected) {
      this.toastr.error('Please Selected At Least One Subject');
      return;
    }
    else {
      let selectedCodes = this.requestStudent.BackSubjectList
        .filter((subject: any) => subject.Selected)
        .map((subject: any) => subject.SubjectCode + ((subject.is_th == true ? 'T' : '') + (subject.is_pr == true ? 'P' : '') + (subject.is_ia == true ? 'A' : '')))
        .join(', ');
      this.requestStudent.StudentPaper = selectedCodes;
      this.CloseModalBackSubjectList();
    }
  }

  async GetPreExamStudentForExcel() {
    debugger
    try {
      //session
      this.PreExamStudentDataForExcel = []
      let request = new PreExamStudentDataModel();
      request.EndTermID = this.sSOLoginDataModel.EndTermID
      request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      //call
      await this.preExamStudentExaminationService.GetPreExamStudent(request)
        .then(async (data: any) => {
          //
          if (data.State == EnumStatus.Success) {
            this.PreExamStudentDataForExcel = data.Data
          }
          else {
            this.toastr.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  // temp. show for old data
  //all paths
  private yealryEng = "https://dteapp.rajasthan.gov.in/bter_engexam/files/documents/";
  private yealryNonEng = "https://dteapp.hte.rajasthan.gov.in/bter_exam/files/documents/";
  private semEng = "https://dteapp.hte.rajasthan.gov.in/bter_eng_sem_exam/files/documents/";
  private semNonEng = "https://dteapp.hte.rajasthan.gov.in/bter_sem_exam/files/documents/";
  setStudentFilesForOldBter() {
    //
    //console.log(this.IsYearly,"IsYearly")
    //console.log(this.requestStudent.DocumentDetails,"documents")
    // set in doc.
    this.requestStudent.DocumentDetails.forEach(x => {
      // yearly
      if (this.IsYearly == true) {
        // eng
        if (this.sSOLoginDataModel.Eng_NonEng == 1) {
          x.OldFilePath = `${this.yealryEng}/${x.TransactionID}/${x.FileName}`;
        }
        // non eng
        else if (this.sSOLoginDataModel.Eng_NonEng == 2) {
          x.OldFilePath = `${this.yealryNonEng}/${x.TransactionID}/${x.FileName}`;
        }
      }
      // sem.
      else if (this.IsYearly == false) {
        // eng
        if (this.sSOLoginDataModel.Eng_NonEng == 1) {
          x.OldFilePath = `${this.semEng}/${x.TransactionID}/${x.FileName}`;
        }
        // non eng
        else if (this.sSOLoginDataModel.Eng_NonEng == 2) {
          x.OldFilePath = `${this.semNonEng}/${x.TransactionID}/${x.FileName}`;
        }
      }
      //
    });
  }

  setStudentFilesForOldBterview() {
    //
    //console.log(this.IsYearly,"IsYearly")
    //console.log(this.requestStudent.DocumentDetails,"documents")
    // set in doc.

    this.documentDetails.forEach(x => {
      // yearly
      if (this.IsYearly == true) {
        // eng
        if (this.sSOLoginDataModel.Eng_NonEng == 1) {
          x.OldFilePath = `${this.yealryEng}/${x.TransactionID}/${x.FileName}`;
        }
        // non eng
        else if (this.sSOLoginDataModel.Eng_NonEng == 2) {
          x.OldFilePath = `${this.yealryNonEng}/${x.TransactionID}/${x.FileName}`;
        }
      }
      // sem.
      else if (this.IsYearly == false) {
        // eng
        if (this.sSOLoginDataModel.Eng_NonEng == 1) {
          x.OldFilePath = `${this.semEng}/${x.TransactionID}/${x.FileName}`;
        }
        // non eng
        else if (this.sSOLoginDataModel.Eng_NonEng == 2) {
          x.OldFilePath = `${this.semNonEng}/${x.TransactionID}/${x.FileName}`;
        }
      }
      //
    });
  }

  // convert to bool
  toBoolean(value: any): boolean {
    return !!value;  // double NOT operator converts any value to true/false
  }

  resetValidationUpdateEnrollment() {
    // clear
    this.formUpdateEnrollmentNo.get('ddlBranch')?.clearValidators();
    // set
    if (this.requestUpdateEnrollmentNo.SemesterID <= 3) {
      this.formUpdateEnrollmentNo.get('ddlBranch')?.setValidators([DropdownValidators]);
    }
    // update
    this.formUpdateEnrollmentNo.get('ddlBranch')?.updateValueAndValidity();
  }

  async RejectAtBter_Remark() {
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {

      //confirmed
      if (result.isConfirmed) {
        await this.openModal_RejectStudent();
      }
    });
  }

  async openModal_RejectStudent() {
    try {
      await this.GetDocumentDetails_RejectAtBter()
      this.IsRejectAtBter = true;

      const today: Date = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');  // Adding leading zero
      const day = today.getDate().toString().padStart(2, '0');  // Adding leading zero
      const formattedDate = `${year}-${month}-${day}`;

      this.requestAction.OrderDate = formattedDate

      // Open the modal template
      const modalOptions: NgbModalOptions = {
        size: 'md'  // Set the size of the modal to 'md' (medium)
      };
      const modalRef = this.modalService.open(this.myModalTemplate, modalOptions);
      modalRef.result.then(
        (result) => {
          console.log('Modal closed with result:', result);
        },
        (reason) => {
          console.log('Modal dismissed with reason:', reason);
        }
      );
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  }

  CloseModalPopup() {
    this.requestAction = new CampusPostMaster_Action();
    this.IsFormActionSubmitted = false;
    this.modalService.dismissAll();
  }

  async OnClickRejectStudent() {
    await this.SaveRejectAtBTER();
  }

  async GetDocumentDetails_RejectAtBter() {
    try {
      var request: any = {}
      request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      request.FileNameWithDynamicPath = 1
      await this.commonMasterService.GetDocumentDetails_RejectAtBter(request).then(async (data: any) => {
        if (data.State === EnumStatus.Success) {
          this.RejectDocumentDetail = data.Data
          this.requestRejectDoc = this.RejectDocumentDetail[0]
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message)
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async UploadDocument_RejectAtBter(event: any, name: any) {
    try {
      //upload model
      // let uploadModel = new UploadFileModel();
      // uploadModel.FileExtention = item.FileExtention ?? "";
      // uploadModel.MinFileSize = item.MinFileSize ?? "";
      // uploadModel.MaxFileSize = item.MaxFileSize ?? "";
      // uploadModel.FolderName = item.FolderName ?? "";
      //debugger
      let uploadModel: UploadBTERFileModel = {
        AcademicYear: this.requestRejectDoc.AcademicYear?.toString() ?? "0",
        DepartmentID: '1',
        EndTermID: this.requestRejectDoc.EndTermID?.toString() ?? "0",
        Eng_NonEng: this.requestRejectDoc.CourseType?.toString() ?? "0",
        FileName: this.requestRejectDoc.ColumnName ?? "",
        FileExtention: this.requestRejectDoc.FileExtention ?? "",
        MinFileSize: this.requestRejectDoc.MinFileSize ?? "",
        MaxFileSize: this.requestRejectDoc.MaxFileSize ?? "",
        FolderName: this.requestRejectDoc.FolderName ?? "",
        FilePrefix: this.requestRejectDoc.AcademicYearName + "/" + this.sSOLoginDataModel.Eng_NonEng + "/" + GlobalConstants.RejectAtBter,
        //IsCopy: true 
        FileNameWithDynamicPath: EnumFileUpload.FileNameWithDynamicPath,
        IsRejectAtBter: true,
      }

      //call
      await this.documentDetailsService.UploadBTERDocument(event, uploadModel)
        .then((data: any) => {
          //debugger
          //
          if (data.State == EnumStatus.Success) {
            //add/update document in js list
            // const index = this.requestStudent.DocumentDetails.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            // if (index !== -1) {
            //   this.requestStudent.DocumentDetails[index].FileName = data.Data[0].FileName;
            //   this.requestStudent.DocumentDetails[index].Dis_FileName = data.Data[0].Dis_FileName;
            // }
            if (name == "rejectPhoto") {
              this.requestAction.SuspendDocumnet = data.Data[0]['FileName']
              this.requestAction.Dis_SuspendDoc = data.Data[0]['Dis_FileName']
            }

            console.log(this.requestStudent.DocumentDetails)
            //reset file type
            event.target.value = null;
          }
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.ErrorMessage)
          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(data.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async OpenRejectViewModal(content: any, StudentID: number, StudentExamID: number) {
    await this.GetRejectAtBter_StudentDetails(StudentID, StudentExamID);
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async GetRejectAtBter_StudentDetails(StudentID: number, StudentExamID: number) {
    const request: any = {}
    request.StudentID = StudentID
    request.StudentExamID = StudentExamID
    try {
      await this.preExamStudentExaminationService.GetRejectAtBter_StudentDetails(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.rejectAtBter_StudentDetails = data.Data[0]
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }


  async NorifyStudent_VerifyForExamination() {
    let Requestdata: any = this.PreExamStudentData.filter((e: any) => e.Selected == true)

    if (Requestdata.length > 0) {
      this.Swal2.Confirmation("Are you sure to Notify Students?", async (result: any) => {

        //confirmed
        if (result.isConfirmed) {
          const SMSrequest: ForSMSNotifyStudentModel[] = Requestdata.map((student: any) => ({
            StudentId: student.StudentID,
            MobileNo: student.MobileNo,
            StudentName: student.StudentName,
            MessageType: "Exam_Fee_Reminder"
          }));

          this.smsMailService.NorifyStudent_VerifyForExamination(SMSrequest)
            .then(async (data: any) => {
              if (data.State == EnumStatus.Success) {
                this.toastr.success("Notified successfully");
              } else if (data.State == EnumStatus.Warning) {
                this.toastr.warning("Something went wrong");
              } else {
                console.log(data.ErrorMessage);
              }
            });
        }
      });
    } else {
      this.toastr.error('Please select at least one student to notify')
      return
    }
  }

  async GetOptionalSubjectDDL() {
    try {
      this.optionalSubRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.optionalSubRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.optionalSubRequest.CourseType = this.sSOLoginDataModel.Eng_NonEng
      this.optionalSubRequest.SemesterId = this.request.Year_SemID
      this.optionalSubRequest.StreamId = this.request.BranchID

      await this.commonMasterService.GetOptionalSubjectDDL(this.optionalSubRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.OptionalSubjectDDLList = data.Data
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  // update optional subject after eligible
  async UpdateOptionalAfterEligibleValue(ParentSubjectID: number, SubjectID: any) {
    this.updateOptionalAfterEligibleList.forEach((x: any) => {
      if (x.ParentSubjectID == ParentSubjectID) {
        x.SubjectID = SubjectID;
      }
    });

  }

  // update 
  async UpdateOptionalAfterEligibleData() {
    //debugger
    try {
      if (this.updateOptionalAfterEligibleList.filter((x: any) => x.SubjectID == 0)?.length > 0) {
        this.toastr.error("Please choose all optional subject!");
        return;
      }
      this.isSubmitted = true;
      this.optSubRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.optSubRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.optSubRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.optSubRequest.CreatedBy = this.sSOLoginDataModel.UserID
      this.optSubRequest.RowJson = JSON.stringify(this.updateOptionalAfterEligibleList);
      this.optSubRequest.RowJson_AlreadyAssigned = JSON.stringify(this.alreadyAssignedOptionalSubject);
      // call
      await this.preExamStudentExaminationService.UpdateOptionalSubjectAfterEligibleStudent(this.optSubRequest)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message);
            this.CloseUpdateOptionalAfterEligibleModal()
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message)
          }
          else {
            this.toastr.error(this.Message)
            console.error(this.ErrorMessage);
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to Update optional subject!');
        });
    }
    catch (ex) {
      console.log(ex);
    }
  }

  CloseUpdateOptionalAfterEligibleModal() {
    this.isSubmitted = false
    this.modalService.dismissAll();
    this.updateOptionalAfterEligibleList = [];
    this.updateOptionalChildAfterEligibleList = [];
    this.alreadyAssignedOptionalSubject = [];
  }

  IsShowOptionalSubject(row: any) {
    if ((
      this.sSOLoginDataModel.RoleID == EnumRole.Admin
      || this.sSOLoginDataModel.RoleID == EnumRole.Registrar
    ) && ([
      (enumExamStudentStatus.EligibleForExamination || enumExamStudentStatus.NewEligibleForExamination)
    ]).includes(row.status)
      && row.StudentTypeID == this._enumStudentType.Reg
      && [4, 5, 6].includes(row.SemesterID)
      && this.sSOLoginDataModel.Eng_NonEng == this._EnumCourseType.Engineering
    ) {
      return true;
    }
    return false;
  }

  async UpdateOptionalAfterEligibleModelView(content: any, StudentId: number, StudentExamID: number) {
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.optSubRequest.StudentExamID = StudentExamID;
    await this.GetUpdateOptionalAfterEligibleMaster(StudentId, StudentExamID); // optional subject master
    await this.GetAlreadyAssignedOptionalSubject(StudentExamID); // already assigned optional subject
  }

  // get optional subject
  async GetUpdateOptionalAfterEligibleMaster(StudentId: number, StudentExamID: number) {
    try {
      await this.commonMasterService.GetOptionalSubjectsByStudentID(StudentId, this.sSOLoginDataModel.DepartmentID, StudentExamID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.updateOptionalAfterEligibleList = data['Data']["Table"];// exam id
          this.updateOptionalChildAfterEligibleList = data['Data']["Table1"];
          this.updateOptionalAfterEligibleList.forEach((x: any) => {
            if (x.SubjectID == 0) {
              let i = 0;
              this.updateOptionalChildAfterEligibleList.forEach((c: any) => {
                if (x.ParentSubjectID == c.ParentSubjectID && i == 0) {
                  x.SubjectID = c.SubjectID;
                  i++;
                }
              });
            }
          });
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  // get already assigned optional subject 
  async GetAlreadyAssignedOptionalSubject(StudentExamID: number) {
    try {
      await this.commonMasterService.GetAlreadyAssignedOptionalSubject(StudentExamID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.alreadyAssignedOptionalSubject = data['Data'];
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
}
