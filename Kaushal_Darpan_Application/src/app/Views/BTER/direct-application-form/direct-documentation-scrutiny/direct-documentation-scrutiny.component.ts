import { Component, EventEmitter, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { DocumentDetailList, DocumentDetailsDataModel } from '../../../../Models/ITIFormDataModel';
import { EnumCasteCategory, EnumCourseType, EnumDepartment, EnumLateralCourse, EnumStatus, EnumVerificationAction, GlobalConstants, EnumCourseType1, EnumRole, EnumDegreeCourse } from '../../../../Common/GlobalConstants';
//import { EnumCourseType, EnumDepartment, EnumLateralCourse, EnumStatus, EnumVerificationAction, GlobalConstants, EnumCourseType1 } from '../../../../Common/GlobalConstants';
import { ItiApplicationSearchmodel } from '../../../../Models/ItiApplicationPreviewDataModel';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ItiApplicationFormService } from '../../../../Services/ItiApplicationForm/iti-application-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BterOtherDetailsModel, BterSearchmodel, EnglishQualificationDataModel, HighestQualificationModel, LateralEntryQualificationModel, Lateralsubject, QualificationDataModel, SupplementaryDataModel } from '../../../../Models/ApplicationFormDataModel';
import { DocumentScrutinyDataModel, DTEDocumentModel, RejectModel } from '../../../../Models/DocumentScrutinyDataModel';
import { BterApplicationForm } from '../../../../Services/BterApplicationForm/bterApplication.service';

import { StudentVerificationListService } from '../../../../Services/StudentVerificationList/student-verification-list.service';
import { VerificationDocumentDetailList } from '../../../../Models/StudentVerificationDataModel';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { TSPTehsilDataModel } from '../../../../Models/CommonMasterDataModel';
import { TspAreasService } from '../../../../Services/Tsp-Areas/Tsp-Areas.service';
import { StudentStatusHistoryComponent } from '../../../Student/student-status-history/student-status-history.component';
import { DropdownValidators, DropdownValidators1, DropdownValidatorsString, DropdownValidatorsString1 } from '../../../../Services/CustomValidators/custom-validators.service';
import { StudentJanAadharDetailModel } from '../../../../Models/StudentJanAadharDetailModel';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { BTERSearchModel } from '../../../../Models/BTER/BTERAllotmentDataModel';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-direct-documentation-scrutiny',
  templateUrl: './direct-documentation-scrutiny.component.html',
  styleUrls: ['./direct-documentation-scrutiny.component.css'],
  standalone: false
})
export class DirectDocumentationScrutinyComponent {
  public EnglishQualificationForm!: FormGroup

  public isCheckerLoggedIn: boolean = false;
  public SSOLoginDataModel = new SSOLoginDataModel()
  public DocumentDetailsFormGroup!: FormGroup;
  public StudentJanDetailFormGroup!: FormGroup;
  public formData = new DocumentDetailsDataModel()
  public formData1 = new HighestQualificationModel()
  public _GlobalConstants: any = GlobalConstants;
  public request = new DocumentScrutinyDataModel()
  public documents = new DTEDocumentModel();
  public searchRequest = new BterSearchmodel()
  public formqual = new HighestQualificationModel()
  public engRequest = new EnglishQualificationDataModel()
  public key:number=0
  public SchemelIst: any = []
  public ParentIncome: any = []
  public isAffadavit: boolean = false
  public BackupCatoryA:number=0
  public BranchName: any = []
  public ResidenceList: any = []
  isError: boolean = false;
  public isSubmitted: boolean = false
  public IsShowDrop: boolean = false
  public OtherData = new BterOtherDetailsModel()
  public isSu: boolean = false
  public QualificationDataList: any = []
  public QualificationPassingYearList: any = []
  public RemarkDocument: any = []
  public SupplyPassingYearList: any = []
  public LateralBoardList: any = [];
  public box10thChecked: boolean = false
  public box8thChecked: boolean = false
  public isSub: boolean = false;
  public isSupp: boolean = false
  imageSrc: string | null = null;
  public IsShowDropdown: boolean = false
  public maxDate: string = '';
  public ApplicationID: number = 0;
  public PersonalDetailForm!: FormGroup
  public QualificationForm!: FormGroup
  public BoardList10: any = [];
  public BoardList12: any = [];
  public BoardStateList10: any = [];
  public BoardStateList12: any = [];
  public BoardExamList10: any = [];
  public BoardExamList12: any = [];
  public HighQualificationList: any = [];
  public ShowOtherBoard10th: boolean = false;
  public ShowOtherBoard12th: boolean = false;
  public SupplementaryForm!: FormGroup
  public HighestQualificationForm !: FormGroup
  public RadioForm!: FormGroup
  public errorMessage = '';
  public stateMasterDDL: any = []
  public PassingYearList: any = []
  public maritialList: any = []
  public CategoryBlist: any = []
  public CategoryAlist: any = []
  public isSupplement: boolean = false
  public NationalityList: any = []
  public ReligionList: any = []
  public category_CList: any = []
  public category_PreList: any = []
  public GenderList: any = []
  public marktypelist: any = []
  public BoardList: any = []
  public addrequest = new SupplementaryDataModel()
  calculatedPercentage: number = 0;
  public DocumentStatusList: any = []
  public Isremarkshow: boolean = false
  public changeshow: boolean = false
  public State: number = 0;
  public Message: string = '';
  public DisFile: string = ''
  public FileName: string = ''
  public FilePath: string = ''

  public DeficiencyDocList: any = []

  public ErrorMessage: string = '';
  nonEngHighQuali: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();
  closeResult: string | undefined;
  public reject = new RejectModel()
  public Lateralcourselist: any = []
  public _EnumCourseType = EnumCourseType
  public _EnumActionStatus = EnumVerificationAction
  public LateralQualificationForm !: FormGroup
  public action: string = ''
  public SubjectMasterDDLList: any = []
  public CategoryDlist: any = []
  public SubjectID: Lateralsubject[] = []
  public lateralrequest = new LateralEntryQualificationModel()
  public errormessage: string = ''
  public settingsMultiselect: object = {};
  public settingsMultiselect1: object = {};
  public filteredDocumentDetails: VerificationDocumentDetailList[] = []
  public TspDistrictList: any = []
  public filteredTehsilList: any = []
  public TspTehsilRequest = new TSPTehsilDataModel()
  public TspTehsilList: any = []
  public DevnarayanAreaList: any = []
  public DevnarayanTehsilList: any = []
  public IdentityProofList: any = []
  public PrefentialCategoryList: any = []
  public Degreecourselist: any = []
  public CategoryAlist1: any = []
  public _EnumRole = EnumRole
  public selectedRemarks: any[] = [];
  public customRemark: string = '';

  @ViewChild(StudentStatusHistoryComponent) childComponent!: StudentStatusHistoryComponent;

  public model = new StudentJanAadharDetailModel()

  public Science_Vocational: boolean = false
  public senior_secondary: boolean = false
  public ItiMarksheet: boolean = false
  public NativeCertificate: boolean = false
  public Marksheet12: boolean = false
  public Graduation: boolean = false
  public PostGraduation: boolean = false
  public Diploma_Engineering: boolean = false
  public voc: boolean = false;
  public Is12Supp: boolean = false;
  public Is10Supp: boolean = false;
  public ParentsIncome: number = 0;
  public ApplyScheme: number = 0;
  public Quali = new QualificationDataModel();
  public statusid:number=0
  pdfUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  showPdfModal: boolean = false;
  isPdf: boolean = false;
  isImage: boolean = false;
  isOtherDocument: boolean = false
  public GetRoleID: number = 0
  public hideHighestQualification: boolean = false
  public isParentIncomeDisabled: any;
  public isTWSDisabled: any;
  public isTWSparentincomDisabled: any;
  public islitralsub: any;

  public CoreBranchList: any = []
  public BranchList: any = []
  

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    public appsettingConfig: AppsettingService,
    private ItiApplicationFormService: ItiApplicationFormService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ApplicationService: StudentVerificationListService,
    private ApplicationService1: BterApplicationForm,
    private modalService: NgbModal,
    private swat: SweetAlert2,
    private tspAreaService: TspAreasService,
    private encryptionService: EncryptionService,

    private sanitizer: DomSanitizer,
    private http: HttpClient,
  ) { }

  async ngOnInit() {
    // form group


    this.settingsMultiselect = {
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


    this.settingsMultiselect1 = {
      singleSelection: false,
      idField: 'DocumentMasterID',
      textField: 'DisFileName',
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


    this.StudentJanDetailFormGroup = this.formBuilder.group(
      {
        ddlPreferentialCategory: [{ value: '' }, [DropdownValidators]],
        ddlPreferentialType: [{ value: '', disabled: true } , [DropdownValidators]],
        txtJanAadhaar: [''],
        txtName: ['', Validators.required],
        txtnameHindi: [{ value: '' }, Validators.required],
        txtFather: ['', Validators.required],
        txtMotherEngname: ['', Validators.required],
        txtDOB: ['', [Validators.required, this.minimumAgeValidator(10)]],
        email: ['', [Validators.pattern(GlobalConstants.EmailPattern)]],
        /*  txtMobileNumber: ['', Validators.required],*/
        ddlIdentityProof: [{ value: 0, disabled: true } , [DropdownValidators1]],
        txtFatherHindi: [{ value: '' }, Validators.required],
        txtMotherHindiname: [{ value: '' }, Validators.required],
        ddlCategoryA: [{ value: '', disabled: true } , [DropdownValidators1]],
        CategoryAbyChecker: [{ value: ''} , [DropdownValidators1]],
        Gender: [{ value: 0, disabled: true }, [DropdownValidatorsString]],
        CertificateNo: ['', Validators.required],
        txtGeneratDate: ['', Validators.required],
        DepartmentName: ['', Validators.required],
        //ddlCourseType: ['', [DropdownValidators]],
        txtMobileNumber: ['', [Validators.required, Validators.pattern(GlobalConstants.MobileNumberPattern)]],
        txtDetailsofIDProof: ['', [Validators.required, this.validateIDLength.bind(this)]],
        TradeLevel: [''],
        TradeID: [''],
        DirectAdmissionTypeID: [''],
        BranchID: [''],
        Apaarid: [''],
        ddlMaritial: ['', [DropdownValidators]],
        ddlReligion: ['', [DropdownValidators]],
        ddlNationality: ['', [DropdownValidators]],
        ddlCategoryB: [{ value: 0, disabled: true }],
        ddlCategorycp: [{ value: '', disabled: true }],
        ddlCategoryck: [{ value: '', disabled: true }],
        ddlCategoryE: [{ value: 0, disabled: true }],
        /*ddlPrefential: [{ value: ''}, [DropdownValidators]],*/
        IsMinority: [''],
        IsTSP: [''],
        IsSaharia: [''],
        TspDistrictID: [''],
        subCategory: [0, [DropdownValidators1]],
        //IsDevnarayan: [''],
        //DevnarayanDistrictID: ['', [DropdownValidators]],
        //DevnarayanTehsilID: ['', [DropdownValidators]],
        TSPTehsilID: [''],
        ddlCategoryD: [{ value: '', disabled: true },],
        ddlIsMBCCertificate: [0,]
      });
    /*this.StudentJanDetailFormGroup.get('ddlCategoryA')?.disable();*/
    this.IdentityProofList = [{ Id: '1', Name: 'Aadhar Number' }, { Id: '2', Name: 'Aadhar Enrolment ID' }, { Id: '3', Name: 'Jan Aadhar Id' }]


    this.QualificationForm = this.formBuilder.group(
      {
        txtRollNumber: ['', [Validators.required]],

      txtAggregateMaximumMarks: ['', [DropdownValidators]],
      txtAggregateMarksObtained: ['', [DropdownValidators]],
      txtpercentage: [{ value: '', disabled: true }],
      StateID: ['', [DropdownValidators]],
      ddlBoardID: ['', [DropdownValidators]],
      ddlPassyear: ['', [DropdownValidators]],
      ddlMarksType: ['', [DropdownValidators]],
      ddlBoardStateID: ['', [DropdownValidators]],
      ddlBoardExamID: ['', [DropdownValidators]],
    });

    this.SupplementaryForm = this.formBuilder.group({

      txtsubject: ['', Validators.required],
      txtRollNumber: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],

      ddlPassingYear: ['', [DropdownValidators]],
      ddlEducationCategory: ['', [DropdownValidators]],
      txtSupplyMaxMarks: ['', [DropdownValidators]],
      txtSupplyObatined: ['', [DropdownValidators]],
    });

    this.RadioForm = this.formBuilder.group({
      SubjectRadio: ['']
    })


    this.LateralQualificationForm = this.formBuilder.group({
      ddlCourseID: [{ value: '', disabled: true }, [DropdownValidators]],
      txtRollNumber: ['', Validators.required],

      txtAggregateMaximumMarks: ['', [DropdownValidators]],
      txtAggregateMarksObtained: ['', [DropdownValidators]],
      txtpercentage: [{ value: '', disabled: true }],
      //ddlStateID: ['', [DropdownValidators]],
      StateID: ['',],
      ddlBoardID: ['', [DropdownValidators]],
      ddlPassyear: ['', [DropdownValidators]],
      ddlMarksType: ['', [DropdownValidators]],
      SubjectID: ['', Validators.required],
      txtBoardName: [''],
      txtClassSubject: ['', Validators.required],
      ddlBoardStateID: ['', [DropdownValidators]],
      ddlBoardExamID: ['', [DropdownValidators]],
      CoreBranchID: ['',],
      BranchID: ['',],
    })

    this.HighestQualificationForm = this.formBuilder.group({
      ddlHighQualification: [{ value: 0, disabled: true }, [DropdownValidators1]],
      ddlYearOfPassing: ['', [DropdownValidators]],
      ddlMarksType: ['', [DropdownValidators ]],
      txtBoardUniversity: ['', Validators.required],
      txtSchoolCollege: ['', Validators.required],
      txtHighestQualification: [''],
      txtRollNumber: ['', Validators.required],
      txtMaxMarks: ['', [DropdownValidators]],
      txtMarksObatined: ['', [DropdownValidators]],
      //txtAggregateMarksObtained: ['', Validators.required],
      txtPercentage: [{ value: '', disabled: true }],
      ClassSubject: ['', Validators.required],
      StateIDHigh: [''],
      ddlBoardID: ['', [DropdownValidators]],
      ddlBoardStateID: ['', [DropdownValidators]],
      ddlBoardExamID: ['', [DropdownValidators]],
    })

    this.EnglishQualificationForm = this.formBuilder.group({
      RollNumberEnglish: ['', [Validators.required]],

      MaxMarksEnglish: ['', [DropdownValidators]],
      MarksObtainedEnglish: ['', [DropdownValidators]],
      PercentageEnglish: [{ value: '', disabled: true }],
      StateOfStudyEnglish: ['', [DropdownValidators]],
      UniversityBoardEnglish: ['', Validators.required],
      YearofPassingEnglish: ['', [DropdownValidators]],
      MarksTypeIDEnglish: ['', [DropdownValidators]],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //if (this.sSOLoginDataModel.ApplicationFinalSubmit == 2) {
    //  //this.formSubmitSuccess.emit(true); // Notify parent of success
    //}
    /*    this.HRManagerID = Number(this.activatedRoute.snapshot.queryParamMap.get('HRManagerID')?.toString());*/
    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = EnumDepartment.BTER;
    this.request.RoleID = this.sSOLoginDataModel.RoleID

    this.GetRoleID = this.SSOLoginDataModel.RoleID;
    this.request.DepartmentID = 1;
    this.request.IsMBCCertificate = 0;
    this.request.coursetype = this.SSOLoginDataModel.Eng_NonEng;


    this.StudentJanDetailFormGroup.get('txtMobileNumber')?.disable();
    debugger
    if (this.SSOLoginDataModel.RoleID == 17 || this.SSOLoginDataModel.RoleID == 17 || this.SSOLoginDataModel.RoleID == 18 || this.SSOLoginDataModel.RoleID == 33
      || this.SSOLoginDataModel.RoleID == 80 || this.SSOLoginDataModel.RoleID == 81) {
      this.StudentJanDetailFormGroup.get('Gender')?.enable();
      this.StudentJanDetailFormGroup.get('txtMobileNumber')?.enable();
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.enable();
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.enable();
      this.StudentJanDetailFormGroup.get('ddlCategoryck')?.enable();
      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.enable();
      this.StudentJanDetailFormGroup.get('ddlIdentityProof')?.enable();
      this.StudentJanDetailFormGroup.get('ddlCategoryC')?.enable();
      this.StudentJanDetailFormGroup.get('ddlCategoryA')?.enable();
      this.LateralQualificationForm.get('ddlCourseID')?.enable();
      this.isParentIncomeDisabled = false;
      this.islitralsub = false;
      this.isTWSDisabled = false;
      this.isTWSparentincomDisabled = false;

    }
    else {
      this.isParentIncomeDisabled = true;
      this.isTWSDisabled = true;
      this.isTWSparentincomDisabled = true;

    }


    this.DocumentDetailsFormGroup = this.formBuilder.group({

    });

    this.searchRequest.DepartmentID = EnumDepartment.BTER;

    let deptid = this.activatedRoute.snapshot.queryParamMap.get('ApplicationID');
    this.ApplicationID = Number(this.encryptionService.decryptData(deptid ?? "0"));
    this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key'))
    this.statusid = Number(this.activatedRoute.snapshot.queryParamMap.get('statusid'))
    /*this.ApplicationID = Number(this.activatedRoute.snapshot.queryParamMap.get('ApplicationID') ?? 0);*/
    
    await this.GetCoreBranches();
    await this.GetMarktYPEDDL()
    await  this.GetMasterData()
    await this.GetMasterDDL()
    await this.GetDegreeCourse();
    await this.loadDropdownData('BTER_Board')
    await this.GetStateMatserDDL()
    await this.GetPassingYearDDL()
    this.calculatePercentage()
    /* this.GetMarktYPEDDL()*/
    await this.GetPrefentialCategory(0);
    this.calculateLateralPercentage()
    this.GetLateralCourse()
    this.GetOtherMasterDDL()

    if (this.ApplicationID > 0) {
       ;
      this.searchRequest.ApplicationID = this.ApplicationID;
      await this.GetDocumentbyID();
      await this.GetByqualificationId(this.request.SSOID);      
      await this.GetOtherById()
      await this.filteredDocumentDetails1();
      await this.ischeckerloggedInFun();
     
    }else {
      window.location.href = "/StudentVerificationList";
    }
   
  }


  RemarkModel1 = [
    { item_text: 'Rejected MP/PH/KM' },
    { item_text: 'Rejected OBC/MBC/SC/ST/TSP/EWS/TFWS' },
    { item_text: 'Rejected Single mother/ Widows/divorcee' },
    { item_text: 'Rejected Rajasthan Domicile' }
  ];

  settingsMultiselect2: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_text', // ID and Text are both 'item_text' so it saves the text
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  onItemSelect1(item: any) {
    console.log('Selected Item:', item.item_text);
  }

  onDeSelect1(item: any) {
    console.log('Deselected Item:', item.item_text);
  }

  onSelectAll1(items: any) {
    console.log('All Selected:', items.map((i: any) => i.item_text));
  }

  onDeSelectAll1(items: any) {
    console.log('All Deselected:', items.map((i: any) => i.item_text));
  }

  updateRemarkText(): void {
    const dropdownText = this.selectedRemarks.map(r => r.item_text).join(', ');
    const extra = this.customRemark?.trim();

    // Combine dropdown + text remark
    const fullRemark = [dropdownText, extra].filter(Boolean).join(', ');
    this.reject.Remark = fullRemark;
  }

  //updateRemarkText1(): void {
  //  const dropdownText = this.selectedRemarks.map(r => r.item_text).join(', ');
  //  const extra = this.customRemark?.trim();

  //  // Combine dropdown + text remark
  //  const fullRemark = [dropdownText, extra].filter(Boolean).join(', ');
  //  this.request.ActionRemarks = fullRemark;
  //}

  get _StudentJanDetailFormGroup() { return this.StudentJanDetailFormGroup.controls; }
  get _QualificationForm() { return this.QualificationForm.controls; }
  get _SupplementaryForm() { return this.SupplementaryForm.controls; }
  get _LateralQualificationForm() { return this.LateralQualificationForm.controls; }
  get _EnglishQualificationForm() { return this.EnglishQualificationForm.controls; }



  async ischeckerloggedInFun() {
    const roleid= this.SSOLoginDataModel.RoleID;
    this.isCheckerLoggedIn = this.SSOLoginDataModel.RoleID == EnumRole.BTERVerifierDiplomaNonENG || 
                             this.SSOLoginDataModel.RoleID == EnumRole.BTERVerifierDiplomaLaterl ||
                             this.SSOLoginDataModel.RoleID == EnumRole.BTERVerifierDegreeNonEngg || 
                             this.SSOLoginDataModel.RoleID == EnumRole.BTERVerifierDegreeLateral;

    return ;
  }


  
  
  changeCategoryA() {
    if (this.request.CategoryA != 5) {
      this.request.IsDevnarayan = 0;
    }
    if (this.request.CategoryA != 3) {
      this.request.subCategory = 0;
    }

  }

  async GetCoreBranches() {
    this.commonMasterService.GetCommonMasterData('CORE BRANCH').then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      if(data.State == EnumStatus.Success){
        this.CoreBranchList = data['Data'];
      } 
      
    });
  }

  async GetBranches_ByCoreBranch() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DC2ndYear_BranchesDDL(this.request.CourseType,this.lateralrequest.CoreBranchID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success){
          this.BranchList = data['Data'];
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetByqualificationId(SSOID: string) {
    this.isSubmitted = false;
    let searchrequest = new BterSearchmodel()
    searchrequest.SSOID = SSOID
    searchrequest.DepartmentID = EnumDepartment.BTER;
    searchrequest.ApplicationID = this.ApplicationID
    try {
      this.loaderService.requestStarted();
      await this.ApplicationService1.GetQualificationDatabyID(searchrequest)
        .then(async (data: any) => {
           ;
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'] != null) {             
            this.Quali = data['Data']
            if (this.Quali.CourseType == 3) {
              this.lateralrequest = this.Quali.LateralEntryQualificationModel[0]
              if(this.lateralrequest.CourseID == 143) {
                if(this.lateralrequest.Qualification == '12Th') {
                  this.lateralrequest.Qualification='12'
                }
                await this.BoardChange(Number(this.lateralrequest.Qualification))
                await this.BoardStateChange(Number(this.lateralrequest.Qualification))
              }
            }
            if(this.Quali.CourseType == 4 || this.Quali.CourseType == 5) {
              this.lateralrequest = this.Quali.LateralEntryQualificationModel.filter((list: any) => list.Qualification != 'English')[0]
              if(this.lateralrequest.CourseID == 281) {
                if(this.lateralrequest.Qualification == '12Th') {
                  this.lateralrequest.Qualification='12'
                }
                await this.BoardChange(Number(this.lateralrequest.Qualification))
                await this.BoardStateChange(Number(this.lateralrequest.Qualification))
              }

              if(this.Quali.CourseType == 5 && this.lateralrequest.CourseID == 278) {
                await this.GetBranches_ByCoreBranch();
              }

              
              await this.GetStreamDegreeCourse()
              const engqua = this.Quali.LateralEntryQualificationModel.filter((list: any) => list.Qualification == 'English')

              if(engqua.length > 0){
                this.engRequest.ApplicationQualificationId = engqua[0].ApplicationQualificationId
                this.engRequest.MarksTypeIDEnglish = engqua[0].MarkType
                this.engRequest.MaxMarksEnglish = engqua[0].AggMaxMark
                this.engRequest.MarksObtainedEnglish = engqua[0].AggObtMark
                this.engRequest.UniversityBoardEnglish = engqua[0].BoardName
                this.engRequest.SchoolCollegeEnglish = engqua[0].BoardName
                this.engRequest.YearofPassingEnglish = engqua[0].PassingID
                this.engRequest.RollNumberEnglish = engqua[0].RollNumber
                this.engRequest.PercentageEnglish = engqua[0].Percentage
                this.engRequest.StateOfStudyEnglish = engqua[0].StateID
              }
            }

            if (this.Quali.HighestQualificationModel != null) {
              this.Quali.HighestQualificationModel.map((list: any) => {
                if (list.HighestQualificationHigh == "12" || list.HighestQualificationHigh == "12Th") {
                  this.Marksheet12 = true
                }
                if (list.HighestQualificationHigh == "Graduation") {
                  this.Graduation = true
                }
                if (list.HighestQualificationHigh == "PostGraduation") {
                  this.PostGraduation = true
                }
                if (list.HighestQualificationHigh == "D-Voc") {
                  this.voc = true
                }
              })
            }

            if (this.Quali.LateralEntryQualificationModel != null  && this.Quali.CourseType == 3) {
              this.Quali.LateralEntryQualificationModel.map((list: any) => {
                if (list.Qualification == "Diploma") {
                  this.Diploma_Engineering = true
                }
                if (list.Qualification == "10th + C.Voc") {
                  this.Science_Vocational = true
                }
                if (list.Qualification == "12Th" || list.Qualification == "12") {
                  this.Marksheet12 = true
                }
                if (list.Qualification == "10th + ITI") {
                  this.ItiMarksheet = true
                }
              })
            }

            if (this.Quali.LateralEntryQualificationModel != null  && this.Quali.CourseType == 4) {
              this.Quali.LateralEntryQualificationModel.map((list: any) => {
                if (list.Qualification == "Diploma") {
                  this.Diploma_Engineering = true
                }
                if (list.Qualification == "10th + D.Voc") {
                  this.Science_Vocational = true
                }
                if (list.Qualification == "12Th") {
                  this.Marksheet12 = true
                }
                if (list.Qualification == "10th + ITI + English") {
                  this.ItiMarksheet = true
                }
              })
            }

            if (this.Quali.LateralEntryQualificationModel != null  && this.Quali.CourseType == 5) {
              this.Quali.LateralEntryQualificationModel.map((list: any) => {
                if (list.Qualification == "Diploma") {
                  this.Diploma_Engineering = true
                }
                if (list.Qualification == "10th + D.Voc") {
                  this.Science_Vocational = true
                }
                if (list.Qualification == "12Th") {
                  this.Marksheet12 = true
                }
                if (list.Qualification == "10th + ITI + English") {
                  this.ItiMarksheet = true
                }
              })
            }


            this.Quali.SupplementaryDataModel.find((list: any) => {
              if (list.EducationCategory == "12") {
                this.Is12Supp = true
              }
              if (list.EducationCategory == "10") {
                this.Is10Supp = true
              }
            })
          }

          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  OtherDocument() {
    this.isOtherDocument = this.request.VerificationDocumentDetailList.some((x: any) => x.DocumentMasterID === 91);
  }

  async filteredDocumentDetails1() {
    //if (this.request.IsMinority) {
    //  this.documents.Minority = this.request.VerificationDocumentDetailList.filter((x: any) => x.ColumnName == "Minority")[0];
    //  //this.documents.Minority = this.request.VerificationDocumentDetailList.find((x: any) => x.ColumnName === "Minority");
    //}
    debugger

    let neweDocs = this.request.VerificationDocumentDetailList.filter((x: any) => x.Status == 5);

    let verificationDocumentDetailListFiles = this.request.VerificationDocumentDetailList.filter((x: any) => x.Status!=5);
    this.documents.AadharPhoto = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "AadharPhoto")[0];
    this.documents.OtherDocument = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "OtherDocument")[0];

    if (this.request.CategoryE == 1) {
      this.documents.MotherDepCertificate = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "MotherDepCertificate")[0];
    }

    if (this.request.CategoryA == EnumCasteCategory.SC) {
      this.documents.CategoryA = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "CategoryA_SC")[0];
    }
    if (this.request.CategoryA == EnumCasteCategory.ST) {
      this.documents.CategoryA = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "CategoryA_ST")[0];
    }

    if (this.request.IsMBCCertificate == 1 && this.request.CategoryA == EnumCasteCategory.MBC) {
      this.documents.CategoryA = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "CategoryA_MBC")[0];
    }


    if (this.request.CategoryA == EnumCasteCategory.MBC) {
      this.documents.CategoryA = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "CategoryA_MBC")[0];
    }


    for (let i = 1; i <= 9; i++) {
      if (this.request.CategoryB == i) {
        if (i == 1)
          this.documents.CategoryB = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == `CategoryB_1${i}`)[0];
        if (i == 2)
          this.documents.CategoryB = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == `CategoryB_1${i}`)[0];
        if (i == 3)
          this.documents.CategoryB = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == `CategoryB_1${i}`)[0];
        if (i == 4)
          this.documents.CategoryB = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == `CategoryB_1${i}`)[0];
        if (i == 5)
          this.documents.CategoryB = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == `CategoryB_1${i}`)[0];
        if (i == 6)
          this.documents.CategoryB = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == `CategoryB_1${i}`)[0];
        if (i == 7)
          this.documents.CategoryB = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == `CategoryB_1${i}`)[0];
        if (i == 8)
          this.documents.CategoryB = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == `CategoryB_1${i}`)[0];
        if (i == 9)
          this.documents.CategoryB = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == `CategoryB_1${i}`)[0];
      }
    }

    if (this.request.IsKM == '1') {
      this.documents.CategoryC_KM = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "CategoryC_KM")[0];
    }
    if (this.request.IsPH == '1') {
      this.documents.CategoryC_PH = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "CategoryC_PH")[0];
    }
    if (this.request.IsDevnarayan == 1) {
      this.documents.DevnarayanCertificate = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "DevnarayanCertificate")[0];
    }
    if (!this.request.IsTSP) {
      this.documents.TSPAreaCertificatePhoto = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "TSPAreaCertificatePhoto")[0];
    }
    if (this.request.CategoryA == EnumCasteCategory.EWS) {
      this.documents.CategoryA = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "CategoryA_EWS")[0];
    }

    if (this.request.CategoryA == EnumCasteCategory.OBC) {
      this.documents.CategoryA = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "CategoryA_OBC")[0];
    }

     
    if (this.request.CategoryD != 179 && this.request.CategoryD !=0 ) {
      this.documents.CategoryD = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "CategoryD")[0];
    }

    if (this.request.Prefential == 2) {
      this.documents.PrefCategory_1 = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "PrefCategory_1")[0];
    }
    if (this.request.Prefential == 5) {
      this.documents.PrefCategory_1 = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "PrefCategory_5")[0];
    }
    if (this.request.Prefential == 6) {
      this.documents.PrefCategory_1 = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "PrefCategory_6")[0];
    }
    if (this.request.Prefential == 7) {
      this.documents.PrefCategory_1 = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "PrefCategory_7")[0];
    }
    if (this.Graduation == true) {
      this.documents.HigherMarksheet = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "Graduation")[0];
    }
    if (this.NativeCertificate == true) {
      this.documents.NativeCertificate = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "NativeCertificate")[0];
    }
    if (this.Marksheet12 == true) {
      this.documents.HigherMarksheet = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "Marksheet12")[0];
    }
    if (this.PostGraduation == true) {
      this.documents.HigherMarksheet = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "PostGraduation")[0];
    }
    if (this.Diploma_Engineering == true) {
      this.documents.HigherMarksheet = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "Diploma_Engineering")[0];
    }

    if (this.Science_Vocational == true) {
      this.documents.HigherMarksheet = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "10th_C_Voc")[0];
    }
    if (this.ItiMarksheet == true) {
      this.documents.HigherMarksheet = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "10th_2_Year_ITI")[0];
    }
    if (this.senior_secondary == true) {
      this.documents.HigherMarksheet = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "Senior_Secondary")[0];
    }

    if (this.OtherData.ParentsIncome == 71) {
      if (this.OtherData.ApplyScheme == 1) {
        this.documents.IncomeCertificate = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "IncomeCertificate")[0];
      }
    }

    // if (this.OtherData.ApplyScheme == 1 && this.request.CategoryA != EnumCasteCategory.EWS) {
    //   this.documents.TFWSCertificate = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "TFWSCertificate")[0];
    // }

    if (this.Is10Supp == true) {
      this.documents.TenthSupplementary = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "10thSupplementary")[0];
    }

    if (this.Is12Supp == true) {
      this.documents.TwelvthSupplementary = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "12thSupplementary")[0];
    }


    if (verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "D-Voc").length > 0) {
      this.documents.HigherMarksheet = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "D-Voc")[0];
    }


    if (verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "Marksheet").length > 0) {
      this.documents.Marksheet = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "Marksheet")[0];
    }

    if (verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "SportsQuotaCertificate").length > 0) {
      this.documents.SportsQuotaCertificate = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "SportsQuotaCertificate")[0];
    }

    if (this.request.CategoryA == EnumCasteCategory.OBC || this.request.CategoryA == EnumCasteCategory.MBC || this.request.CategoryA == EnumCasteCategory.EWS) {
      const certDate = new Date(this.request.CertificateGeneratDate);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      if (certDate <= oneYearAgo) {
        // OBC certificate is valid → hide Affidavit
        this.isAffadavit=true
        this.documents.AffidavitCertificate = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == 'AffidavitCertificate')[0];
      } else {
        // OBC certificate is old → show Affidavit, hide OBC
        //filtered = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == 'CategoryA_OBC');

        //filtered = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "CategoryA_MBC");
        //filtered = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == "CategoryA_EWS");
      }
    } else {
      // Not OBC → hide both
      this.documents.AffidavitCertificate = verificationDocumentDetailListFiles.filter((x: any) => x.ColumnName == 'AffidavitCertificate')[0];
    }


  }


  changeKM() {
    if (this.request.IsKM == "1") {
      this.request.PrefentialCategoryType = 2;
      this.request.CategoryA = 1;

      this.StudentJanDetailFormGroup.get('ddlCategoryA')?.disable();
    } else {
      this.Showdropdown();
    }
  }

  async GetMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('MaritalStatus')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.maritialList = data['Data'];

        }, (error: any) => console.error(error)
        );

      // await this.GetCategoryDList(); 

      await this.commonMasterService.CategoryBDDLData(EnumDepartment.BTER)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryBlist = data['Data'];

        }, (error: any) => console.error(error)
        );
    
      await this.commonMasterService.GetCommonMasterDDLByType('Nationality')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.NationalityList = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterData('Religion')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ReligionList = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterDDLByType('Category_C')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.category_CList = data['Data'];

        }, (error: any) => console.error(error)
        );


      //await this.commonMasterService.GetCommonMasterData('Gender')
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    this.GenderList = data['Data'];
      //    console.log("GenderList", this.GenderList)
      //  }, (error: any) => console.error(error)
      //  );
      await this.commonMasterService.GetCommonMasterData('DevnarayanDistrict')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DevnarayanAreaList = data['Data'];
        }, (error: any) => console.error(error)
        );
      // await this.commonMasterService.GetCommonMasterData('DevnarayanAreaTehsil')
      //   .then((data: any) => {
      //     data = JSON.parse(JSON.stringify(data));
      //     this.DevnarayanTehsilList = data['Data'];
      //     console.log("GenderList", this.DevnarayanTehsilList)
      //   }, (error: any) => console.error(error)
      // );
      await this.commonMasterService.GetCommonMasterData('TspDistrict')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TspDistrictList = data['Data'];
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




  async GetPrefentialCategory(typeId: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.PrefentialCategoryMaster(1, this.SSOLoginDataModel.Eng_NonEng, typeId)
        .then((data: any) => {
          ;
          data = JSON.parse(JSON.stringify(data));
          this.PrefentialCategoryList = data['Data'];

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


  filterString(input: string): string {
    return input.replace(/[^a-zA-Z0-9. ]/g, '');
  }


  onInput(event: any): void {
    const inputValue = event.target.value;

    // Remove non-digit characters
    const onlyDigits = inputValue.replace(/\D/g, '');

    // Update the input value with only digits
    event.target.value = onlyDigits;

    // Optionally, update the ngModel if needed
    this.request.MobileNumber = onlyDigits;
  }



  async Showdropdown() {
    //if (this.model.ENR_ID == 5)
    //{
    //  this.IsShowDropdown = true
    //}
    //else {
    //  this.IsShowDropdown = false
    //}
    //if (this.model.ENR_ID != 5 && this.model.ENR_ID != 0) {
    // this.IsShow = true
    //}
    //else {
    //  this.IsShow = false
    //}


    
    var th = this;
    var data = this.PrefentialCategoryList.filter(function (dta: any) { return dta.ID == th.model.ENR_ID });
    if (data != undefined && data.length > 0) {
      this.request.PrefentialCategoryType = data.length > 0 ? data[0].TypeID : 0;
      this.StudentJanDetailFormGroup.get('ddlPreferentialType')?.disable();
    }

    if (this.model.ENR_ID != 5 && this.request.PrefentialCategoryType == 2) {
      this.request.CategoryA = 1;
      this.StudentJanDetailFormGroup.get('ddlCategoryA')?.disable();
      this.StudentJanDetailFormGroup.get('ddlCategoryck')?.enable();
      //this.IdentityProofList = [{ Id: '1', Name: 'Aadhar Number' }, { Id: '2', Name: 'Aadhar Enrolment ID' }]
      this.IdentityProofList.splice(2, 1)
    } else {
      this.StudentJanDetailFormGroup.get('ddlCategoryA')?.enable();
      //this.StudentJanDetailFormGroup.get('ddlCategoryck')?.disable();
      this.request.IsKM = "0";
      if (this.IdentityProofList.filter(function (dt: any) { return dt.Id == 3 }).length == 0) {
        this.IdentityProofList.push({ Id: '3', Name: 'Jan Aadhar Id' });
      }

      if (this.SSOLoginDataModel.RoleID == EnumRole.DTE
        || this.SSOLoginDataModel.RoleID == EnumRole.DTENON
        || this.SSOLoginDataModel.RoleID == EnumRole.DTELateral
        || this.SSOLoginDataModel.RoleID == 80 || this.SSOLoginDataModel.RoleID == 81) {
        this.StudentJanDetailFormGroup.get('ddlCategoryA')?.enable();

      }
      else {
        this.StudentJanDetailFormGroup.get('ddlCategoryA')?.disable();
      }

    }



    //this.items.push(newItem);
    //this.items.splice(index, 1);


    if (this.request.PrefentialCategoryType == 2) {
      this.request.CategoryA = 1
      this.request.CategoryB = 0
      this.request.CategoryC = 0
      this.request.CategoryD = 0
      this.request.CategoryE = 0
      this.request.IsPH = '0'
      this.request.IsTSP = false
      this.request.IsDevnarayan = 0
      this.request.IsEws = 0
      this.request.IsRajasthani = false
      this.request.DevnarayanTehsilID = 0
      this.request.DevnarayanDistrictID = 0
      this.request.TSPTehsilID = 0
      this.request.TspDistrictID = 0
      ///this.StudentJanDetailFormGroup.get('ddlCategoryA')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategoryD')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.clearValidators();
      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.clearValidators();
      //this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.clearValidators();
      //this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.clearValidators();
      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.clearValidators();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.clearValidators();


      //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();




    }
    else {

      //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.setValidators(Validators.required);
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.setValidators(DropdownValidators1);
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.setValidators(DropdownValidatorsString1);
      if (this.request.Gender != 97 && this.request.Maritial != 62) {
        this.StudentJanDetailFormGroup.get('ddlCategoryD')?.setValidators(DropdownValidators1);
        this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
      } else {
        this.request.CategoryD = 0;
      }

      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.setValidators(DropdownValidators1);


      //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.updateValueAndValidity();

      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.updateValueAndValidity();

      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.clearValidators();
      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();

      //if (this.model.CategoryA == 5) {
      //  this.StudentJanDetailFormGroup.get('IsDevnarayan')?.setValidators([DropdownValidators]);
      //  this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();
      //}

    }



  }




  Showdrop() {
    if (this.model.JAN_AADHAR > '0') {
      this.IsShowDrop = true
    }
    else {
      this.IsShowDrop = false
    }
  }

  async changeMaritalStatus() {
    await this.GetCategoryDList();
  }


  async GetCategoryDList() {
    await this.commonMasterService.GetCategoryDMasterDDL(this.request.Maritial)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        this.CategoryDlist = data['Data'];

      }, (error: any) => console.error(error)
      );
  }



  passingYearValidation() {
    if (this.request.PassingID != '' && this.lateralrequest.PassingID != '' && this.lateralrequest.PassingID <= this.request.PassingID) {
      this.toastr.error('Passing Year of Higher Qualification must be greater than 10th Passing Year', 'Error');
      this.lateralrequest.PassingID = '';
      return;
      //} else if (this.request.PassingID != '' && this.lateralrequest.PassingID != '' && this.request.PassingID > this.lateralrequest.PassingID) {

      //  this.toastr.error('Passing Year of 8th must be less than or equal to Highest Qualification Passing Year', 'Error');
      //  this.formData.YearofPassingHigh = '';
      //  return;
      //} else if (this.formData10th.YearofPassing10 != '' && this.formData.YearofPassingHigh != '' && this.formData10th.YearofPassing10 > this.formData.YearofPassingHigh) {

      //  this.toastr.error('Passing Year of 10th must be less than or equal to Highest Qualification Passing Year', 'Error');
      //  this.formData10th.YearofPassing10 = '';
      //  return;

    }//}
  }






  minimumAgeValidator(minYears: number) {
    return (control: AbstractControl) => {
      const inputDate = new Date(control.value);
      const today = new Date();
      const julyFirstThisYear = new Date(today.getFullYear(), 6, 1);
      const minDate = new Date(julyFirstThisYear);
      minDate.setFullYear(today.getFullYear() - minYears);

      if (control.value && inputDate > minDate) {
        return { invalidAge: true };
      }
      return null;
    };
  }





  async ViewHistory(row: any, ID: number) {
    //this.searchRequest.action = "_GetstudentWorkflowdetails";
    //this.GetAllDataActionWise();

    this.childComponent.OpenRevertDocumentPopup(ID, this.searchRequest.ApplicationID);
  }








  onItemSelect(item: any, centerID: number=0) {

    if (!this.SubjectID.includes(item)) {
      this.SubjectID.push(item);
    }
   
  }

  onDeSelect(item: any, centerID: number=0) {

  
  }

  onSelectAll(items: any[], centerID: number=0) {

    /*    this.SelectedSubjectList = [...items];*/

  }

  onDeSelectAll(centerID: number=0) {

    /*  this.SelectedSubjectList = [];*/

  }

  onFilterChange(event: any) {
    // Handle filtering logic (if needed)
    console.log(event);
  }

  onDropDownClose(event: any) {
    // Handle dropdown close event
    console.log(event);
  }

  async GetLateralCourse() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('LateralAdmission')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.Lateralcourselist = data['Data'];

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

  async GetDegreeCourse() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('DegreeCourse1stYear_NonEngg')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.Degreecourselist = data['Data'];
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

  GetDegreeCourseName(CourseID: number) {
    if (CourseID == EnumDegreeCourse.Diploma_Engineering) {
      return "Diploma"
    } else if (CourseID == EnumDegreeCourse.Senior_Secondary_Vocational) {
      return "10th + D.Voc"
    } else if (CourseID == EnumDegreeCourse.Senior_Secondary) {
      return "12Th"
    } else if (CourseID == EnumDegreeCourse.ITI_Tenth) {
      return "10th + ITI + English";
    } else {
      return "";
    }
  }

  async GetStreamDegreeCourse() {
     
    try {
      this.loaderService.requestStarted();
      if (this.lateralrequest.CourseID == EnumDegreeCourse.Diploma_Engineering) {
        this.action = "Lateral_Diploma"
        //this.lateralrequest.Qualification = "Diploma_Engineering"
      } else if (this.lateralrequest.CourseID == EnumDegreeCourse.Senior_Secondary_Vocational) {
        this.action = "Senior_Seconary_Vocational"
        //this.lateralrequest.Qualification = "Senior_Secondary_Vocational"
      } else if (this.lateralrequest.CourseID == EnumDegreeCourse.Senior_Secondary) {
        this.action = "Senior_Seconary"
        //this.lateralrequest.Qualification = "Senior_Secondary"
      }
      else if (this.lateralrequest.CourseID == EnumDegreeCourse.ITI_Tenth) {
        this.action = "Lateral_Trade"
        //this.lateralrequest.Qualification = "ITI_Tenth"
      }

      this.lateralrequest.Qualification = this.GetDegreeCourseName(this.lateralrequest.CourseID);
      if (this.lateralrequest.CourseID == EnumDegreeCourse.Senior_Secondary) {
        this.settingsMultiselect = {
          singleSelection: false,
          idField: 'ID',
          textField: 'Name',
          enableCheckAll: false,
          selectAllText: 'Select Maximum 3 Subject only',
          unSelectAllText: 'Unselect All',
          allowSearchFilter: true,
          limitSelection: 3,
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

        // this.lateralrequest.BoardID = 0;
        // this.lateralrequest.BoardName = '';
      } else if (this.lateralrequest.CourseID == EnumDegreeCourse.Diploma_Engineering) {
        this.settingsMultiselect = {
          singleSelection: false,
          idField: 'ID',
          textField: 'Name',
          enableCheckAll: false,
          selectAllText: 'Select 1 Branch Only',
          unSelectAllText: 'Unselect All',
          allowSearchFilter: true,
          limitSelection: 1,
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
        this.SubjectID = []
        this.lateralrequest.BoardID = 0;
        this.lateralrequest.BoardName = '';
      }

      if (this.lateralrequest.CourseID == 281 || this.lateralrequest.CourseID == 278 || this.lateralrequest.CourseID == 280) {
        await this.GetLateralQualificationBoard();
      }
      await this.commonMasterService.GetCommonMasterData(this.action)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
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

  async GetTspTehsilList() {
    this.TspTehsilRequest.DistrictID = this.request.TspDistrictID
    try {
      this.loaderService.requestStarted();

      await this.tspAreaService.TSPArea_GetTehsil_DistrictWise(this.TspTehsilRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TspTehsilList = data['Data'];
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

  async selectDDID(districtID: number) {
    if (districtID > 0) {
      this.filteredTehsilList = this.DevnarayanTehsilList.filter((tehsil: any) =>
        Number(tehsil.DistrictID.toString().trim()) == Number(districtID)
      );
    } else {
      this.filteredTehsilList = [];
    }
  }




  //async GetStreamCourse() {
  //  try {

  //    this.loaderService.requestStarted();
  //    if (this.lateralrequest.CourseID == EnumLateralCourse.Diploma_Engineering) {
  //      this.action = "Lateral_Diploma"
  //      //this.lateralrequest.Qualification = "Diploma_Engineering"
  //    } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary_Vocational) {
  //      this.action = "Senior_Seconary_Vocational"
  //      //this.lateralrequest.Qualification = "Senior_Secondary_Vocational"
  //    } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
  //      this.action = "Senior_Seconary"
  //      //this.lateralrequest.Qualification = "Senior_Secondary"
  //    }
  //    else if (this.lateralrequest.CourseID == EnumLateralCourse.ITI_Tenth) {
  //      this.action = "Lateral_Trade"
  //      //this.lateralrequest.Qualification = "ITI_Tenth"
  //    }
  //    this.SubjectID = []

  //    await this.commonMasterService.GetCommonMasterData(this.action)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        console.log(data);
  //        this.SubjectMasterDDLList = data['Data'];
  //        console.log(this.SubjectMasterDDLList)

  //      }, (error: any) => console.error(error)
  //      );
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}





  async GetStreamCourse() {
    try {

      this.loaderService.requestStarted();
      if (this.lateralrequest.CourseID == EnumLateralCourse.Diploma_Engineering) {
        this.action = "Lateral_Diploma"
        //this.lateralrequest.Qualification = "Diploma_Engineering"
      } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary_Vocational) {
        this.action = "Senior_Seconary_Vocational"
        //this.lateralrequest.Qualification = "Senior_Secondary_Vocational"
      } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
        this.action = "Senior_Seconary"
        //this.lateralrequest.Qualification = "Senior_Secondary"
      }
      else if (this.lateralrequest.CourseID == EnumLateralCourse.ITI_Tenth) {
        this.action = "Lateral_Trade"
        //this.lateralrequest.Qualification = "ITI_Tenth"
      }

      this.lateralrequest.Qualification = this.GetLateralCourseName(this.lateralrequest.CourseID);
      if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
        this.settingsMultiselect = {
          singleSelection: false,
          idField: 'ID',
          textField: 'Name',
          enableCheckAll: false,
          selectAllText: 'Select Maximum 3 Subject only',
          unSelectAllText: 'Unselect All',
          allowSearchFilter: true,
          limitSelection: 3,
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
      } else if (this.lateralrequest.CourseID == EnumLateralCourse.Diploma_Engineering) {
        this.settingsMultiselect = {
          singleSelection: false,
          idField: 'ID',
          textField: 'Name',
          enableCheckAll: false,
          selectAllText: 'Select 1 Branch Only',
          unSelectAllText: 'Unselect All',
          allowSearchFilter: true,
          limitSelection: 1,
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
      }

      this.SubjectID = []
      this.lateralrequest.BoardID = 0;
      this.lateralrequest.BoardName = '';
      if (this.lateralrequest.CourseID == 143 || this.lateralrequest.CourseID == 140 || this.lateralrequest.CourseID == 142) {
        await this.GetLateralQualificationBoard();
      }
      await this.commonMasterService.GetCommonMasterData(this.action)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
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





  async GetStream() {
    try {
      this.loaderService.requestStarted();

      if (this.lateralrequest.CourseID == EnumLateralCourse.Diploma_Engineering) {
        this.action = "Lateral_Diploma"
        //this.lateralrequest.Qualification = this.GetLateralCourseName(this.lateralrequest.CourseID); // "Diploma_Engineering"
      } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary_Vocational) {
        this.action = "Senior_Seconary_Vocational"
        //this.lateralrequest.Qualification = "Senior_Secondary_Vocational"
      } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
        this.action = "Senior_Seconary"
        //this.lateralrequest.Qualification = "Senior_Secondary"
      }
      else if (this.lateralrequest.CourseID == EnumLateralCourse.ITI_Tenth) {
        this.action = "Lateral_Trade"
        //this.lateralrequest.Qualification = "ITI_Tenth"
      }

      this.lateralrequest.Qualification = this.GetLateralCourseName(this.lateralrequest.CourseID);

      /*    this.SubjectID = []*/
      //this.lateralrequest.BoardID = 0;
      //this.lateralrequest.BoardName = '';
      if (this.lateralrequest.CourseID == 143 || this.lateralrequest.CourseID == 140 || this.lateralrequest.CourseID == 142) {
        await this.GetLateralQualificationBoard();
      }
      await this.commonMasterService.GetCommonMasterData(this.action)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
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

  GetLateralCourseName(CourseID: number) {
    if (CourseID == EnumLateralCourse.Diploma_Engineering) {
      return "Diploma"
    } else if (CourseID == EnumLateralCourse.Senior_Secondary_Vocational) {
      return "10th + C.Voc"
    } else if (CourseID == EnumLateralCourse.Senior_Secondary) {
      return "12Th"
    } else if (CourseID == EnumLateralCourse.ITI_Tenth) {
      return "10th + ITI";
    } else {
      return "";
    }
  }

 

  /*new Qualification-------------------------------------------------------------------------------------------------------------------------------------------*/

  async passingYear() {

    const selectedYear = this.request.PassingID;
    if (selectedYear) {
      this.QualificationPassingYearList = this.PassingYearList.filter((item: any) => item.Year > selectedYear);
      this.SupplypassingYear();
    } else {
      this.PassingYearList;
    }
  }

  async BoardChange(Type: number) {
    try {

      if ((this.request.BoardID == 38 && Type == 10) || (this.formData1.BoardID == 38 && Type == 12) || (this.lateralrequest.BoardID == 38 && Type == 12)) {

        this.loaderService.requestStarted();
        await this.commonMasterService.GetCommonMasterData("BTER_Other_State")
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (Type == 10) {
              this.ShowOtherBoard10th = true
              this.BoardStateList10 = data['Data'];
            } else if (Type == 12) {
              this.ShowOtherBoard12th = true
              this.BoardStateList12 = data['Data'];
            }
          }, (error: any) => console.error(error)
          );
      } else {
        if (Type == 10) {
          this.ShowOtherBoard10th = false;
          this.BoardStateList10 = [];
        } else if (Type == 12) {
          this.ShowOtherBoard12th = false;
          this.BoardStateList12 = [];
        }
      }
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

  async BoardStateChange(Type: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData("BTER_Other_Board", Type, (Type == 10 ? this.request.BoardStateID : Type == 12 ? this.formData1.BoardStateID : 0))

        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (Type == 10) {
            this.BoardExamList10 = data['Data'];
          } else if (Type == 12) {
            this.BoardExamList12 = data['Data'];
          }
        }, (error: any) => console.error(error)
        );

      if(this.request.CourseType == 4 || this.request.CourseType == 3) {
        await this.commonMasterService.GetCommonMasterData("BTER_Other_Board", Type, (this.lateralrequest.BoardStateID))

        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (Type == 12) {
            this.BoardExamList12 = data['Data'];
          }
        }, (error: any) => console.error(error)
        );
      }
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

  async BoardStateChangeDiploma(Type: number) {



    try {

      this.loaderService.requestStarted();

      await this.commonMasterService.GetCommonMasterData("BTER_Other_Board", Type, (Type == 12 ? this.lateralrequest.BoardStateID : 0))

        .then((data: any) => {



          data = JSON.parse(JSON.stringify(data));

          console.log(data);

          if (Type == 10) {

            this.BoardExamList10 = data['Data'];

          } else if (Type == 12) {

            this.BoardExamList12 = data['Data'];

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

  async GetLateralQualificationBoard() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLateralQualificationBoard(this.lateralrequest.CourseID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LateralBoardList = data['Data'];
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

  async GetStateMatserDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.stateMasterDDL = data['Data'];

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

  SupplypassingYear() {

    const selectedYear10 = this.request.PassingID;
    const educationCategory = this.addrequest.EducationCategory;

    if (educationCategory == '10' && selectedYear10) {
      // Filter PassingYearList for years >= selectedYear10
      this.SupplyPassingYearList = this.PassingYearList.filter(
        (item: any) => item.Year >= selectedYear10
      );
    } else if (educationCategory == '12') {
      const selectedYear12 = this.formData1.YearofPassingHigh;
      if (selectedYear12) {
        // Match PassingYearList where year equals selectedYear12
        this.SupplyPassingYearList = this.PassingYearList.filter(
          (item: any) => item.Year >= selectedYear12
        );
      } else {
        this.SupplyPassingYearList = this.PassingYearList;
      }
    } else {
      // Default to showing all years if no valid category or value
      this.SupplyPassingYearList = this.PassingYearList;
    }
  }



  async GetDocumentbyID() {
    this.isSubmitted = false;
    this.searchRequest.SSOID = this.SSOLoginDataModel.SSOID;
    this.searchRequest.DepartmentID = EnumDepartment.BTER;
    this.searchRequest.AcademicYear = this.SSOLoginDataModel.UserID;

    try {
      this.loaderService.requestStarted();
      await this.ApplicationService.DocumentScrunityData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'data ');
          debugger
          
          this.request.ApplicationID = data['Data']['ApplicationID']
          if (this.SSOLoginDataModel.RoleID  != EnumRole.DTE
            && this.SSOLoginDataModel.RoleID != EnumRole.DTENON
            && this.SSOLoginDataModel.RoleID != EnumRole.DTELateral
            && this.SSOLoginDataModel.RoleID != 80 && this.SSOLoginDataModel.RoleID != 81)
          {
            if (data['Data']['VerifierID'] != this.SSOLoginDataModel.UserID)
            {
              this.router.navigate(['/StudentVerificationList?status=1']);
            }
            
          }

          if (data['Data'] != null) {
            this.request = data['Data']

            this.DeficiencyDocList = this.request.VerificationDocumentDetailList?.filter((x: any) => x.Status == 5)

            this.BackupCatoryA = this.request.CategoryA
            // Start Added For Qualification 
            if (this.request.PassingID == null) {
              this.request.PassingID = ''
            } else {
              this.request.PassingID = data['Data']['PassingID']
              this.passingYear();
            }
            if (data['Data']['IsSupplement'] === true) {
              this.isSupplement = true
            } else {
              this.isSupplement = false
            }

            this.BoardChange(this.request.QualificationID)
            this.BoardStateChange(this.request.QualificationID)
            if (this.request.CourseType == 2 && this.request.HighestQualificationModel != null) {
              if(this.request.HighestQualificationModel.length > 0) {
                this.nonEngHighQuali = this.request.HighestQualificationModel[0].HighestQualificationHigh
                this.formData1.StateIDHigh = this.request.HighestQualificationModel[0].StateIDHigh
                this.formData1 = this.request.HighestQualificationModel[0]

                if (this.formData1.HighestQualificationHigh == '12' || this.formData1.HighestQualificationHigh == '12Th') {
                  this.BoardChange(12);
                  this.BoardStateChange(12);
                }

                this.nonEngHighQuali = this.request.HighestQualificationModel[0].HighestQualificationHigh
              }
            } else if (this.request.CourseType == 2 && this.request.HighestQualificationModel == null) {
              this.hideHighestQualification = true
            }
            
            if (this.request.HighestQualificationModel == null) {
              this.request.HighestQualificationModel = []
              this.formData1 = new HighestQualificationModel()
            } else {
              this.HighQualificationList = data['Data']['HighestQualificationModel'][0]
            }

            if (this.request.SupplementaryDataModel == null) {
              this.request.SupplementaryDataModel = []
              this.addrequest = new SupplementaryDataModel()
            }

            if (this.request.LateralEntryQualificationModel == null) {

              this.request.LateralEntryQualificationModel = []
              this.lateralrequest = new LateralEntryQualificationModel()
            }
            else {

              this.request.LateralEntryQualificationModel = data['Data']['LateralEntryQualificationModel']
              this.lateralrequest = data['Data']['LateralEntryQualificationModel'][0]

              this.GetStream();
               
              this.SupplypassingYear();
              if (data['Data']['LateralEntryQualificationModel'][0]['SubjectID'] != null) {
                this.SubjectID = data['Data']['LateralEntryQualificationModel'][0]['SubjectID']
              } else {
                this.SubjectID = []
              }

              if (this.lateralrequest.Qualification == '12Th' || this.lateralrequest.Qualification == '12') {
                this.BoardChange(12);
                this.BoardStateChangeDiploma(12);
              }
            }



            this.request.IsSupplement = data['Data']['IsSupplement']
            this.request = data['Data']
            const dob = new Date(data['Data']['DOB']);
            const year = dob.getFullYear();
            const month = String(dob.getMonth() + 1).padStart(2, '0');
            const day = String(dob.getDate()).padStart(2, '0');
            this.request.DOB = `${year}-${month}-${day}`;
            this.request.Religion = data['Data']['Religion']


            if (data.Data.IsTSP == true) {
              this.request.subCategory = 1
            } else if (data.Data.IsSaharia == true) {
              this.request.subCategory = 2
            } else {
              this.request.subCategory = 3
            }

            if (this.request.IsPH == null) {
              this.request.IsPH = ''

            }
            if (this.request.IsKM == null) {
              this.request.IsKM = ''
            }

            this.request.PrefentialCategoryType = data.Data.PrefentialCategoryType
            this.GetTspTehsilList();
            //this.GetDevnarayanTehsilList();
            // this.GetPrefentialCategory(this.model.PrefentialCategoryType)
            //this.GetPreferentialCategory();
            //this.selectDDID(this.model.DevnarayanDistrictID)

 
            this.request.ENR_ID = data['Data']['Prefential']


            var th = this;
           this.Showdropdown().then(function () {
              //th.model.IndentyProff = data['Data']['IndentyProff']
              //th.cdr.detectChanges();
              //th.cdr.markForCheck();
            });

            this.changeMaritalStatus();
            this.request.CategoryD = data['Data']['CategoryD']
            console.log(this.request.CategoryD, "CategoryD Data")

         
            //this.model.DevnarayanTehsilID = data['Data']['DevnarayanTehsilID']
            // this.selectDDID(this.request.DevnarayanDistrictID)
            // this.request.DevnarayanTehsilID = data.Data.DevnarayanTehsilID
            //if (this.model.DetailID.length == 12) {
            //  this.model.IndentyProff = 1
            //}
            this.changeKM();
            //this.changeMaritalStatus();



  
            this.request.VerificationDocumentDetailList = data['Data']['VerificationDocumentDetailList']
            //this.request.DOB = new Date(data['Data']['DOB']).toISOString().split('T').shift().toString();
            //this.request.R  eligion = data['Data']['Religion
            //this.request.VerificationDocumentDetailList = this.request.VerificationDocumentDetailList.map(doc => ({
            //  ...doc,
            //  DisFileName: doc.DisFileName.replace(/^upload the scanned copy of /i, '') // Remove "upload the "
            //}));
            this.request.VerificationDocumentDetailList.forEach((dOC: any) => {
              dOC.ShowRemark = dOC.Status === EnumVerificationAction.Revert;
            });
          //  this.request.VerificationDocumentDetailList.some((x: any) => x.Status === 5); this.request.VerificationDocumentDetailList.forEach((x: any) => {
          //     if (x.Status === 5) {
          //       x.Status = 0;
          //     }
          //  });
            
            if (this.request.VerificationDocumentDetailList.some((x: any) => x.Status != 0)) {
              this.changeshow = false
            } else if (this.request.VerificationDocumentDetailList.every((x: any) => x.Status == 0)) {
              this.changeshow = true
            }
     
           /* this.Isremarkshow = this.request.VerificationDocumentDetailList.some((x: any) => x.Status === EnumVerificationAction.Revert);*/
          }
       




            if (this.request?.VerificationDocumentDetailList) {
              this.filteredDocumentDetails = this.request.VerificationDocumentDetailList.filter((x) => x.GroupNo == 1 && x.Status!=5);
            } else {         
              this.filteredDocumentDetails = [];
            }

            this.OtherDocument();


           

            //if (data.Data.IsTSP == true) {
            //  this.request.subCategory = 1
            //  console.log("subCategory", this.request.subCategory)
            //} else if (data.Data.IsSaharia == true) {
            //  this.request.subCategory = 2
            //} else {
            //  this.request.subCategory = 3
            //}
            //console.log(this.request.VerificationDocumentDetailList,"ddd")
   
            //this.commonMasterService.GetCommonMasterData('DevnarayanAreaTehsil')
            //  .then((data: any) => {
            //    data = JSON.parse(JSON.stringify(data));
            //    this.DevnarayanTehsilList = data['Data'];
            //    this.selectDDID(this.request.DevnarayanDistrictID);
            //    this.filteredTehsilList.ID = this.request.DevnarayanDistrictID;
            //    this.request.DevnarayanTehsilID = data.Data.DevnarayanTehsilID;
            //  }, (error: any) => {
            //  });
            //this.request.DevnarayanTehsilID;

          
          

          //this.request = data['Data'];

          console.log(this.request.RemarkModel,"remark")

          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  onIdentityProofChange() {
    this.PersonalDetailForm.get('txtDetailsofIDProof')?.updateValueAndValidity();
  }

  validateIDLength(control: any) {
    const identityProof = this.PersonalDetailForm?.get('ddlIdentityProof')?.value; // Access the value correctly
    const value = control.value; // This is the value of the current input

    if (identityProof === '1' && value?.length !== 12) {
      this.errorMessage = 'Aadhar Number must be exactly 12 digits.';
      return { invalidLength: true };
    } else if (identityProof === '2' && value?.length !== 28) {
      this.errorMessage = 'Aadhar Enrolment ID must be exactly 28 digits.';
      return { invalidLength: true };
    }
    return null; // Validation passed
  }
  async GetMasterData() {
    try {
      this.loaderService.requestStarted();


      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*  console.log(data, 'ggg');*/
          this.CategoryAlist = data['Data'];

        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*  console.log(data, 'ggg');*/
          this.CategoryAlist1 = data['Data'];
          this.CategoryAlist1 = this.CategoryAlist1.map((x: any) => {
            if (x.CasteCategoryID === 1) {
              x.CasteCategoryName = 'UR'; // Change 'GENERAL' to 'UR'
            }
            return x;
          });

          this.CategoryAlist1.push({
            CasteCategoryID: 12,
            CasteCategoryName: "TSP"
          });

        }, (error: any) => console.error(error)
        );


      await this.commonMasterService.GetCommonMasterData('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (this.request.coursetype == EnumCourseType1.DiplomaNonEngineering1stYear) {
            this.GenderList = [{ "Name": "Female", "ID": "98" }, { "Name": "Transgender", "ID": "99" }];
          } else {
            this.GenderList = data['Data'];
          }

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterData('DocumentScruitny')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DocumentStatusList = data['Data'];
          this.DocumentStatusList = data['Data'].filter((item: any) => item.ID === EnumVerificationAction.Approved || item.ID === EnumVerificationAction.Revert);

        }, (error: any) => console.error(error)
        );

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


  async OnShow(item: any) {

    if (item == 1) {
      this.isSupplement = true



    } else {
      this.isSupplement = false
      this.request.SupplementaryDataModel = []


    }
  }

  async AddNew() {

    this.isSu = true;
    if (this.SupplementaryForm.invalid) {
      return console.log("error");
    }
    //Show Loading
    if (this.request.PassingID < this.addrequest.PassingID && this.addrequest.EducationCategory == '10') {
      this.toastr.warning('Please Enter Supplementary Year Of Passing less than or equal to 10th Qualification Year', 'Error');
      return console.log("error");
      this.addrequest.PassingID = ''
    }

    // show Obtain Marks
    if (this.addrequest.MaxMarksSupply < this.addrequest.ObtMarksSupply) {
      this.toastr.warning('Marks Obtained cannot be greater than Maximum Marks.');
      return console.log("error");
      this.addrequest.PassingID = ''
    }

    try {

      /*this.addrequest.PassingID = this.FinalcialList.filter((x: any) => x.FinancialYearID == this.EducationalQualificationFormData.PassingYearID)[0]['FinancialYearName'];*/
      this.request.SupplementaryDataModel.push(
        {

          PassingID: this.addrequest.PassingID,
          RollN0: this.addrequest.RollN0,
          Subject: this.addrequest.Subject,
          EducationCategory: this.addrequest.EducationCategory,
          MaxMarksSupply: this.addrequest.MaxMarksSupply,
          ObtMarksSupply: this.addrequest.ObtMarksSupply,
          SupplementryID: 0


        },

      );

      this.isSu = false

    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(async () => {
        await this.ResetRow();
        this.loaderService.requestEnded();

      }, 200);
    }
  }



  async CancelData() {

    this.request.StateID = 0;
    this.request.BoardID = 0;
    this.request.PassingID = '';
    this.request.RollNumber = '';
    this.request.MarkType = 0;
    this.request.AggMaxMark = 0;
    this.request.Percentage = '';
    this.request.AggObtMark = 0;
    this.request.SupplementaryDataModel = [];
    this.request.IsSupplement = false;

  }

  async ResetRow() {
    this.loaderService.requestStarted();

    this.addrequest.PassingID = '';
    this.addrequest.Subject = '';
    this.addrequest.EducationCategory = '';
    this.addrequest.RollN0 = '';


    // this.isSubmittedItemDetails = false;
    setTimeout(() => {
      this.loaderService.requestEnded();
    }, 200);
  }





  async calculatePercentage() {
    ;
    let maxMarks = this.request.AggMaxMark;
    const marksObtained = this.request.AggObtMark;
    if (Number(this.request.AggObtMark) > Number(this.request.AggMaxMark)) {

      this.request.Percentage = '';
      this.request.AggObtMark = 0;
      this.toastr.warning('Marks Obtained cannot be greater than Maximum Marks.');
      return;
    }
    if (this.request.MarkType == 84) {
      maxMarks = 10
      this.request.AggMaxMark = 10
      this.QualificationForm.get('txtAggregateMaximumMarks')?.disable();
      if (this.request.AggObtMark > 10) {
        this.request.AggObtMark = 0;
        this.request.Percentage = '';
        return
      }
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;
        if (percentage < 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.request.Percentage = '';
          this.request.AggObtMark = 0;
        } else {
          this.request.Percentage = percentage.toFixed(2);
        }
      } else {
        this.request.Percentage = '';
      }
    } else if (this.request.MarkType == 83) {
      this.QualificationForm.get('txtAggregateMaximumMarks')?.enable();
      if (maxMarks && marksObtained && Number(marksObtained) <= Number(maxMarks)) {
        const percentage = (marksObtained / maxMarks) * 100;
        if (percentage < 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.request.Percentage = '';
          this.request.AggObtMark = 0;
        } else {
          this.request.Percentage = percentage.toFixed(2);
        }

      } else {
        this.request.Percentage = '';
      }
      if (this.request.SupplementaryDataModel == null) {
        this.request.SupplementaryDataModel = []
      }
    }
  }

  async calculatePercentageEnglish() {
    ;
    let maxMarks = this.engRequest.MaxMarksEnglish;
    const marksObtained = this.engRequest.MarksObtainedEnglish;
    if (Number(this.engRequest.MarksObtainedEnglish) > Number(this.engRequest.MaxMarksEnglish)) {

      this.engRequest.PercentageEnglish = '';
      this.engRequest.MarksObtainedEnglish = 0;
      this.toastr.warning('Marks Obtained cannot be greater than Maximum Marks.');
      return;
    }
    if (this.engRequest.MarksTypeIDEnglish == 84) {
      maxMarks = 10
      this.engRequest.MaxMarksEnglish = 10
      this.EnglishQualificationForm.get('MaxMarksEnglish')?.disable();
      if (this.engRequest.MarksObtainedEnglish > 10) {
        this.engRequest.MarksObtainedEnglish = 0;
        this.engRequest.PercentageEnglish = '';
        return
      }
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;
        if (percentage < 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.engRequest.PercentageEnglish = '';
          this.engRequest.MarksObtainedEnglish = 0;
        } else {
          this.engRequest.PercentageEnglish = percentage.toFixed(2);
        }
      } else {
        this.engRequest.PercentageEnglish = '';
      }
    } else if (this.engRequest.MarksTypeIDEnglish == 83) {
      this.EnglishQualificationForm.get('MaxMarksEnglish')?.enable();
      if (maxMarks && marksObtained && Number(marksObtained) <= Number(maxMarks)) {
        const percentage = (marksObtained / maxMarks) * 100;
        if (percentage < 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.engRequest.PercentageEnglish = '';
          this.engRequest.MarksObtainedEnglish = 0;
        } else {
          this.engRequest.PercentageEnglish = percentage.toFixed(2);
        }

      } else {
        this.engRequest.PercentageEnglish = '';
      }
    }
  }

  async EnglishMarksTypeChange() {
    if (this.engRequest.MarksTypeIDEnglish == 84) {
      this.engRequest.MaxMarksEnglish = 10
      this.engRequest.PercentageEnglish = '';
      this.engRequest.MarksObtainedEnglish = 0;
      this.EnglishQualificationForm.get('MaxMarksEnglish')?.disable();
    } else {
      this.engRequest.MaxMarksEnglish = 0
      this.engRequest.PercentageEnglish = '';
      this.engRequest.MarksObtainedEnglish = 0;
      this.EnglishQualificationForm.get('MaxMarksEnglish')?.enable();
    }
  }

  calculatePercentageHigh(): void {

    let maxMarks = this.formData1.MaxMarksHigh;
    const marksObtained = this.formData1.MarksObtainedHigh;
    if (Number(this.formData1.MarksObtainedHigh) > Number(this.formData1.MaxMarksHigh)) {
      this.formData1.PercentageHigh = '';
      this.formData1.MarksObtainedHigh = 0;
      this.toastr.warning('Marks Obtained cannot be greater than Maximum Marks.');
      return;
    }
    if (this.formData1.MarksTypeIDHigh == 84) {
      maxMarks = 10
      this.formData1.MaxMarksHigh = 10
      this.HighestQualificationForm.get('txtMaxMarks')?.disable();
      if (this.formData1.MarksObtainedHigh > 10) {
        this.formData1.MarksObtainedHigh = 0;
        this.formData1.PercentageHigh = '';
        return
      }
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;
        if (percentage < 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData1.PercentageHigh = '';
          this.formData1.MarksObtainedHigh = 0;
        } else {
          this.formData1.PercentageHigh = percentage.toFixed(2);
        }
      } else {
        this.formData1.PercentageHigh = '';
      }
    } else if (this.formData1.MarksTypeIDHigh == 83) {
      this.HighestQualificationForm.get('txtMaxMarks')?.enable();
      if (maxMarks && marksObtained && Number(marksObtained) <= Number(maxMarks)) {
        const percentage = (marksObtained / maxMarks) * 100;
        if (percentage < 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData1.PercentageHigh = '';
          this.formData1.MarksObtainedHigh = 0;
        } else {
          this.formData1.PercentageHigh = percentage.toFixed(2);
        }

      } else {
        this.formData1.PercentageHigh = '';
      }
      if (this.request.SupplementaryDataModel == null) {
        this.request.SupplementaryDataModel = []
      }
    }
  }

  async calculateLateralPercentage() {
    ;
    let maxMarks = this.lateralrequest.AggMaxMark;
    const marksObtained = this.lateralrequest.AggObtMark;
    if (Number(this.lateralrequest.AggObtMark) > Number(this.lateralrequest.AggMaxMark)) {
      this.lateralrequest.Percentage = '';
      this.lateralrequest.AggObtMark = 0;
      this.toastr.warning('Marks Obtained cannot be greater than Maximum Marks.');
      return;
    }
    if (this.lateralrequest.MarkType == 84) {

      maxMarks = 10
      this.lateralrequest.AggMaxMark = 10
      this.LateralQualificationForm.get('txtAggregateMaximumMarks')?.disable();
      if (this.lateralrequest.AggObtMark > 10) {
        this.lateralrequest.AggObtMark = 0;
        this.lateralrequest.Percentage = '';
        return
      }
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
        var percentage = 0.0;
        if (this.lateralrequest.CourseID == 140 && this.lateralrequest.BoardID == 20) {
          percentage = (marksObtained * 10) - 5;
        } else {
          percentage = marksObtained * 9.5;
        }
        if (percentage <= 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.lateralrequest.Percentage = '';
          this.lateralrequest.AggObtMark = 0;
        } else {
          this.lateralrequest.Percentage = percentage.toFixed(2);
        }

      } else {
        this.lateralrequest.Percentage = '';
      }
    } else if (this.lateralrequest.MarkType == 83) {

      this.LateralQualificationForm.get('txtAggregateMaximumMarks')?.enable();
      if (maxMarks && marksObtained && Number(marksObtained) <= Number(maxMarks)) {
        const percentage = (marksObtained / maxMarks) * 100;
        if (percentage <= 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.lateralrequest.Percentage = '';
          this.lateralrequest.AggObtMark = 0;
        } else {
          this.lateralrequest.Percentage = percentage.toFixed(2);
        }
      } else {
        this.lateralrequest.Percentage = '';
      }
      //if (this.request.SupplementaryDataModel == null) {
      //  this.request.SupplementaryDataModel = []
      //}
    }
  }

  calculatePercentageCourseTypeWise(): void {

    this.BoardChange(12)

    if (this.request.CourseType == 2) {
      this.calculatePercentageHigh()
    }

    else if (this.request.CourseType == 4) {
      // this.calculatePercentageDegreeCourse1st2nd()
      this.calculateLateralPercentage()
    }

    else if (this.request.CourseType == 5) {
      this.calculateLateralPercentageCourseType()
    }

    else if (this.request.CourseType == EnumCourseType.Lateral) {
      this.calculateLateralPercentage()
    }

  }

  calculatePercentageDegreeCourse1st2nd(): void {
    ;
    let maxMarks = this.formData1.MaxMarksHigh;
    const marksObtained = this.formData1.MarksObtainedHigh;
    if (Number(this.formData1.MarksObtainedHigh) > Number(this.formData1.MaxMarksHigh)) {
      this.formData1.PercentageHigh = '';
      this.formData1.MarksObtainedHigh = 0;
      this.toastr.warning('Marks Obtained cannot be greater than Maximum Marks.');
      return;
    }
    if (this.formData1.MarksTypeIDHigh == 84) {
      maxMarks = 10
      this.formData1.MaxMarksHigh = 10
      this.HighestQualificationForm.get('txtMaxMarks')?.disable();
      if (this.formData1.MarksObtainedHigh > 10) {
        this.formData1.MarksObtainedHigh = 0;
        this.formData1.PercentageHigh = '';
        return
      }
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;

        if (this.request.CategoryA == EnumCasteCategory.GENERAL) {
          if (percentage < 45) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 45%');
            this.formData1.PercentageHigh = '';
            this.formData1.MarksObtainedHigh = 0;
          } else {
            this.formData1.PercentageHigh = percentage.toFixed(2);
          }
        }
        else {
          if (percentage < 40) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 40%');
            this.formData1.PercentageHigh = '';
            this.formData1.MarksObtainedHigh = 0;
          } else {
            this.formData1.PercentageHigh = percentage.toFixed(2);
          }
        }
      } else {
        this.formData1.PercentageHigh = '';
      }

    } else if (this.formData1.MarksTypeIDHigh == 83) {
      this.HighestQualificationForm.get('txtMaxMarks')?.enable();

      if (maxMarks && marksObtained && Number(marksObtained) <= Number(maxMarks)) {
        const percentage = (marksObtained / maxMarks) * 100;

        // Apply condition based on CourseType
        if (this.request.CategoryA == EnumCasteCategory.GENERAL) {
          if (percentage < 45) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 45%');
            this.formData1.PercentageHigh = '';
            this.formData1.MarksObtainedHigh = 0;
          } else {
            this.formData1.PercentageHigh = percentage.toFixed(2);
          }
        } else {
          if (percentage < 40) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 40%');
            this.formData1.PercentageHigh = '';
            this.formData1.MarksObtainedHigh = 0;
          } else {
            this.formData1.PercentageHigh = percentage.toFixed(2);
          }
        }

      } else {
        this.formData1.PercentageHigh = '';
      }

      if (this.request.SupplementaryDataModel == null) {
        this.request.SupplementaryDataModel = [];
      }
    }
  }

  async calculateLateralPercentageCourseType() {
    ;
    let maxMarks = this.lateralrequest.AggMaxMark;
    const marksObtained = this.lateralrequest.AggObtMark;
    if (Number(this.lateralrequest.AggObtMark) > Number(this.lateralrequest.AggMaxMark)) {
      this.lateralrequest.Percentage = '';
      this.lateralrequest.AggObtMark = 0;
      this.toastr.warning('Marks Obtained cannot be greater than Maximum Marks.');
      return;
    }
    if (this.lateralrequest.MarkType == 84) {

      maxMarks = 10
      this.lateralrequest.AggMaxMark = 10
      this.LateralQualificationForm.get('txtAggregateMaximumMarks')?.disable();
      if (this.lateralrequest.AggObtMark > 10) {
        this.lateralrequest.AggObtMark = 0;
        this.lateralrequest.Percentage = '';
        return
      }
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
        var percentage = 0.0;
        if (this.lateralrequest.CourseID == 140 && this.lateralrequest.BoardID == 20) {
          percentage = (marksObtained * 10) - 5;
        } else {
          percentage = marksObtained * 9.5;
        }

        if (this.request.CategoryA == EnumCasteCategory.GENERAL) {
          if (percentage < 45) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 45%');
            this.lateralrequest.Percentage = '';
            this.lateralrequest.AggObtMark = 0;
          } else {
            this.lateralrequest.Percentage = percentage.toFixed(2);
          }
        }
        else {
          if (percentage < 40) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 40%');
            this.lateralrequest.Percentage = '';
            this.lateralrequest.AggObtMark = 0;
          } else {
            this.lateralrequest.Percentage = percentage.toFixed(2);
          }
        }

      } else {
        this.lateralrequest.Percentage = '';
      }
    } else if (this.lateralrequest.MarkType == 83) {

      this.LateralQualificationForm.get('txtAggregateMaximumMarks')?.enable();
      if (maxMarks && marksObtained && Number(marksObtained) <= Number(maxMarks)) {
        const percentage = (marksObtained / maxMarks) * 100;

        if (this.request.CategoryA == EnumCasteCategory.GENERAL) {
          if (percentage < 45) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 45%');
            this.lateralrequest.Percentage = '';
            this.lateralrequest.AggObtMark = 0;
          } else {
            this.lateralrequest.Percentage = percentage.toFixed(2);
          }
        } else {
          if (percentage < 40) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 40%');
            this.formData1.PercentageHigh = '';
            this.formData1.MarksObtainedHigh = 0;
          } else {
            this.lateralrequest.Percentage = percentage.toFixed(2);
          }
        }
      } else {
        this.lateralrequest.Percentage = '';
      }
      //if (this.request.SupplementaryDataModel == null) {
      //  this.request.SupplementaryDataModel = []
      //}
    }
  }


  async btnRowDelete_OnClick(item: SupplementaryDataModel) {
    try {
      this.loaderService.requestStarted();
      if (confirm("Are you sure you want to delete this ?")) {
        const index: number = this.request.SupplementaryDataModel.indexOf(item);
        if (index != -1) {
          this.request.SupplementaryDataModel.splice(index, 1)
        }
      }
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



  

  async GetMarktYPEDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('MarksType')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.marktypelist = data['Data'];

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


  async GetPassingYearDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.PassingYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ggg');
          this.PassingYearList = data['Data'];

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

  //calculatePercentage(): void {
  //  const maxMarks = this.request.AggMaxMark;
  //  const marksObtained = this.request.AggObtMark;

  //  if (this.request.MarkType == 84) {
  //    if (maxMarks && marksObtained) {
  //      const percentage = marksObtained * 9.5;
  //      this.request.Percentage = percentage.toFixed(2);
  //    } else {
  //      this.request.Percentage = '';
  //    }
  //  } else if (this.request.MarkType == 83) {
  //    if (maxMarks && marksObtained) {
  //      const percentage = (marksObtained / maxMarks) * 100;
  //      this.request.Percentage = percentage.toFixed(2);
  //    } else {
  //      this.request.Percentage = '';
  //    }
  //    if (this.request.SupplementaryDataModel == null) {
  //      this.request.SupplementaryDataModel = []
  //    }
  //  }

  //}



  async OnRemarkChange(dOC: any) {
    if (this.request.VerificationDocumentDetailList.some((x: any) => x.Status != 0)) {
      this.changeshow = false
    } else if (this.request.VerificationDocumentDetailList.every((x: any) => x.Status == 0)) {
      this.changeshow = true
    }
    if (dOC.Status == EnumVerificationAction.Revert) {
      dOC.ShowRemark = true;
    } else {
      dOC.ShowRemark = false;
      dOC.Remark = '';
    }
    this.Isremarkshow = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert);
  }



  async SaveData(Action: number = 0) {

   debugger
    console.log(this.sSOLoginDataModel)
     console.log("this.request.ApplicationID",this.request.ApplicationID)
    //const IsRemarKvalid = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert && x.Remark == '' || x.Status == 0);
    //if (IsRemarKvalid == true) {
    //  /*      this.toastr.error("Please enter valisd Remark")*/
    //  return
    //}
     

    if (Action == 1 || Action==3) {
      if (this.RemarkDocument.length > 0) {
        this.toastr.error("Please Unselect Revert Document Remarks")
        return

      }

    }

    if (Action == 2) {
      if (this.RemarkDocument.length < 1) {
        this.toastr.error("Please Select Revert Document Remarks")
        return

      }

      if (this.request.Remark == '') {
        this.toastr.error("Please Write valid Remarks to Revert the Application")
        return
      }

    }

    //if (Action == 3) {
    //  if (this.request.Remark == '') {
    //    this.toastr.error("Please Write valid Remarks")
    //    return
    //  }
    //} 



    if (!this.RemarkDocument || this.RemarkDocument.length == 0 || Action==3) {
      this.request.VerificationDocumentDetailList.forEach(doc => {
        doc.Status = EnumVerificationAction.Approved; // e.g. 1
      });
    } else {
      const selectedIds = this.RemarkDocument.map((x: any) => x.DocumentMasterID);
      const isOtherDoc = selectedIds.includes(91);
      const isInStudeVerification = this.request.VerificationDocumentDetailList.some((x: any) => x.DocumentMasterID == 91 )

      if(isOtherDoc && !isInStudeVerification){
        this.request.VerificationDocumentDetailList.push({
          DocumentDetailsID: 0,
          DocumentMasterID: 91,
          TransactionID: (this.request.ApplicationID).toString(),
          ColumnName: '',
          TableName: '',
          Status: EnumVerificationAction.Revert,
          Remark: this.request.Remark,
          FileName: 'OtherDocument',
          DisFileName: 'Upload  Other Document',
          Folder: 'Students',
          DocumentID: 0,
          ModifyBy: this.sSOLoginDataModel.UserID,
          GroupNo: 0
        })
      }


      this.request.VerificationDocumentDetailList.forEach(doc => {
        if (selectedIds.includes(doc.DocumentMasterID)) {
          doc.Status = EnumVerificationAction.Revert; // e.g. 3
          if(doc.DocumentMasterID!=91){
            doc.Remark = this.RemarkDocument.find((f: any) => f.DocumentMasterID === doc.DocumentMasterID)?.DisFileName || '';
          }
 
        } else {
          doc.Status = EnumVerificationAction.Approved; // e.g. 1
        }
      });
    }


     
    if (this.BackupCatoryA != this.request.CategoryA && this.request.CategoryA != EnumCasteCategory.GENERAL) {

      var DocumentMasterId = 0
      if (this.request.CategoryA == EnumCasteCategory.EWS) {
        DocumentMasterId = 35
      } else if (this.request.CategoryA == EnumCasteCategory.SC) {
        DocumentMasterId = 36
      } else if (this.request.CategoryA == EnumCasteCategory.ST) {
        DocumentMasterId = 37
      } else if (this.request.CategoryA == EnumCasteCategory.OBC) {
        DocumentMasterId = 38
      } else if (this.request.CategoryA == EnumCasteCategory.MBC) {
        DocumentMasterId = 39
      }

      if (this.FileName != '') {
        this.request.VerificationDocumentDetailList.push({
          DocumentDetailsID: 0,
          DocumentMasterID: DocumentMasterId,
          TransactionID: (this.request.ApplicationID).toString(),
          ColumnName: '',
          TableName: '',
          Status: EnumVerificationAction.Approved,
          Remark: this.request.Remark,
          FileName: this.FileName,
          DisFileName: this.DisFile,
          Folder: 'Students',
          DocumentID: 0,
          ModifyBy: this.sSOLoginDataModel.UserID,
          GroupNo: 0
        })
      }
    }




    this.Isremarkshow = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert);

/*    console.log(this.request.VerificationDocumentDetailList,"VerificationDocumentDetailList")*/

    if (this.Isremarkshow == true)
    {
      this.request.status = EnumVerificationAction.Revert
 /*     this.request.Remark = 'Revert'*/
    }
    else
    {
      this.request.status = EnumVerificationAction.Approved
/*      this.request.Remark = 'Approved'*/
    }


    if (Action == 3) {
      this.request.status = EnumVerificationAction.Accept_with_deficiency
  /*    this.request.Remark = 'Accept_with_deficiency'*/
    }

/*    this.updateRemarkText1();*/

    const confirmationMessage =
      this.request.status === EnumVerificationAction.Approved
        ? "Are you sure you want to Approve?"
        : "Are you sure you want to Mark Deficiency?";

    this.isSubmitted = true;
    this.request.RoleID = this.sSOLoginDataModel.RoleID;
    if (this.request.DepartmentID == EnumDepartment.BTER) {
      this.refereshDepartmentValidator(true)
    } else {
      this.refereshDepartmentValidator(false)
    }  

    if (this.request.CategoryA == EnumCasteCategory.OBC || this.request.CategoryA == EnumCasteCategory.MBC || this.request.CategoryA == EnumCasteCategory.EWS) {
      this.refreshBranchRefValidation(true)
    } else {
      this.refreshBranchRefValidation(false)
      this.request.CasteCertificateNo = '';
    }

    if (this.request.CategoryA == EnumCasteCategory.MBC) {
      // this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.setValidators(DropdownValidators1);
      this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.updateValueAndValidity();

    } else {
      this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.updateValueAndValidity();
    }

    if (this.request.ENR_ID == 6) {
      this.refreshDepartmentNameRefValidation(true)
    } else {
      this.refreshDepartmentNameRefValidation(false)
    }  

    if (this.request.CategoryA == 3) {
      this.StudentJanDetailFormGroup.get('subCategory')?.clearValidators();
      if (this.request.subCategory == 1) {
        this.request.IsTSP = true
        this.request.IsSaharia = false
      } else if (this.request.subCategory == 2) {
        this.request.IsSaharia = true
        this.request.IsTSP = false
        this.request.TspDistrictID = 0
        this.request.TSPTehsilID = 0
      } else if (this.request.subCategory == 3) {
        this.request.IsTSP = false
        this.request.IsSaharia = false
        this.request.TspDistrictID = 0
        this.request.TSPTehsilID = 0
      } else {
        this.StudentJanDetailFormGroup.get('subCategory')?.setValidators(DropdownValidators1);
      
      }
      this.StudentJanDetailFormGroup.get('subCategory')?.updateValueAndValidity();
    }

    if (this.request.IsTSP == true) {
      if (this.request.TspDistrictID == 0 || this.request.TspDistrictID == null || this.request.TspDistrictID == undefined) {
        this.StudentJanDetailFormGroup.get('TspDistrictID')?.setValidators(DropdownValidators1);
        this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();
      
      }
    } else {
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.clearValidators();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();
      this.request.TspDistrictID = 0
    }

    if (this.request.IndentyProff == 1 && this.request.DetailID.length < 12) {
      this.toastr.warning("Invalid Aadhar Number");
      //return
    } else if (this.request.IndentyProff == 2 && this.request.DetailID.length < 14) {
      this.toastr.warning("Invalid Aadhar Enrollment ID");
      //return
    }

    this.loaderService.requestStarted();
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.DepartmentID =1;
    this.request.SSOID = this.sSOLoginDataModel.SSOID;

    if (this.request.ENR_ID == 5) {
      this.request.IsRajasthani = true
    } else {
      this.request.IsRajasthani = false
    }

    if (this.request.PrefentialCategoryType == 2) {
      this.request.CategoryA = 1
      this.request.CategoryB = 0
      this.request.CategoryC = 0
      this.request.CategoryD = 0
      this.request.CategoryE = 0
      this.request.IsPH = '0'
      this.request.IsTSP = false
      this.request.IsDevnarayan = 0
      this.request.IsEws = 0
      this.request.IsRajasthani = false
      this.request.DevnarayanTehsilID = 0
      this.request.DevnarayanDistrictID = 0
      this.request.TSPTehsilID = 0
      this.request.TspDistrictID = 0
      ///this.StudentJanDetailFormGroup.get('ddlCategoryA')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategoryD')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.clearValidators();
      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.clearValidators();
      //this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.clearValidators();
      //this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.clearValidators();
      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.clearValidators();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.clearValidators();


      //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();
    }
    else {
      //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.setValidators(Validators.required);
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.setValidators(DropdownValidators1);
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.setValidators(DropdownValidatorsString1);
      //this.StudentJanDetailFormGroup.get('ddlCategoryD')?.setValidators(DropdownValidators1);
      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.setValidators(DropdownValidators1);


      //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.updateValueAndValidity();

      if (this.request.Gender != 97 && this.request.Maritial != 62) {
        this.StudentJanDetailFormGroup.get('ddlCategoryD')?.setValidators(DropdownValidators1);

      } else {
        this.StudentJanDetailFormGroup.get('ddlCategoryD')?.clearValidators();
        this.request.CategoryD = 0;
      }
      this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.clearValidators();
      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();

      //if (this.request.CategoryA == 5) {
      //  this.StudentJanDetailFormGroup.get('IsDevnarayan')?.setValidators([DropdownValidators]);
      //  this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();
      //}

    }

    //if (this.request.CategoryA != 5 ||  this.request.IsDevnarayan == 0) {
    //  this.request.IsDevnarayan = 0
    //  this.request.DevnarayanTehsilID = 0
    //  this.request.DevnarayanDistrictID = 0

    //  this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.clearValidators();
    //  this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.clearValidators();

    //  this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();
    //  this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.updateValueAndValidity();
    //  this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.updateValueAndValidity();

    //}

    //if (this.request.CategoryA == 5 && this.request.IsDevnarayan == 1) {
    //  this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.setValidators([DropdownValidators]);
    //  this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.setValidators([DropdownValidators]);

    //  this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.updateValueAndValidity();
    //  this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.updateValueAndValidity();

    //}

    if (this.request.CategoryA != 3 || (this.request.CategoryA == 3 && (this.request.subCategory == 2 || this.request.subCategory == 3))) {
      this.request.IsTSP = false
      this.request.TSPTehsilID = 0
      this.request.TspDistrictID = 0
      this.StudentJanDetailFormGroup.get('subCategory')?.clearValidators();
      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.clearValidators();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.clearValidators();

      this.StudentJanDetailFormGroup.get('subCategory')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();

    }

    if (this.request.CategoryA == 3 && this.request.IsTSP == true) {
      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.setValidators(Validators.required);
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.setValidators(Validators.required);  

      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();
    }
    //new Date(x.To_Date)
    console.log(this.findInvalidFormControls(this.StudentJanDetailFormGroup));
    if (this.StudentJanDetailFormGroup.invalid) {
      this.toastr.error('fill required details');
      //Object.keys(this.StudentJanDetailFormGroup.controls).forEach(key => {
      //  const control = this.StudentJanDetailFormGroup.get(key);

      //  if (control && control.invalid) {
      //    this.toastr.error(`Control ${key} is invalid`);
      //    Object.keys(control.errors!).forEach(errorKey => {
      //      this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
      //    });
      //  }
      //});
      return;
    }

    await this.RefreshValidators()
    if (this.QualificationForm.invalid) {
      return
    }
    if (this.request.BoardID != 38) {
      this.request.BoardExamID = 0
      this.request.BoardStateID = 0
    }
    debugger
    if (this.request.CourseType == 2) {
      this.isSub = true;
      this.HighestQualificationForm.get('txtHighestQualification')?.setValidators([DropdownValidatorsString]);
      this.request.HighestQualificationModel = [];
      await this.RefreshValidators()      

      if (this.request.CourseType != 2 && this.nonEngHighQuali != '') {
        if (this.HighestQualificationForm.invalid) {
          this.toastr.warning("Please Fill Highest Qualification Form Properly")

          //Object.keys(this.HighestQualificationForm.controls).forEach(key => {
          //  const control = this.HighestQualificationForm.get(key);
          //   if (control && control.invalid) {
          //     this.toastr.error(`Control ${key} is invalid`);
          //     Object.keys(control.errors!).forEach(errorKey => {
          //       this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
          //     });
          //   }
          // });

          return
        }
      }

      if (this.request.CourseType != 2 && this.nonEngHighQuali != '') {
        if (this.formData1.HighestQualificationHigh == '') {
          this.toastr.warning("Please Select Highest Qualification")
          return
        }
      }

      this.HighQualificationList = []
      if (this.formData1.BoardID != 38) {
        this.formData1.BoardStateID = 0
        this.formData1.BoardExamID = 0
      }
      if (this.nonEngHighQuali != '12') {
        this.formData1.BoardID = 0
      } else if (this.nonEngHighQuali == '12') {
        this.formData1.UniversityBoard = ''
      }
      // if (this.request.CourseType == 4 && this.formData1.StateIDHigh == 6) {
      //   this.formData1.HighestQualificationHigh = 'D-Voc'
      // }
      this.HighQualificationList.push(
        {
          UniversityBoard: this.formData1.UniversityBoard,
          SchoolCollegeHigh: this.formData1.SchoolCollegeHigh,
          HighestQualificationHigh: this.formData1.HighestQualificationHigh,
          YearofPassingHigh: this.formData1.YearofPassingHigh,
          RollNumberHigh: this.formData1.RollNumberHigh,
          MarksTypeIDHigh: this.formData1.MarksTypeIDHigh,
          MaxMarksHigh: this.formData1.MaxMarksHigh,
          PercentageHigh: this.formData1.PercentageHigh,
          MarksObtainedHigh: this.formData1.MarksObtainedHigh,
          ClassSubject: this.formData1.ClassSubject,
          BoardID: this.formData1.BoardID,
          BoardStateID: this.formData1.BoardStateID,
          BoardExamID: this.formData1.BoardExamID,
          ApplicationQualificationId: this.formData1.ApplicationQualificationId,
          StateIDHigh: this.formData1.StateIDHigh
        },
      );

      // this.request.ApplicationID = this.sSOLoginDataModel.ApplicationID;
      this.request.HighestQualificationModel = this.HighQualificationList
      // this.AddMore()
    }

    if (this.request.CourseType == 2 && this.nonEngHighQuali != '') {

      this.isSub = true;
      this.request.HighestQualificationModel = [];
      this.formData1.HighestQualificationHigh = this.nonEngHighQuali


      //if (this.HighestQualificationForm.invalid) {
      //  this.toastr.warning("Please Fill Highest Qualification Form Properly")
      //  return
      //}

      if (this.formData1.StateIDHigh == 0 && this.nonEngHighQuali == '12') {
        this.toastr.warning("Please Select State of Study")
        return
      }

      if (Number(this.request.Percentage) > Number(this.formData1.PercentageHigh)) {
        this.toastr.warning("Highest Qualification Percentage should be greater then 10th Qualification Percentage")
        return
      }

      if (this.nonEngHighQuali != '12') {
        this.formData1.StateIDHigh = 0
      } else if (this.nonEngHighQuali == '12' && this.formData1.StateIDHigh == 0) {
        this.toastr.warning("Please Select State of Study for Highest qualification")
        return
      }
 
      this.HighQualificationList = []
      this.HighQualificationList.push({
        UniversityBoard: this.formData1.UniversityBoard,
        SchoolCollegeHigh: this.formData1.SchoolCollegeHigh,
        HighestQualificationHigh: this.formData1.HighestQualificationHigh,
        YearofPassingHigh: this.formData1.YearofPassingHigh,
        RollNumberHigh: this.formData1.RollNumberHigh,
        MarksTypeIDHigh: this.formData1.MarksTypeIDHigh,
        MaxMarksHigh: this.formData1.MaxMarksHigh,
        PercentageHigh: this.formData1.PercentageHigh,
        MarksObtainedHigh: this.formData1.MarksObtainedHigh,
        ClassSubject: this.formData1.ClassSubject,
        ApplicationQualificationId: this.formData1.ApplicationQualificationId,
        StateIDHigh: this.formData1.StateIDHigh,
        BoardID: this.formData1.BoardID,
        BoardStateID: this.formData1.BoardStateID,
        BoardExamID: this.formData1.BoardExamID,
      },
      );

      this.request.HighestQualificationModel = this.HighQualificationList
    } else if (this.request.CourseType == 2 && this.nonEngHighQuali == '') {
      this.formData1 = new HighestQualificationModel()
      this.request.HighestQualificationModel = [];
    }


    if (this.HighQualificationList.length == 0 && this.request.CourseType == 2 && this.nonEngHighQuali != '') {
      this.toastr.error("Please Fill HighQualification Form")
      return
    }


    if (this.request.IsSupplement == true) {
      if (this.request.SupplementaryDataModel.length < 1) {
        this.toastr.error("please Add Supplementry details")
        return
      }
    }

    this.request.LateralEntryQualificationModel = []

    if (this.request.CourseType == EnumCourseType.Lateral || this.request.CourseType == 5) {
      await this.RefreshValidators()
      if (this.LateralQualificationForm.invalid) {

        // Object.keys(this.LateralQualificationForm.controls).forEach(key => {
        //  const control = this.LateralQualificationForm.get(key);
        //   if (control && control.invalid) {
        //     this.toastr.error(`Control ${key} is invalid`);
        //     Object.keys(control.errors!).forEach(errorKey => {
        //       this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
        //     });
        //   }
        // });

        return
      }
      //if (this.lateralrequest.CourseID == EnumLateralCourse.Diploma_Engineering) {
      //  if (this.SubjectID.length != 1) {
      //    this.toastr.error("Please Select Only One Stream")
      //    this.isSubmitted = false
      //    return
      //  }

      //}

      //else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
      //  if (this.SubjectID.length != 3) {
      //    this.toastr.error("Please Select 3 Subjects")
      //    this.isSubmitted = false
      //    return
      //  }

      //}

      //  
      // if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
      //   const selectedCount = this.SubjectID?.length || 0;

      //   if (selectedCount < 2 || selectedCount > 3) {
      //     this.toastr.error("Please select Minimum 2 subjects and Maximum 3 subjects.");
      //     this.isSubmitted = false;
      //     return;
      //   }
      // }


     


      if (this.lateralrequest.BoardID != 38) {
        this.lateralrequest.BoardStateID = 0
        this.lateralrequest.BoardExamID = 0
      }
      if (this.lateralrequest.CourseID == 141) {
        this.lateralrequest.BoardID = 0
      }


      if (this.request.CourseType == 5) {
        this.SubjectID = []
      }

      if (this.lateralrequest.CourseID == 141) {
        this.lateralrequest.BoardID = 0
      }
      if (this.lateralrequest.CourseID != 141 && this.lateralrequest.BoardID != 38) {
        this.lateralrequest.BoardName = ''
      }
      if (!this.ShowOtherBoard12th && this.lateralrequest.CourseID != 143) {
        this.lateralrequest.BoardStateID = 0
        this.lateralrequest.BoardExamID = 0
      }

      if (this.lateralrequest.CourseID == 140 || this.lateralrequest.CourseID == 141 || this.lateralrequest.CourseID == 142) {
        this.SubjectID = []
      }



      if (this.lateralrequest.CourseID == 143) {
        this.lateralrequest.ClassSubject = ''
      }



      this.SubjectID.forEach(e => e.CourseID = this.lateralrequest.CourseID)
      this.request.LateralEntryQualificationModel.push({
        CourseID: this.lateralrequest.CourseID,
        SubjectID: this.SubjectID,
        BoardID: this.lateralrequest.BoardID,
        BoardName: this.lateralrequest.BoardName,
        ClassSubject: this.lateralrequest.ClassSubject,
        PassingID: this.lateralrequest.PassingID,
        AggMaxMark: this.lateralrequest.AggMaxMark,
        AggObtMark: this.lateralrequest.AggObtMark,
        Percentage: this.lateralrequest.Percentage,
        Qualification: this.lateralrequest.Qualification,
        RollNumber: this.lateralrequest.RollNumber,
        StateID: this.lateralrequest.StateID,
        MarkType: this.lateralrequest.MarkType,
        BoardStateID: this.lateralrequest.BoardStateID,
        BoardExamID: this.lateralrequest.BoardExamID,
        ApplicationQualificationId: this.lateralrequest.ApplicationQualificationId
      });
    }

    if(this.request.CourseType == 4) {


      await this.RefreshValidators()
      if (this.LateralQualificationForm.invalid) {
        this.toastr.error("Please fill all mandatory fields")
        
        return
      }
      if(this.request.CourseType == 4 && this.lateralrequest.CourseID ==280){
        if(this.EnglishQualificationForm.invalid){
          this.toastr.error("Please fill all mandatory fields")
          return
        }
      }

      this.request.LateralEntryQualificationModel = []

      if (this.lateralrequest.BoardID != 38) {
        this.lateralrequest.BoardStateID = 0
        this.lateralrequest.BoardExamID = 0
      }
      if (this.lateralrequest.CourseID == 141 || this.lateralrequest.CourseID == 279) {
        this.lateralrequest.BoardID = 0
      }

      if (this.lateralrequest.CourseID == 141 || this.lateralrequest.CourseID == 279) {
        this.lateralrequest.BoardID = 0
      }
      if ((this.lateralrequest.CourseID != 141 && this.lateralrequest.CourseID != 279) && this.lateralrequest.BoardID != 38) {
        this.lateralrequest.BoardName = ''
      }
      if (!this.ShowOtherBoard12th && (this.lateralrequest.CourseID != 143 && this.lateralrequest.CourseID != 281)) {
        this.lateralrequest.BoardStateID = 0
        this.lateralrequest.BoardExamID = 0
      }

      if (this.lateralrequest.CourseID == 278 || this.lateralrequest.CourseID == 279 || this.lateralrequest.CourseID == 280 || this.lateralrequest.CourseID == 281) {
        this.SubjectID = []
      }


      // if (this.lateralrequest.CourseID == 143 || this.lateralrequest.CourseID == 281) {
      //   this.lateralrequest.ClassSubject = ''
      // }

      this.SubjectID.forEach(e => e.CourseID = this.lateralrequest.CourseID)
      this.request.LateralEntryQualificationModel.push({
        CourseID: this.lateralrequest.CourseID,
        SubjectID: this.SubjectID,
        BoardID: this.lateralrequest.BoardID,
        BoardName: this.lateralrequest.BoardName,
        ClassSubject: this.lateralrequest.ClassSubject,
        PassingID: this.lateralrequest.PassingID,
        AggMaxMark: this.lateralrequest.AggMaxMark,
        AggObtMark: this.lateralrequest.AggObtMark,
        Percentage: this.lateralrequest.Percentage,
        Qualification: this.lateralrequest.Qualification,
        RollNumber: this.lateralrequest.RollNumber,
        StateID: this.lateralrequest.StateID,
        MarkType: this.lateralrequest.MarkType,
        BoardStateID: this.lateralrequest.BoardStateID,
        BoardExamID: this.lateralrequest.BoardExamID,
        ApplicationQualificationId: this.lateralrequest.ApplicationQualificationId
      });


      if(this.request.CourseType == 4 && this.lateralrequest.CourseID == 280) {
        this.HighQualificationList = []
        this.HighQualificationList.push({
          UniversityBoard: this.engRequest.UniversityBoardEnglish,
          SchoolCollegeHigh: this.engRequest.SchoolCollegeEnglish,
          HighestQualificationHigh: 'English',
          YearofPassingHigh: this.engRequest.YearofPassingEnglish,
          RollNumberHigh: this.engRequest.RollNumberEnglish,
          MarksTypeIDHigh: this.engRequest.MarksTypeIDEnglish,
          MaxMarksHigh: this.engRequest.MaxMarksEnglish,
          PercentageHigh: this.engRequest.PercentageEnglish,
          MarksObtainedHigh: this.engRequest.MarksObtainedEnglish,
          ApplicationQualificationId: this.engRequest.ApplicationQualificationId,
          StateIDHigh: this.engRequest.StateOfStudyEnglish,
        },
        );

        this.request.HighestQualificationModel = this.HighQualificationList
      } else {
        this.request.HighestQualificationModel = []
      }


    }

    console.log(this.request.LateralEntryQualificationModel)

    this.request.LateralCourseID = this.lateralrequest.CourseID
    /*    this.request.CourseType = this.sSOLoginDataModel.Eng_NonEng*/
    this.request.ModifyBy = this.sSOLoginDataModel.UserID

  
    this.request.QualificationID = 10

    this.swat.Confirmation(confirmationMessage, async (result: any) => {
      if (result.isConfirmed) {

        this.loaderService.requestStarted();
        try {
          await this.ApplicationService.Save_Documentscrutiny(this.request)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data);
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                this.router.navigate(['/StudentVerificationList'])
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }

            }, (error: any) => console.error(error)
            );
        }
        catch (ex) { console.log(ex) }
        finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    })
  }

  async SaveDataOLD() {

    const IsRemarKvalid = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert && x.Remark == '' || x.Status == 0);
    if (IsRemarKvalid == true) {
      /*      this.toastr.error("Please enter valisd Remark")*/
      return
    }


    this.Isremarkshow = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert);
    if (this.Isremarkshow == true) {
      this.request.status = EnumVerificationAction.Revert
      this.request.Remark = 'Revert'
    } else {
      this.request.status = EnumVerificationAction.Approved
      this.request.Remark = 'Approved'
    }

    const confirmationMessage =
      this.request.status === EnumVerificationAction.Approved
        ? "Are you sure you want to Approve?"
        : "Are you sure you want to Revert?";


    this.isSubmitted = true;
    this.request.RoleID = this.sSOLoginDataModel.RoleID;
    if (this.request.DepartmentID == EnumDepartment.BTER) {
      this.refereshDepartmentValidator(true)
    } else {
      this.refereshDepartmentValidator(false)
    }



    if (this.request.CategoryA == EnumCasteCategory.OBC || this.request.CategoryA == EnumCasteCategory.MBC || this.request.CategoryA == EnumCasteCategory.EWS) {
      this.refreshBranchRefValidation(true)
    } else {
      this.refreshBranchRefValidation(false)
      this.request.CasteCertificateNo = '';
    }

    if (this.request.CategoryA == EnumCasteCategory.MBC) {
      this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.setValidators(DropdownValidators1);
      this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.updateValueAndValidity();

    } else {
      this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.updateValueAndValidity();
    }

    if (this.request.ENR_ID == 6) {
      this.refreshDepartmentNameRefValidation(true)
    } else {
      this.refreshDepartmentNameRefValidation(false)
    }



    if (this.request.CategoryA == 3) {
      this.StudentJanDetailFormGroup.get('subCategory')?.clearValidators();
      if (this.request.subCategory == 1) {
        this.request.IsTSP = true
        this.request.IsSaharia = false
      } else if (this.request.subCategory == 2) {
        this.request.IsSaharia = true
        this.request.IsTSP = false
        this.request.TspDistrictID = 0
        this.request.TSPTehsilID = 0
      } else if (this.request.subCategory == 3) {
        this.request.IsTSP = false
        this.request.IsSaharia = false
        this.request.TspDistrictID = 0
        this.request.TSPTehsilID = 0
      } else {
        this.StudentJanDetailFormGroup.get('subCategory')?.setValidators(DropdownValidators1);

      }
      this.StudentJanDetailFormGroup.get('subCategory')?.updateValueAndValidity();


    }



    if (this.request.IsTSP == true) {
      if (this.request.TspDistrictID == 0 || this.request.TspDistrictID == null || this.request.TspDistrictID == undefined) {
        this.StudentJanDetailFormGroup.get('TspDistrictID')?.setValidators(DropdownValidators1);
        this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();

      }
    } else {
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.clearValidators();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();
      this.request.TspDistrictID = 0
    }

    if (this.request.IndentyProff == 1 && this.request.DetailID.length < 12) {
      this.toastr.warning("Invalid Aadhar Number");
      //return
    } else if (this.request.IndentyProff == 2 && this.request.DetailID.length < 14) {
      this.toastr.warning("Invalid Aadhar Enrollment ID");
      //return
    }




    this.loaderService.requestStarted();
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.DepartmentID = 1;
    this.request.SSOID = this.sSOLoginDataModel.SSOID;

    if (this.request.ENR_ID == 5) {
      this.request.IsRajasthani = true
    } else {
      this.request.IsRajasthani = false
    }



    if (this.request.PrefentialCategoryType == 2) {
      this.request.CategoryA = 1
      this.request.CategoryB = 0
      this.request.CategoryC = 0
      this.request.CategoryD = 0
      this.request.CategoryE = 0
      this.request.IsPH = '0'
      this.request.IsTSP = false
      this.request.IsDevnarayan = 0
      this.request.IsEws = 0
      this.request.IsRajasthani = false
      this.request.DevnarayanTehsilID = 0
      this.request.DevnarayanDistrictID = 0
      this.request.TSPTehsilID = 0
      this.request.TspDistrictID = 0
      ///this.StudentJanDetailFormGroup.get('ddlCategoryA')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategoryD')?.clearValidators();
      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.clearValidators();
      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.clearValidators();
      //this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.clearValidators();
      //this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.clearValidators();
      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.clearValidators();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.clearValidators();


      //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();




    }
    else {

      //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.setValidators(Validators.required);
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.setValidators(DropdownValidators1);
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.setValidators(DropdownValidatorsString1);
      //this.StudentJanDetailFormGroup.get('ddlCategoryD')?.setValidators(DropdownValidators1);
      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.setValidators(DropdownValidators1);


      //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.updateValueAndValidity();

      if (this.request.Gender != 97 && this.request.Maritial != 62) {
        this.StudentJanDetailFormGroup.get('ddlCategoryD')?.setValidators(DropdownValidators1);

      } else {
        this.StudentJanDetailFormGroup.get('ddlCategoryD')?.clearValidators();
        this.request.CategoryD = 0;
      }
      this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.clearValidators();
      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();

      //if (this.request.CategoryA == 5) {
      //  this.StudentJanDetailFormGroup.get('IsDevnarayan')?.setValidators([DropdownValidators]);
      //  this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();
      //}

    }

    //if (this.request.CategoryA != 5 ||  this.request.IsDevnarayan == 0) {
    //  this.request.IsDevnarayan = 0
    //  this.request.DevnarayanTehsilID = 0
    //  this.request.DevnarayanDistrictID = 0

    //  this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.clearValidators();
    //  this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.clearValidators();

    //  this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();
    //  this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.updateValueAndValidity();
    //  this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.updateValueAndValidity();

    //}

    //if (this.request.CategoryA == 5 && this.request.IsDevnarayan == 1) {
    //  this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.setValidators([DropdownValidators]);
    //  this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.setValidators([DropdownValidators]);

    //  this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.updateValueAndValidity();
    //  this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.updateValueAndValidity();

    //}

    if (this.request.CategoryA != 3 || (this.request.CategoryA == 3 && (this.request.subCategory == 2 || this.request.subCategory == 3))) {
      this.request.IsTSP = false
      this.request.TSPTehsilID = 0
      this.request.TspDistrictID = 0
      this.StudentJanDetailFormGroup.get('subCategory')?.clearValidators();
      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.clearValidators();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.clearValidators();

      this.StudentJanDetailFormGroup.get('subCategory')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();

    }


    if (this.request.CategoryA == 3 && this.request.IsTSP == true) {
      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.setValidators(Validators.required);
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.setValidators(Validators.required);

      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.updateValueAndValidity();
      this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();
    }




    //new Date(x.To_Date)



    if (this.StudentJanDetailFormGroup.invalid) {
      this.toastr.error('fill required detals');
      //Object.keys(this.StudentJanDetailFormGroup.controls).forEach(key => {
      //  const control = this.StudentJanDetailFormGroup.get(key);

      //  if (control && control.invalid) {
      //    this.toastr.error(`Control ${key} is invalid`);
      //    Object.keys(control.errors!).forEach(errorKey => {
      //      this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
      //    });
      //  }
      //});
      return;
    }


    await this.RefreshValidators()
    if (this.QualificationForm.invalid) {
      return
    }
    if (this.request.BoardID != 38) {
      this.request.BoardExamID = 0
      this.request.BoardStateID = 0
    }


    if (this.request.CourseType == 4 || this.request.CourseType == 2) {
      this.isSub = true;
      this.HighestQualificationForm.get('txtHighestQualification')?.setValidators([DropdownValidatorsString]);
      this.request.HighestQualificationModel = [];
      await this.RefreshValidators()

      if (this.request.CourseType == 4) {
        if (this.HighestQualificationForm.invalid) {
          this.toastr.warning("Please Fill Highest Qualification Form Properly")

          //Object.keys(this.HighestQualificationForm.controls).forEach(key => {
          //  const control = this.HighestQualificationForm.get(key);
          //   if (control && control.invalid) {
          //     this.toastr.error(`Control ${key} is invalid`);
          //     Object.keys(control.errors!).forEach(errorKey => {
          //       this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
          //     });
          //   }
          // });

          return
        }
      }

      if (this.request.CourseType != 2 && this.nonEngHighQuali != '') {
        if (this.HighestQualificationForm.invalid) {
          this.toastr.warning("Please Fill Highest Qualification Form Properly")

          //Object.keys(this.HighestQualificationForm.controls).forEach(key => {
          //  const control = this.HighestQualificationForm.get(key);
          //   if (control && control.invalid) {
          //     this.toastr.error(`Control ${key} is invalid`);
          //     Object.keys(control.errors!).forEach(errorKey => {
          //       this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
          //     });
          //   }
          // });

          return
        }
      }

      if (this.request.CourseType != 2 && this.nonEngHighQuali != '') {
        if (this.formData1.HighestQualificationHigh == '') {
          this.toastr.warning("Please Select Highest Qualification")
          return
        }
      }

      this.HighQualificationList = []
      if (this.formData1.BoardID != 38) {
        this.formData1.BoardStateID = 0
        this.formData1.BoardExamID = 0
      }
      if (this.nonEngHighQuali != '12') {
        this.formData1.BoardID = 0
      } else if (this.nonEngHighQuali == '12') {
        this.formData1.UniversityBoard = ''
      }
      if (this.request.CourseType == 4 && this.formData1.StateIDHigh == 6) {
        this.formData1.HighestQualificationHigh = 'D-Voc'
      }
      this.HighQualificationList.push(
        {
          UniversityBoard: this.formData1.UniversityBoard,
          SchoolCollegeHigh: this.formData1.SchoolCollegeHigh,
          HighestQualificationHigh: this.formData1.HighestQualificationHigh,
          YearofPassingHigh: this.formData1.YearofPassingHigh,
          RollNumberHigh: this.formData1.RollNumberHigh,
          MarksTypeIDHigh: this.formData1.MarksTypeIDHigh,
          MaxMarksHigh: this.formData1.MaxMarksHigh,
          PercentageHigh: this.formData1.PercentageHigh,
          MarksObtainedHigh: this.formData1.MarksObtainedHigh,
          ClassSubject: this.formData1.ClassSubject,
          BoardID: this.formData1.BoardID,
          BoardStateID: this.formData1.BoardStateID,
          BoardExamID: this.formData1.BoardExamID,
          ApplicationQualificationId: this.formData1.ApplicationQualificationId,
          StateIDHigh: this.formData1.StateIDHigh
        },
      );

      // this.request.ApplicationID = this.sSOLoginDataModel.ApplicationID;
      this.request.HighestQualificationModel = this.HighQualificationList
      // this.AddMore()
    }

    if (this.request.CourseType == 2 && this.nonEngHighQuali != '') {

      this.isSub = true;
      this.request.HighestQualificationModel = [];
      this.formData1.HighestQualificationHigh = this.nonEngHighQuali


      //if (this.HighestQualificationForm.invalid) {
      //  this.toastr.warning("Please Fill Highest Qualification Form Properly")
      //  return
      //}

      if (this.formData1.StateIDHigh == 0 && this.nonEngHighQuali == '12') {
        this.toastr.warning("Please Select State of Study")
        return
      }

      if (Number(this.request.Percentage) > Number(this.formData1.PercentageHigh)) {
        this.toastr.warning("Highest Qualification Percentage should be greater then 10th Qualification Percentage")
        return
      }

      if (this.nonEngHighQuali != '12') {
        this.formData1.StateIDHigh = 0
      } else if (this.nonEngHighQuali == '12' && this.formData1.StateIDHigh == 0) {
        this.toastr.warning("Please Select State of Study for Highest qualification")
        return
      }

      this.HighQualificationList = []
      this.HighQualificationList.push({
        UniversityBoard: this.formData1.UniversityBoard,
        SchoolCollegeHigh: this.formData1.SchoolCollegeHigh,
        HighestQualificationHigh: this.formData1.HighestQualificationHigh,
        YearofPassingHigh: this.formData1.YearofPassingHigh,
        RollNumberHigh: this.formData1.RollNumberHigh,
        MarksTypeIDHigh: this.formData1.MarksTypeIDHigh,
        MaxMarksHigh: this.formData1.MaxMarksHigh,
        PercentageHigh: this.formData1.PercentageHigh,
        MarksObtainedHigh: this.formData1.MarksObtainedHigh,
        ClassSubject: this.formData1.ClassSubject,
        ApplicationQualificationId: this.formData1.ApplicationQualificationId,
        StateIDHigh: this.formData1.StateIDHigh,
        BoardID: this.formData1.BoardID,
        BoardStateID: this.formData1.BoardStateID,
        BoardExamID: this.formData1.BoardExamID,
      },
      );



      this.request.HighestQualificationModel = this.HighQualificationList
    } else if (this.request.CourseType == 2 && this.nonEngHighQuali == '') {
      this.formData1 = new HighestQualificationModel()
    }


    if (this.HighQualificationList.length == 0 && this.request.CourseType == 2 && this.nonEngHighQuali != '') {
      this.toastr.error("Please Fill HighQualification Form")
      return
    }

    if (this.HighQualificationList.length == 0 && this.request.CourseType == 4) {
      this.toastr.error("Please Fill HighQualification Form")
      return
    }


    if (this.request.IsSupplement == true) {
      if (this.request.SupplementaryDataModel.length < 1) {
        this.toastr.error("please Add Supplementry details")
        return
      }
    }

    this.request.LateralEntryQualificationModel = []



    if (this.request.CourseType == EnumCourseType.Lateral || this.request.CourseType == 5) {
      await this.RefreshValidators()




      if (this.LateralQualificationForm.invalid) {


        //Object.keys(this.LateralQualificationForm.controls).forEach(key => {
        //  const control = this.LateralQualificationForm.get(key);
        //   if (control && control.invalid) {
        //     this.toastr.error(`Control ${key} is invalid`);
        //     Object.keys(control.errors!).forEach(errorKey => {
        //       this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
        //     });
        //   }
        // });

        return
      }
      if (this.lateralrequest.CourseID == EnumLateralCourse.Diploma_Engineering) {
        if (this.SubjectID.length != 1) {
          this.toastr.error("Please Select Only One Stream")
          this.isSubmitted = false
          return
        }

      }

      //else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
      //  if (this.SubjectID.length != 3) {
      //    this.toastr.error("Please Select 3 Subjects")
      //    this.isSubmitted = false
      //    return
      //  }

      //}

      else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
        const selectedCount = this.SubjectID?.length || 0;

        if (selectedCount < 2 || selectedCount > 3) {
          this.toastr.error("Please select Minimum 2 subjects and Maximum 3 subjects.");
          this.isSubmitted = false;
          return;
        }
      }


      if (this.lateralrequest.BoardID != 38) {
        this.lateralrequest.BoardStateID = 0
        this.lateralrequest.BoardExamID = 0
      }
      if (this.lateralrequest.CourseID == 141) {
        this.lateralrequest.BoardID = 0
      }


      if (this.request.CourseType == 5) {
        this.SubjectID = []
      }

      if (this.lateralrequest.CourseID == 141) {
        this.lateralrequest.BoardID = 0
      }
      if (this.lateralrequest.CourseID != 141 && this.lateralrequest.BoardID != 38) {
        this.lateralrequest.BoardName = ''
      }
      if (!this.ShowOtherBoard12th && this.lateralrequest.CourseID != 143) {
        this.lateralrequest.BoardStateID = 0
        this.lateralrequest.BoardExamID = 0
      }

      if (this.lateralrequest.CourseID == 140 || this.lateralrequest.CourseID == 141 || this.lateralrequest.CourseID == 142) {
        this.SubjectID = []
      }



      if (this.lateralrequest.CourseID == 143) {
        this.lateralrequest.ClassSubject = ''
      }

 
      this.SubjectID.forEach(e => e.CourseID = this.lateralrequest.CourseID)
      this.request.LateralEntryQualificationModel.push({
        CourseID: this.lateralrequest.CourseID,
        SubjectID: this.SubjectID,
        BoardID: this.lateralrequest.BoardID,
        BoardName: this.lateralrequest.BoardName,
        ClassSubject: this.lateralrequest.ClassSubject,
        PassingID: this.lateralrequest.PassingID,
        AggMaxMark: this.lateralrequest.AggMaxMark,
        AggObtMark: this.lateralrequest.AggObtMark,
        Percentage: this.lateralrequest.Percentage,
        Qualification: this.lateralrequest.Qualification,
        RollNumber: this.lateralrequest.RollNumber,
        StateID: this.lateralrequest.StateID,
        MarkType: this.lateralrequest.MarkType,
        BoardStateID: this.lateralrequest.BoardStateID,
        BoardExamID: this.lateralrequest.BoardExamID,
        ApplicationQualificationId: this.lateralrequest.ApplicationQualificationId
      });
    }

    console.log(this.request.LateralEntryQualificationModel)

    this.request.LateralCourseID = this.lateralrequest.CourseID
    this.request.CourseType = this.sSOLoginDataModel.Eng_NonEng


    this.request.QualificationID = 10

    this.swat.Confirmation(confirmationMessage, async (result: any) => {
      if (result.isConfirmed) {

        this.loaderService.requestStarted();
        try {
          await this.ApplicationService.Save_Documentscrutiny(this.request)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data);
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                this.router.navigate(['/StudentVerificationList'])
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }

            }, (error: any) => console.error(error)
            );
        }
        catch (ex) { console.log(ex) }
        finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    })
  }

  async RejectPreview(content: any) {



    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

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

  async CloseModel() {
    this.loaderService.requestStarted();
    this.request.Remark = ''
   
    setTimeout(() => {
      this.modalService.dismissAll();
      this.loaderService.requestEnded();
    }, 200);
  }

  async RejectDocument() {
     ;

    this.updateRemarkText();

    //if (this.reject.Remark == '') {
    //  this.toastr.error("Please Enter Remarks")
    //  return
    //}
    if (!this.reject.Remark || this.reject.Remark.trim() === '') {
      this.toastr.error("Please enter remarks");
      return;
    }
    

    this.reject.ModifyBy = this.SSOLoginDataModel.UserID;
    this.reject.DepartmentID = EnumDepartment.BTER
    this.reject.ApplicationID = this.request.ApplicationID
    this.reject.Action = EnumVerificationAction.Reject
    this.CloseModel()
    this.swat.Confirmation("Are you sure you want to Reject?", async (result: any) => {
 
      if (result.isConfirmed) {

        this.loaderService.requestStarted();
        try {
          await this.ApplicationService.Reject_Document(this.reject)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data);
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                this.CloseModel()
                this.router.navigate(['/StudentVerificationList'])
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }



            }, (error: any) => console.error(error)
            );

        }

        catch (ex) { console.log(ex) }
        finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    })

  }
////  async SaveDataChange() {

////    this.isSubmitted = true;
////    this.request.RoleID = this.sSOLoginDataModel.RoleID;
////    if (this.request.DepartmentID == EnumDepartment.BTER) {
////      this.refereshDepartmentValidator(true)
////    } else {
////      this.refereshDepartmentValidator(false)
////    }



////    if (this.request.CategoryA == EnumCasteCategory.OBC || this.request.CategoryA == EnumCasteCategory.MBC || this.request.CategoryA == EnumCasteCategory.EWS) {
////      this.refreshBranchRefValidation(true)
////    } else {
////      this.refreshBranchRefValidation(false)
////      this.request.CasteCertificateNo = '';
////    }

////    if (this.request.CategoryA == EnumCasteCategory.MBC) {
////      this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.setValidators(DropdownValidators1);
////      this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.updateValueAndValidity();

////    } else {
////      this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.clearValidators();
////      this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.updateValueAndValidity();
////    }

////    if (this.request.ENR_ID == 6) {
////      this.refreshDepartmentNameRefValidation(true)
////    } else {
////      this.refreshDepartmentNameRefValidation(false)
////    }



////    if (this.request.CategoryA == 3) {
////      this.StudentJanDetailFormGroup.get('subCategory')?.clearValidators();
////      if (this.request.subCategory == 1) {
////        this.request.IsTSP = true
////        this.request.IsSaharia = false
////      } else if (this.request.subCategory == 2) {
////        this.request.IsSaharia = true
////        this.request.IsTSP = false
////        this.request.TspDistrictID = 0
////        this.request.TSPTehsilID = 0
////      } else if (this.request.subCategory == 3) {
////        this.request.IsTSP = false
////        this.request.IsSaharia = false
////        this.request.TspDistrictID = 0
////        this.request.TSPTehsilID = 0
////      } else {
////        this.StudentJanDetailFormGroup.get('subCategory')?.setValidators(DropdownValidators1);

////      }
////      this.StudentJanDetailFormGroup.get('subCategory')?.updateValueAndValidity();


////    }



////    if (this.request.IsTSP == true) {
////      if (this.request.TspDistrictID == 0 || this.request.TspDistrictID == null || this.request.TspDistrictID == undefined) {
////        this.StudentJanDetailFormGroup.get('TspDistrictID')?.setValidators(DropdownValidators1);
////        this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();

////      }
////    } else {
////      this.StudentJanDetailFormGroup.get('TspDistrictID')?.clearValidators();
////      this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();
////      this.request.TspDistrictID = 0
////    }

////    if (this.request.IndentyProff == 1 && this.request.DetailID.length < 12) {
////      this.toastr.warning("Invalid Aadhar Number");
////      //return
////    } else if (this.request.IndentyProff == 2 && this.request.DetailID.length < 14) {
////      this.toastr.warning("Invalid Aadhar Enrollment ID");
////      //return
////    }




////    this.loaderService.requestStarted();
////    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
////    this.request.DepartmentID = 1;
////    this.request.SSOID = this.sSOLoginDataModel.SSOID;

////    if (this.request.ENR_ID == 5) {
////      this.request.IsRajasthani = true
////    } else {
////      this.request.IsRajasthani = false
////    }



////    if (this.request.PrefentialCategoryType == 2) {
////      this.request.CategoryA = 1
////      this.request.CategoryB = 0
////      this.request.CategoryC = 0
////      this.request.CategoryD = 0
////      this.request.CategoryE = 0
////      this.request.IsPH = '0'
////      this.request.IsTSP = false
////      this.request.IsDevnarayan = 0
////      this.request.IsEws = 0
////      this.request.IsRajasthani = false
////      this.request.DevnarayanTehsilID = 0
////      this.request.DevnarayanDistrictID = 0
////      this.request.TSPTehsilID = 0
////      this.request.TspDistrictID = 0
////      ///this.StudentJanDetailFormGroup.get('ddlCategoryA')?.clearValidators();
////      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.clearValidators();
////      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.clearValidators();
////      this.StudentJanDetailFormGroup.get('ddlCategoryD')?.clearValidators();
////      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.clearValidators();
////      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.clearValidators();
////      //this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.clearValidators();
////      //this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.clearValidators();
////      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.clearValidators();
////      this.StudentJanDetailFormGroup.get('TspDistrictID')?.clearValidators();


////      //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.updateValueAndValidity();
////      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.updateValueAndValidity();
////      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.updateValueAndValidity();
////      this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
////      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.updateValueAndValidity();
////      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();
////      //this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.updateValueAndValidity();
////      //this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.updateValueAndValidity();
////      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.updateValueAndValidity();
////      this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();




////    }
////    else {

////      //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.setValidators(Validators.required);
////      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.setValidators(DropdownValidators1);
////      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.setValidators(DropdownValidatorsString1);
////      //this.StudentJanDetailFormGroup.get('ddlCategoryD')?.setValidators(DropdownValidators1);
////      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.setValidators(DropdownValidators1);


////      //this.StudentJanDetailFormGroup.get('ddlCategoryA')?.updateValueAndValidity();
////      this.StudentJanDetailFormGroup.get('ddlCategoryB')?.updateValueAndValidity();
////      this.StudentJanDetailFormGroup.get('ddlCategorycp')?.updateValueAndValidity();
////      //this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
////      this.StudentJanDetailFormGroup.get('ddlCategoryE')?.updateValueAndValidity();

////      if (this.request.Gender != 97 && this.request.Maritial != 62) {
////        this.StudentJanDetailFormGroup.get('ddlCategoryD')?.setValidators(DropdownValidators1);

////      } else {
////        this.StudentJanDetailFormGroup.get('ddlCategoryD')?.clearValidators();
////        this.request.CategoryD = 0;
////      }
////      this.StudentJanDetailFormGroup.get('ddlCategoryD')?.updateValueAndValidity();
////      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.clearValidators();
////      //this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();

////      //if (this.request.CategoryA == 5) {
////      //  this.StudentJanDetailFormGroup.get('IsDevnarayan')?.setValidators([DropdownValidators]);
////      //  this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();
////      //}

////    }

////    //if (this.request.CategoryA != 5 ||  this.request.IsDevnarayan == 0) {
////    //  this.request.IsDevnarayan = 0
////    //  this.request.DevnarayanTehsilID = 0
////    //  this.request.DevnarayanDistrictID = 0

////    //  this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.clearValidators();
////    //  this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.clearValidators();

////    //  this.StudentJanDetailFormGroup.get('IsDevnarayan')?.updateValueAndValidity();
////    //  this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.updateValueAndValidity();
////    //  this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.updateValueAndValidity();

////    //}

////    //if (this.request.CategoryA == 5 && this.request.IsDevnarayan == 1) {
////    //  this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.setValidators([DropdownValidators]);
////    //  this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.setValidators([DropdownValidators]);

////    //  this.StudentJanDetailFormGroup.get('DevnarayanTehsilID')?.updateValueAndValidity();
////    //  this.StudentJanDetailFormGroup.get('DevnarayanDistrictID')?.updateValueAndValidity();

////    //}

////    if (this.request.CategoryA != 3 || (this.request.CategoryA == 3 && (this.request.subCategory == 2 || this.request.subCategory == 3))) {
////      this.request.IsTSP = false
////      this.request.TSPTehsilID = 0
////      this.request.TspDistrictID = 0
////      this.StudentJanDetailFormGroup.get('subCategory')?.clearValidators();
////      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.clearValidators();
////      this.StudentJanDetailFormGroup.get('TspDistrictID')?.clearValidators();

////      this.StudentJanDetailFormGroup.get('subCategory')?.updateValueAndValidity();
////      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.updateValueAndValidity();
////      this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();

////    }


////    if (this.request.CategoryA == 3 && this.request.IsTSP == true) {
////      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.setValidators(Validators.required);
////      this.StudentJanDetailFormGroup.get('TspDistrictID')?.setValidators(Validators.required);

////      this.StudentJanDetailFormGroup.get('TSPTehsilID')?.updateValueAndValidity();
////      this.StudentJanDetailFormGroup.get('TspDistrictID')?.updateValueAndValidity();
////    }




////    //new Date(x.To_Date)



////    if (this.StudentJanDetailFormGroup.invalid) {
////      this.toastr.error('fill required detals');
////      //Object.keys(this.StudentJanDetailFormGroup.controls).forEach(key => {
////      //  const control = this.StudentJanDetailFormGroup.get(key);

////      //  if (control && control.invalid) {
////      //    this.toastr.error(`Control ${key} is invalid`);
////      //    Object.keys(control.errors!).forEach(errorKey => {
////      //      this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
////      //    });
////      //  }
////      //});
////      return;
////    }


////    await this.RefreshValidators()
////    if (this.QualificationForm.invalid) {
////      return
////    }
////    if (this.request.BoardID != 38) {
////      this.request.BoardExamID = 0
////      this.request.BoardStateID = 0
////    }



////    if (this.request.CourseType == 4 || this.request.CourseType == 2) {
////      this.isSub = true;
////      this.HighestQualificationForm.get('txtHighestQualification')?.setValidators([DropdownValidatorsString]);
////      this.request.HighestQualificationModel = [];
////      await this.RefreshValidators()

////      if (this.HighestQualificationForm.invalid) {
////        this.toastr.warning("Please Fill Highest Qualification Form Properly")

////        //Object.keys(this.HighestQualificationForm.controls).forEach(key => {
////        //  const control = this.HighestQualificationForm.get(key);
////        //   if (control && control.invalid) {
////        //     this.toastr.error(`Control ${key} is invalid`);
////        //     Object.keys(control.errors!).forEach(errorKey => {
////        //       this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
////        //     });
////        //   }
////        // });

////        return
////      }



////      if (this.formData1.HighestQualificationHigh == '') {
////        this.toastr.warning("Please Select Highest Qualification")
////        return
////      }
////      this.HighQualificationList = []
////      if (this.formData1.BoardID != 38) {
////        this.formData1.BoardStateID = 0
////        this.formData1.BoardExamID = 0
////      }
////      if (this.nonEngHighQuali != '12') {
////        this.formData1.BoardID = 0
////      } else if (this.nonEngHighQuali == '12') {
////        this.formData1.UniversityBoard = ''
////      }
////      if (this.request.CourseType == 4 && this.formData1.StateIDHigh == 6) {
////        this.formData1.HighestQualificationHigh = 'D-Voc'
////      }
////      this.HighQualificationList.push(
////        {
////          UniversityBoard: this.formData1.UniversityBoard,
////          SchoolCollegeHigh: this.formData1.SchoolCollegeHigh,
////          HighestQualificationHigh: this.formData1.HighestQualificationHigh,
////          YearofPassingHigh: this.formData1.YearofPassingHigh,
////          RollNumberHigh: this.formData1.RollNumberHigh,
////          MarksTypeIDHigh: this.formData1.MarksTypeIDHigh,
////          MaxMarksHigh: this.formData1.MaxMarksHigh,
////          PercentageHigh: this.formData1.PercentageHigh,
////          MarksObtainedHigh: this.formData1.MarksObtainedHigh,
////          ClassSubject: this.formData1.ClassSubject,
////          BoardID: this.formData1.BoardID,
////          BoardStateID: this.formData1.BoardStateID,
////          BoardExamID: this.formData1.BoardExamID,
////          ApplicationQualificationId: this.formData1.ApplicationQualificationId,
////          StateIDHigh: this.formData1.StateIDHigh
////        },
////      );

////      this.request.ApplicationID = this.sSOLoginDataModel.ApplicationID;
////      this.request.HighestQualificationModel = this.HighQualificationList
////      // this.AddMore()
////    }

////    if (this.request.CourseType == 2 && this.nonEngHighQuali != '') {

////      this.isSub = true;
////      this.request.HighestQualificationModel = [];
////      this.formData1.HighestQualificationHigh = this.nonEngHighQuali


////      //if (this.HighestQualificationForm.invalid) {
////      //  this.toastr.warning("Please Fill Highest Qualification Form Properly")
////      //  return
////      //}

////      if (this.formData1.StateIDHigh == 0 && this.nonEngHighQuali == '12') {
////        this.toastr.warning("Please Select State of Study")
////        return
////      }

////      if (Number(this.request.Percentage) > Number(this.formData1.PercentageHigh)) {
////        this.toastr.warning("Highest Qualification Percentage should be greater then 10th Qualification Percentage")
////        return
////      }

////      if (this.nonEngHighQuali != '12') {
////        this.formData1.StateIDHigh = 0
////      } else if (this.nonEngHighQuali == '12' && this.formData1.StateIDHigh == 0) {
////        this.toastr.warning("Please Select State of Study for Highest qualification")
////        return
////      }

////      this.HighQualificationList = []
////      this.HighQualificationList.push({
////        UniversityBoard: this.formData1.UniversityBoard,
////        SchoolCollegeHigh: this.formData1.SchoolCollegeHigh,
////        HighestQualificationHigh: this.formData1.HighestQualificationHigh,
////        YearofPassingHigh: this.formData1.YearofPassingHigh,
////        RollNumberHigh: this.formData1.RollNumberHigh,
////        MarksTypeIDHigh: this.formData1.MarksTypeIDHigh,
////        MaxMarksHigh: this.formData1.MaxMarksHigh,
////        PercentageHigh: this.formData1.PercentageHigh,
////        MarksObtainedHigh: this.formData1.MarksObtainedHigh,
////        ClassSubject: this.formData1.ClassSubject,
////        ApplicationQualificationId: this.formData1.ApplicationQualificationId,
////        StateIDHigh: this.formData1.StateIDHigh,
////        BoardID: this.formData1.BoardID,
////        BoardStateID: this.formData1.BoardStateID,
////        BoardExamID: this.formData1.BoardExamID,
////      },
////      );



////      this.request.HighestQualificationModel = this.HighQualificationList
////    } else if (this.request.CourseType == 2 && this.nonEngHighQuali == '') {
////      this.formData1 = new HighestQualificationModel()
////    }


////    if (this.HighQualificationList.length == 0 && this.request.CourseType == 2 && this.nonEngHighQuali != '') {
////      this.toastr.error("Please Fill HighQualification Form")
////      return
////    }

////    if (this.HighQualificationList.length == 0 && this.request.CourseType == 4) {
////      this.toastr.error("Please Fill HighQualification Form")
////      return
////    }


////    if (this.request.IsSupplement == true) {
////      if (this.request.SupplementaryDataModel.length < 1) {
////        this.toastr.error("please Add Supplementry details")
////        return
////      }
////    }

////    this.request.LateralEntryQualificationModel = []


////    if (this.request.CourseType == EnumCourseType.Lateral || this.request.CourseType == 5) {
////      await this.RefreshValidators()




////      if (this.LateralQualificationForm.invalid) {


////        //Object.keys(this.LateralQualificationForm.controls).forEach(key => {
////        //  const control = this.LateralQualificationForm.get(key);
////        //   if (control && control.invalid) {
////        //     this.toastr.error(`Control ${key} is invalid`);
////        //     Object.keys(control.errors!).forEach(errorKey => {
////        //       this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
////        //     });
////        //   }
////        // });

////        return
////      }
////      if (this.lateralrequest.CourseID == EnumLateralCourse.Diploma_Engineering) {
////        if (this.SubjectID.length != 1) {
////          this.toastr.error("Please Select Only One Stream")
////          this.isSubmitted = false
////          return
////        }

////      }

////      //else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
////      //  if (this.SubjectID.length != 3) {
////      //    this.toastr.error("Please Select 3 Subjects")
////      //    this.isSubmitted = false
////      //    return
////      //  }

////      //}

////      else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
////        const selectedCount = this.SubjectID?.length || 0;

////        if (selectedCount < 2 || selectedCount > 3) {
////          this.toastr.error("Please select Minimum 2 subjects and Maximum 3 subjects.");
////          this.isSubmitted = false;
////          return;
////        }
////      }


////      if (this.lateralrequest.BoardID != 38) {
////        this.lateralrequest.BoardStateID = 0
////        this.lateralrequest.BoardExamID = 0
////      }
////      if (this.lateralrequest.CourseID == 141) {
////        this.lateralrequest.BoardID = 0
////      }


////      if (this.request.CourseType == 5) {
////        this.SubjectID = []
////      }

////      this.SubjectID.forEach(e => e.CourseID = this.lateralrequest.CourseID)
////      this.request.LateralEntryQualificationModel.push({
////        CourseID: this.lateralrequest.CourseID,
////        SubjectID: this.SubjectID,
////        BoardID: this.lateralrequest.BoardID,
////        BoardName: this.lateralrequest.BoardName,
////        ClassSubject: this.lateralrequest.ClassSubject,
////        PassingID: this.lateralrequest.PassingID,
////        AggMaxMark: this.lateralrequest.AggMaxMark,
////        AggObtMark: this.lateralrequest.AggObtMark,
////        Percentage: this.lateralrequest.Percentage,
////        Qualification: this.lateralrequest.Qualification,
////        RollNumber: this.lateralrequest.RollNumber,
////        StateID: this.lateralrequest.StateID,
////        MarkType: this.lateralrequest.MarkType,
////        BoardStateID: this.lateralrequest.BoardStateID,
////        BoardExamID: this.lateralrequest.BoardExamID,
////        ApplicationQualificationId: this.lateralrequest.ApplicationQualificationId
////      });
////    }


////    console.log(this.request.LateralEntryQualificationModel)



////    this.request.LateralCourseID = this.lateralrequest.CourseID
////    this.request.CourseType = this.sSOLoginDataModel.Eng_NonEng


////    this.request.QualificationID = 10


////    this.request.status = EnumVerificationAction.Changed
////    this.request.Remark="Changed"

////    const confirmationMessage =
////      this.request.status === EnumVerificationAction.Changed
////        ? "Are you sure you want to Changed?"
////        : "Are you sure you want to Revert?";


  

////    this.swat.Confirmation(confirmationMessage, async (result: any) => {
////      if (result.isConfirmed) {

////        this.loaderService.requestStarted();
////        try {
////          await this.ApplicationService.Save_Documentscrutiny(this.request)
////            .then((data: any) => {
////              data = JSON.parse(JSON.stringify(data));
////              console.log(data);
////              this.State = data['State'];
////              this.Message = data['Message'];
////              this.ErrorMessage = data['ErrorMessage'];

////              if (this.State == EnumStatus.Success) {
////                this.toastr.success(this.Message)
/////*                if (this.SSOLoginDataModel.RoleID==)*/
////                this.router.navigate(['/StudentVerificationList'])
////              }
////              else {
////                this.toastr.error(this.ErrorMessage)
////              }

////            }, (error: any) => console.error(error)
////            );
////        }
////        catch (ex) { console.log(ex) }
////        finally {
////          setTimeout(() => {
////            this.loaderService.requestEnded();
////          }, 200);
////        }
////      }
////    })
////  }


  //async BoardChange(Type: number) {
  //   ;
  //  try {

  //    if ((this.request.BoardID == 38 && Type == 10) || (this.formqual.BoardID == 38 && Type == 12) || (this.lateralrequest.BoardID == 38 && Type == 12)) {

  //      this.loaderService.requestStarted();
  //      await this.commonMasterService.GetCommonMasterData("BTER_Other_State")
  //        .then((data: any) => {
  //          data = JSON.parse(JSON.stringify(data));
  //          console.log(data);
  //          if (Type == 10) {
  //            this.ShowOtherBoard10th = true
  //            this.BoardStateList10 = data['Data'];
  //          } else if (Type == 12) {
  //            this.ShowOtherBoard12th = true
  //            this.BoardStateList12 = data['Data'];
  //          }
  //        }, (error: any) => console.error(error)
  //        );
  //    } else {
  //      if (Type == 10) {
  //        this.ShowOtherBoard10th = false;
  //        this.BoardStateList10 = [];
  //      } else if (Type == 12) {
  //        this.ShowOtherBoard12th = false;
  //        this.BoardStateList12 = [];
  //      }
  //    }
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }

  //}


  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];


    if (this.request.MarkType == 84) {


      if (!/^[0-9.]$/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    }
    else {

      if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    }

  }

  onHighestQualificationChange() {
    this.formData1.HighestQualificationHigh = this.nonEngHighQuali

    if (this.nonEngHighQuali == '') {
      this.formData1 = new HighestQualificationModel();
      this.isSub = false
    }
    console.log("formData.HighestQualificationHigh", this.formData1.HighestQualificationHigh)
  }

  //async passingYear() {

  //  const selectedYear = this.request.PassingID;
  //  if (selectedYear) {
  //    this.QualificationPassingYearList = this.PassingYearList.filter((item: any) => item.Year > selectedYear);
  //    this.SupplypassingYear();
  //  } else {
  //    this.PassingYearList;
  //  }
  //}


  //SupplypassingYear() {

  //  const selectedYear = this.request.PassingID;
  //  if (selectedYear) {
  //    this.SupplyPassingYearList = this.PassingYearList.filter((item: any) => item.Year >= selectedYear);
  //  } else {
  //    this.PassingYearList;
  //  }
  //}


  async loadDropdownData(MasterCode: string) {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'BTER_Board':
          this.BoardList10 = data['Data'];
          this.BoardList12 = data['Data'];
          break;
        default:
          break;
      }
    });
  }

  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }



  async MarksTypeChange() {
    if (this.request.MarkType == 84) {
      this.request.AggMaxMark = 10
      this.request.Percentage = '';
      this.request.AggObtMark = 0;
      this.QualificationForm.get('txtAggregateMaximumMarks')?.disable();
    } else {
      this.request.AggMaxMark = 0
      this.request.Percentage = '';
      this.request.AggObtMark = 0;
      this.QualificationForm.get('txtAggregateMaximumMarks')?.enable();
    }
  }

  async highMarksTypeChange() {
    if (this.formData1.MarksTypeIDHigh == 84) {
      this.formData1.MaxMarksHigh = 10
      this.formData1.MarksObtainedHigh = 0;
      this.formData1.PercentageHigh = '';
      this.HighestQualificationForm.get('txtMaxMarks')?.disable();
    } else {
      this.formData1.MaxMarksHigh = 0
      this.formData1.MarksObtainedHigh = 0;
      this.formData1.PercentageHigh = '';
      this.HighestQualificationForm.get('txtMaxMarks')?.enable();
    }
  }

  async lateralMarksTypeChange() {
    if (this.lateralrequest.MarkType == 84) {
      this.lateralrequest.AggMaxMark = 10
      this.lateralrequest.Percentage = '';
      this.lateralrequest.AggObtMark = 0;
      this.LateralQualificationForm.get('txtAggregateMaximumMarks')?.disable();
    } else {
      this.lateralrequest.AggMaxMark = 0
      this.lateralrequest.Percentage = '';
      this.lateralrequest.AggObtMark = 0;
      this.LateralQualificationForm.get('txtAggregateMaximumMarks')?.enable();
    }
  }


  async btnEdit_OnClick(item: SupplementaryDataModel) {
    try {
      this.loaderService.requestStarted();
      const index: number = this.request.SupplementaryDataModel.indexOf(item);
      if (index != -1) {
        this.request.SupplementaryDataModel.splice(index, 1)
      }
      // Your logic to populate form or set current item for editing
      this.addrequest = { ...item }; // Deep copy to avoid auto-updating original
      this.SupplementaryForm.patchValue(this.addrequest); // If using reactive form

      // Optionally, scroll to form or open edit section
      // e.g., this.scrollToEditForm();
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




  refereshDepartmentValidator(isvalidate: boolean) {
    this.StudentJanDetailFormGroup.get('ddlCourseType')?.clearValidators();
    if (isvalidate) {
      this.StudentJanDetailFormGroup.get('ddlCourseType')?.setValidators([DropdownValidators]);
    }
    this.StudentJanDetailFormGroup.get('ddlCourseType')?.updateValueAndValidity();
  }


  refreshBranchRefValidation(isValidate: boolean) {
    // clear
    this.StudentJanDetailFormGroup.get('txtGeneratDate')?.clearValidators();
    this.StudentJanDetailFormGroup.get('CertificateNo')?.clearValidators();

    // set
    if (isValidate) {
      this.StudentJanDetailFormGroup.get('txtGeneratDate')?.setValidators(Validators.required);
      this.StudentJanDetailFormGroup.get('CertificateNo')?.setValidators(Validators.required);

    }
    // update
    this.StudentJanDetailFormGroup.get('txtGeneratDate')?.updateValueAndValidity();
    this.StudentJanDetailFormGroup.get('CertificateNo')?.updateValueAndValidity();

  }

  refreshDepartmentNameRefValidation(isValidate: boolean) {
    // clear
    this.StudentJanDetailFormGroup.get('DepartmentName')?.clearValidators();


    // set
    if (isValidate) {
      this.StudentJanDetailFormGroup.get('DepartmentName')?.setValidators(Validators.required);


    }
    // update
    this.StudentJanDetailFormGroup.get('DepartmentName')?.updateValueAndValidity();

  }

  // async RefreshValidators() {

  //   if ( this.lateralrequest.CourseID == 143) {

  //     this.LateralQualificationForm.get('txtClassSubject')?.clearValidators();
  //     this.LateralQualificationForm.get('SubjectID')?.setValidators(Validators.required);
  //   } else {
  //     this.LateralQualificationForm.get('txtClassSubject')?.setValidators(Validators.required);
  //     this.LateralQualificationForm.get('SubjectID')?.clearValidators();
  //   }


  //   this.LateralQualificationForm.get('txtClassSubject')?.updateValueAndValidity();
  //   this.LateralQualificationForm.get('SubjectID')?.updateValueAndValidity();


  //   if (this.lateralrequest.CourseID == 143 || this.lateralrequest.CourseID == 140 || this.lateralrequest.CourseID == 142) {

  //     this.LateralQualificationForm.get('txtBoardName')?.clearValidators();
  //     this.LateralQualificationForm.get('ddlBoardID')?.setValidators([DropdownValidators]);

  //   } else {
  //     //this.LateralQualificationForm.get('txtBoardName')?.setValidators(Validators.required);
  //     this.LateralQualificationForm.get('ddlBoardID')?.clearValidators();
  //   }

  //   if (this.lateralrequest.CourseID == 143) {

  //     this.LateralQualificationForm.get('StateID')?.setValidators([DropdownValidators]);

  //   } else {
  //     this.LateralQualificationForm.get('StateID')?.clearValidators();
  //   }



  //   this.LateralQualificationForm.get('StateID')?.updateValueAndValidity();
  //   this.LateralQualificationForm.get('txtBoardName')?.updateValueAndValidity();
  //   this.LateralQualificationForm.get('ddlBoardID')?.updateValueAndValidity();



  //   if (this.request.BoardID == 38) {
  //     this.QualificationForm.get('ddlBoardStateID')?.setValidators([DropdownValidators]);
  //     this.QualificationForm.get('ddlBoardExamID')?.setValidators([DropdownValidators]);
  //   }
  //   else {
  //     this.QualificationForm.get('ddlBoardStateID')?.clearValidators();
  //     this.QualificationForm.get('ddlBoardExamID')?.clearValidators();
  //   }
  //   this.QualificationForm.get('ddlBoardStateID')?.updateValueAndValidity();
  //   this.QualificationForm.get('ddlBoardExamID')?.updateValueAndValidity();

  //   if (this.nonEngHighQuali == '12') {
  //     this.HighestQualificationForm.get('ddlBoardID')?.setValidators([DropdownValidators]);
  //     this.HighestQualificationForm.get('txtBoardUniversity')?.clearValidators();
  //   } else {
  //     this.HighestQualificationForm.get('ddlBoardID')?.clearValidators();
  //     this.HighestQualificationForm.get('txtBoardUniversity')?.setValidators(Validators.required);
  //   }
  //   this.HighestQualificationForm.get('ddlBoardID')?.updateValueAndValidity();
  //   this.HighestQualificationForm.get('txtBoardUniversity')?.updateValueAndValidity();

  //   if (this.formData1.BoardID == 38 && this.nonEngHighQuali == '12') {

  //     this.HighestQualificationForm.get('ddlBoardStateID')?.setValidators([DropdownValidators]);
  //     this.HighestQualificationForm.get('ddlBoardExamID')?.setValidators([DropdownValidators]);

  //   }
  //   else {


  //     this.HighestQualificationForm.get('ddlBoardStateID')?.clearValidators();
  //     this.HighestQualificationForm.get('ddlBoardExamID')?.clearValidators();

  //   }

  //   this.HighestQualificationForm.get('ddlBoardStateID')?.updateValueAndValidity();
  //   this.HighestQualificationForm.get('ddlBoardExamID')?.updateValueAndValidity();


  //   if (this.lateralrequest.BoardID == 38 && this.lateralrequest.CourseID == 143) {
  //     this.LateralQualificationForm.get('ddlBoardStateID')?.setValidators([DropdownValidators]);
  //     this.LateralQualificationForm.get('ddlBoardExamID')?.setValidators([DropdownValidators]);
  //   }
  //   else {
  //     this.LateralQualificationForm.get('ddlBoardStateID')?.clearValidators();
  //     this.LateralQualificationForm.get('ddlBoardExamID')?.clearValidators();
  //   }
  //   this.LateralQualificationForm.get('ddlBoardStateID')?.updateValueAndValidity();
  //   this.LateralQualificationForm.get('ddlBoardExamID')?.updateValueAndValidity();
  // }

  async RefreshValidators() {
    /* for 2nd year lateral Diploma */
    console.log("this.lateralrequest",this.lateralrequest)
    if(this.request.CourseType == 3){
      if (this.lateralrequest.CourseID == 143) {

        this.LateralQualificationForm.get('txtClassSubject')?.clearValidators();
        this.LateralQualificationForm.get('SubjectID')?.setValidators(Validators.required);
      } else {
        this.LateralQualificationForm.get('txtClassSubject')?.setValidators(Validators.required);
        this.LateralQualificationForm.get('SubjectID')?.clearValidators();
      }

      this.LateralQualificationForm.get('txtClassSubject')?.updateValueAndValidity();
      this.LateralQualificationForm.get('SubjectID')?.updateValueAndValidity();

      if (this.lateralrequest.CourseID == 143 || this.lateralrequest.CourseID == 140 || this.lateralrequest.CourseID == 142) {

        this.LateralQualificationForm.get('txtBoardName')?.clearValidators();
        this.LateralQualificationForm.get('ddlBoardID')?.setValidators([DropdownValidators]);

      } else {
        //this.LateralQualificationForm.get('txtBoardName')?.setValidators(Validators.required);
        this.LateralQualificationForm.get('ddlBoardID')?.clearValidators();
      }

      this.LateralQualificationForm.get('txtBoardName')?.updateValueAndValidity();
      this.LateralQualificationForm.get('ddlBoardID')?.updateValueAndValidity();

      if (this.lateralrequest.BoardID == 38 && this.lateralrequest.CourseID == 143) {
        this.LateralQualificationForm.get('ddlBoardStateID')?.setValidators([DropdownValidators]);
        this.LateralQualificationForm.get('ddlBoardExamID')?.setValidators([DropdownValidators]);
      }
      else {
        this.LateralQualificationForm.get('ddlBoardStateID')?.clearValidators();
        this.LateralQualificationForm.get('ddlBoardExamID')?.clearValidators();
      }
      this.LateralQualificationForm.get('ddlBoardStateID')?.updateValueAndValidity();
      this.LateralQualificationForm.get('ddlBoardExamID')?.updateValueAndValidity();
    }

    /* end 2nd year lateral Diploma */

    if (this.request.BoardID == 38) {
      this.QualificationForm.get('ddlBoardStateID')?.setValidators([DropdownValidators]);
      this.QualificationForm.get('ddlBoardExamID')?.setValidators([DropdownValidators]);
    }
    else {
      this.QualificationForm.get('ddlBoardStateID')?.clearValidators();
      this.QualificationForm.get('ddlBoardExamID')?.clearValidators();
    }
    this.QualificationForm.get('ddlBoardStateID')?.updateValueAndValidity();
    this.QualificationForm.get('ddlBoardExamID')?.updateValueAndValidity();

    if (this.nonEngHighQuali == '12') {
      this.HighestQualificationForm.get('ddlBoardID')?.setValidators([DropdownValidators]);
      this.HighestQualificationForm.get('txtBoardUniversity')?.clearValidators();
    } else {
      this.HighestQualificationForm.get('ddlBoardID')?.clearValidators();
      this.HighestQualificationForm.get('txtBoardUniversity')?.setValidators(Validators.required);
    }
    this.HighestQualificationForm.get('ddlBoardID')?.updateValueAndValidity();
    this.HighestQualificationForm.get('txtBoardUniversity')?.updateValueAndValidity();

    if (this.formData1.BoardID == 38 && this.nonEngHighQuali == '12') {

      this.HighestQualificationForm.get('ddlBoardStateID')?.setValidators([DropdownValidators]);
      this.HighestQualificationForm.get('ddlBoardExamID')?.setValidators([DropdownValidators]);

    }
    else {
      this.HighestQualificationForm.get('ddlBoardStateID')?.clearValidators();
      this.HighestQualificationForm.get('ddlBoardExamID')?.clearValidators();

    }

    this.HighestQualificationForm.get('ddlBoardStateID')?.updateValueAndValidity();
    this.HighestQualificationForm.get('ddlBoardExamID')?.updateValueAndValidity();
    

    /* for Degree Course 1st year*/

    if(this.request.CourseType == 4 || this.request.CourseType == 5){ 
      this.LateralQualificationForm.get('SubjectID')?.clearValidators();
      if (this.lateralrequest.CourseID == 281) {

        this.LateralQualificationForm.get('txtClassSubject')?.setValidators(Validators.required);
        this.LateralQualificationForm.get('SubjectID')?.clearValidators();
      } else {
        this.LateralQualificationForm.get('txtClassSubject')?.clearValidators();
        // this.LateralQualificationForm.get('SubjectID')?.setValidators(Validators.required);
      }


      this.LateralQualificationForm.get('txtClassSubject')?.updateValueAndValidity();
      this.LateralQualificationForm.get('SubjectID')?.updateValueAndValidity();


      if (this.lateralrequest.CourseID == 281 || this.lateralrequest.CourseID == 278 || this.lateralrequest.CourseID == 280) {

        this.LateralQualificationForm.get('txtBoardName')?.clearValidators();
        this.LateralQualificationForm.get('ddlBoardID')?.setValidators([DropdownValidators]);

      } else {
        //this.LateralQualificationForm.get('txtBoardName')?.setValidators(Validators.required);
        this.LateralQualificationForm.get('ddlBoardID')?.clearValidators();
      }

      this.LateralQualificationForm.get('txtBoardName')?.updateValueAndValidity();
      this.LateralQualificationForm.get('ddlBoardID')?.updateValueAndValidity();


      if (this.lateralrequest.BoardID == 38 && this.lateralrequest.CourseID == 281) {
        this.LateralQualificationForm.get('ddlBoardStateID')?.setValidators([DropdownValidators]);
        this.LateralQualificationForm.get('ddlBoardExamID')?.setValidators([DropdownValidators]);
      }
      else {
        this.LateralQualificationForm.get('ddlBoardStateID')?.clearValidators();
        this.LateralQualificationForm.get('ddlBoardExamID')?.clearValidators();
      }
      this.LateralQualificationForm.get('ddlBoardStateID')?.updateValueAndValidity();
      this.LateralQualificationForm.get('ddlBoardExamID')?.updateValueAndValidity();
    }
    /* end Degree Course 1st year*/

    /* for Degree Course 2nd Year Lateral*/

    if(this.request.CourseType == 5) {
      if(this.lateralrequest.CourseID == 278) {
        this.LateralQualificationForm.get('CoreBranchID')?.setValidators([DropdownValidators]);
        this.LateralQualificationForm.get('BranchID')?.setValidators([DropdownValidators]);
      } else {
        this.LateralQualificationForm.get('CoreBranchID')?.removeValidators([DropdownValidators]);
        this.LateralQualificationForm.get('BranchID')?.removeValidators([DropdownValidators]);
      }

      this.LateralQualificationForm.get('CoreBranchID')?.updateValueAndValidity();
      this.LateralQualificationForm.get('BranchID')?.updateValueAndValidity();
      
    }

    /* end Degree Course 2nd Year Lateral*/
  }


 async openPdfModal1(url: string) {

    const ext = url.split('.').pop()?.toLowerCase() || '';
    this.isPdf = ext === 'pdf';
    this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
    this.isError = false;
    
   try {


     await this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
       const blobUrl = URL.createObjectURL(blob);
       this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
       this.imageSrc = blobUrl;
       this.pdfUrl = url;
       this.showPdfModal = true;  this.showPdfModal = true;


     });

   } catch (error)
   {

     console.error('File load failed, showing dummy image.', error);
     this.showPdfModal = true;
     this.isPdf = false;
     this.isImage = true;
     this.safePdfUrl = null;
     this.imageSrc = 'assets/images/dummyImg.jpg';  // 🔁 Fallback image
     this.isError = true;
   }

  }


  async openPdfModal(url: string): Promise<void> {
    const ext = url.split('.').pop()?.toLowerCase();
    this.isPdf = ext === 'pdf';
    this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');

    this.safePdfUrl = null;
    this.imageSrc = '';
    this.pdfUrl = url;
    this.isError = false;

    try {
      const blob = await this.http.get(url, { responseType: 'blob' }).toPromise();
      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.imageSrc = blobUrl;
      } else {
        throw new Error('Blob is undefined');
      }
    } catch (error) {
      console.error('File load failed, using dummy image.', error);
      this.isPdf = false;
      this.isImage = true;
      this.safePdfUrl = null;
      this.imageSrc = 'assets/images/dummyImg.jpg';
      this.isError = true;
    }

    this.showPdfModal = true;
  }


  //openPdfModal(url: string): void {

  //  const ext = url.split('.').pop()?.toLowerCase();
  //  this.isPdf = ext === 'pdf';
  //  this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');
  //  let url1: string = '';
  //  this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
  //    url1 = window.URL.createObjectURL(blob);
  //  });
  //   
  //  this.pdfUrl = url;
  //  this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url1);  // <-- Sanitize here
  //  this.showPdfModal = true;
  //}



  ClosePopupAndGenerateAndViewPdf(): void {
    this.showPdfModal = false;
    this.safePdfUrl = null;
    this.pdfUrl = null;
    this.imageSrc = null;
    this.isPdf = false;
    this.isImage = false;
    this.isError = false;
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/dummyImg.jpg';
  }


  ShowOtherdropdown() {
    if (this.OtherData.ParentsIncome == 71) {
   
      this.IsShowDropdown = true
     


    }
    else {

    


      this.IsShowDropdown = false
      this.OtherData.EWS = 0
      this.OtherData.ApplyScheme = 0
      this.OtherData.IncomeSource = ''

    }
  }


  async GetOtherMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('ParentIncome')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ggg');
          this.ParentIncome = data['Data'];

        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.GetCommonMasterDDLByType('ApplyScheme')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ggg');
          this.SchemelIst = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterDDLByType('Residence')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ggg');
          this.ResidenceList = data['Data'];

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

  async GetOtherById() {
    this.isSubmitted = false;
    this.searchRequest.SSOID = this.SSOLoginDataModel.SSOID
    this.searchRequest.DepartmentID = EnumDepartment.BTER;
    this.searchRequest.ApplicationID = this.request.ApplicationID
    try {
      this.loaderService.requestStarted();
      await this.ApplicationService1.GetOtherDatabyID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'] != null) {
            this.OtherData = data['Data'];
            this.ShowOtherdropdown()
            if (this.request.CategoryA == 9) {
              this.OtherData.EWS = 1
     
            }
            if (this.OtherData.EWS == 0) {
              this.OtherData.EWS = 2
            }
          }

          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async Back() {
    if (this.key === 1) {
      this.router.navigate(['/deficiency-application']);
    } else if (this.key === 2) {
      this.router.navigate(['/assignedstudentsapplicaitons'], {
        queryParams: {
          id: this.statusid
        }
      });
    } else {
      this.router.navigate(['/StudentVerificationList'], {
        queryParams: {
          Status: this.request?.status
        }
      });
    }
  }




  
  public file!: File;

  async onFilechange(event: any, Type: string) {

    try {

      this.file = event.target.files[0];
      if (this.file) {
        // File type validation (image/jpeg, image/jpg, image/png, and application/pdf)
        if (['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(this.file.type)) {
          // Size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less than 2MB File');
            return;
          }
        }
        else {
          this.toastr.error('Select Only jpeg/jpg/png/pdf file');
          return;
        }
        //upload model
        let uploadModel = new UploadFileModel();
        uploadModel.FileExtention = this.file.type ?? "";
        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "2000000";
        uploadModel.FolderName = `Students/BTER/2025/${this.request.CourseType}/${this.request.ApplicationID}`;

        // Upload to server folder
        this.loaderService.requestStarted();
         
        await this.commonMasterService.UploadDocument(this.file, uploadModel)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {
              switch (Type) {
                case "CategoryA":
                  this.DisFile = data['Data'][0]["Dis_FileName"];
                  this.FileName = data['Data'][0]["FileName"];
                  this.FilePath = data['Data'][0]["FilePath"];
                  break;
             
                default:
                  break;
              }
            }   
            event.target.value = null;
            if (data.State === EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage);
            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.log(Ex);  
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async ViewHistory1(ID: number) {
    //this.searchRequest.action = "_GetstudentWorkflowdetails";
    //this.GetAllDataActionWise();
    this.childComponent.OpenVerificationPopup(ID);
  }

  findInvalidFormControls(formGroup: FormGroup): string[] {
    const invalid = [];
    const controls = formGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }

  ff(formGroup: FormGroup){
    const invalidControls = [];
for (const [key, control] of Object.entries(formGroup.controls)) {
  if (control.invalid) {
    invalidControls.push({
      name: key,
      value: control.value,
      errors: control.errors
    });
  }
}

console.log(invalidControls);

  }

}
