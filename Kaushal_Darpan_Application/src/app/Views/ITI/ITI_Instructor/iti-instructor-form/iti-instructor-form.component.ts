
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDatamodel, BterSearchmodel } from '../../../../Models/ApplicationFormDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { DataServiceService } from '../../../../Services/DataService/data-service.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { BterApplicationForm } from '../../../../Services/BterApplicationForm/bterApplication.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TspAreasService } from '../../../../Services/Tsp-Areas/Tsp-Areas.service';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { EnumDepartment, EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { StudentJanAadharDetailService } from '../../../../Services/StudentJanAadharDetail/student-jan-aadhar-detail.service';
import { ItiReportDataModel } from '../../../../Models/ITI/ItiReportDataModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ITIsService } from '../../../../Services/ITIs/itis.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2'
import { CommonVerifierApiDataModel } from '../../../../Models/PublicInfoDataModel';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { DeferBlockBehavior } from '@angular/core/testing';
import html2canvas from 'html2canvas';
import { ITI_Instructor_TechCITSDetailsSearchModel, ITI_InstructorDataModel, ITI_InstructorEducationalQualification, ITI_InstructorEmploymentDetails, ITI_InstructorTechnicalCITSQualification, ITI_InstructorTechnicalCITSQualificationList, ITI_InstructorTechnicalQualification, Iti_InstructorVerification } from '../../../../Models/ITI/ItiInstructorDataModel';
import { ITI_InstructorService } from '../../../../Services/ITI/ITI_Instructor/ITI_Instructor.Service';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { ApplicationStudentDatamodel, IStudentJanAadharDetailModel, JanAadharMemberDetails } from '../../../../Models/StudentJanAadharDetailModel';
import { Qualification10thDetailsDataModel, Qualification12thDetailsDataModel, Qualification8thDetailsDataModel } from '../../../../Models/ITIFormDataModel';
import Swal from 'sweetalert2';
import { QualificationDDLDataModel } from '../../../../Models/CommonMasterDataModel';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { DocumentDetailsService } from '../../../../Common/document-details';
import { JanAadharVerifyMemberDetails } from '../../../../Models/NewJanAadharAPIModel';
import { JanAadharDetailComponent } from '../../../new-jan-aadhar/new-jan-aadhar.component';


@Component({
  selector: 'app-iti-instructor',
  standalone: false,
  templateUrl: './iti-instructor-form.component.html',
  styleUrl: './iti-instructor-form.component.css'
})
export class ItiInstructorFormComponent {
  @Input() uid: string = '';
  public urlId: string = '';
  @Output() formSaved = new EventEmitter<boolean>();
  public InstructorForm!: FormGroup
  public EducationForm!: FormGroup
  public TechnicalForm!: FormGroup
  public EmploymentForm!: FormGroup
  public isSSOVisible: boolean = false;
  public isEmp: boolean = false;
  public showAadhaar: boolean = false;
  public sameAsPermanent: boolean = false;
  public IsCITScertified: boolean = false;
  public showJanAadhaar: boolean = false;
  public ResidenceList: any = []
  public CompanyMasterDDLList: any[] = [];
  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;
  public DistrictMasterList: any[] = [];
  public StateMasterList: any[] = [];
  public DistrictMasterList3: any[] = [];
  public verifyrequest = new Iti_InstructorVerification()
  public BoardList: any = []
  totalOverallExperience: string = '0 Year 0 Month';
  closeResult: string | undefined;
  public maxDate:string=''
  public request = new ITI_InstructorDataModel()
  public educationList: ITI_InstructorEducationalQualification[] = [];
  public educationRequest: ITI_InstructorEducationalQualification = new ITI_InstructorEducationalQualification();
  public techRequestList: ITI_InstructorTechnicalQualification[] = [];
  public techRequestCITSList: ITI_InstructorTechnicalCITSQualification[] = [];
  public techRequest = new ITI_InstructorTechnicalQualification()
  public searchtechCITSRequest = new ITI_Instructor_TechCITSDetailsSearchModel()

  public employeeRequest = new ITI_InstructorEmploymentDetails()
  public employeeRequestList: ITI_InstructorEmploymentDetails[] = [];

  public resendModel = new IStudentJanAadharDetailModel()
  public model = new ApplicationStudentDatamodel()
  showResendButton: boolean = false;
  public janaadharMemberDetails = new JanAadharMemberDetails()
  public ID: number = 0;
  public JAN_AADHAR: string = '';
  public ModifyBy: number = 0;
  public IsShowDropdown: boolean = false
  public IsShowDrop: boolean = false
  public IsShow: boolean = false
  public IsJANVerify: boolean = false
  private interval: any;
  public _enumDepartment = EnumDepartment
  // requestAction = new ItiVerificationModel();
  // public member = new ItiMembersModel()
  // public addmore = new ItiAffiliationList()
  // public isAddrequest: boolean=false
  // public isAddrequest2: boolean=false
  /*  public addrequest = new SupplementaryDataModel()*/
  public requestSSoApi = new CommonVerifierApiDataModel();
  public _enumrole = EnumRole
  public minDate: string = '';
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public ResposeOTPModel = new IStudentJanAadharDetailModel();
  public errorMessage = '';
  public HrMasterFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public stateMasterDDL: any = []
  public PassingYearList: any = []
  public maritialList: any = []
  public DistrictMasterList1: any = []
  public CategoryBlist: any = []
  public CategoryAlist: any = []
  public CategoryDlist: any = []
  public isSupplement: boolean = false
  public isedu: boolean = false
  public isTec: boolean = false
  public NationalityList: any = []
  public ReligionList: any = []
  public category_CList: any = []
  public category_PreList: any = []
  public ApplicationID: number = 0;
  public searchrequest = new BterSearchmodel()
  public GenderList: any = ''
  public InstituteCategoryList: any = [];
  public ManagmentTypeList: any = [];
  public DivisionMasterList: any = [];
  public TehsilMasterList: any = [];
  public TehsilMasterList2: any = [];
  public SubDivisionMasterList: any = [];
  public CityMasterDDLList: any = [];
  public PanchayatSamitiList: any = [];
  public GramPanchayatList: any = [];
  public ItiMemberPostList: any = [];
  public DISCOM: any = [];
  public VillageList: any = [];
  public AdharMemberList: IStudentJanAadharDetailModel[] = [];
  isViewMode: boolean = false;
  showGetDetailsButton: boolean = false;
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  timeLeft: number = GlobalConstants.DefaultTimerOTP;
  // @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public Collegeid: number = 0
  public Type: number = 0
  public Address: any = {
    addressEng: '',
    districtName: '',
    block_city: '',
    gp: '',
    village: '',
    pin: '',
    addressHnd: ''
  }
  isRajasthan: boolean = false;
  records: any[] = []; // store added rows
  showTable: boolean = false; // hide/show table
  showOnlyUidField: boolean = false;
  // @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;

  @ViewChild('modal_Acknowledgement') modal_Acknowledgement: any;
  public box8Checked: boolean = false;
  public box10Checked: boolean = false;
  public box12Checked: boolean = false;

  public QualificationForm8th!: FormGroup;
  public QualificationForm10th!: FormGroup;
  public QualificationForm12th!: FormGroup;

  public formData8th = new Qualification8thDetailsDataModel()
  public formData10th = new Qualification10thDetailsDataModel()
  public formData12th = new Qualification12thDetailsDataModel()
  public ExaminationPassed: any = [];
  public ExaminationPassed2: any = [];
  public QualificationModel = new QualificationDDLDataModel();
  public QualificationDDL : any=[]
  public eduQualificationDDL : any=[]
  public QualificationDetailsLevelDDL = new QualificationDDLDataModel();
  public EduQualificationDetailsLevelDDL = new QualificationDDLDataModel();
  public isInstructor: boolean = false
  allQualificationDDL: any[] = [];    
  ITITradeList: any[] = [];   
  StreamList: any[] = [];
  CITSStreamList: any[] = [];
  formData = new ITI_InstructorTechnicalCITSQualification()
  modalReference: NgbModalRef | undefined;
  public TechCITSId: number = 0;
  public ispersonal: boolean = false
  public isbank: boolean = false
  public isaddress: boolean = false
  public iscoraddress: boolean = false
  public iseducat: boolean = false
  public istechdetail: boolean = false
  public isempdetail: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private StudentJanAadharDetailService: StudentJanAadharDetailService,
    private ApplicationService: ITIsService,
    private toastr: ToastrService,
    private dataService: DataServiceService,
    private activatedRoute: ActivatedRoute,
    private appsettingConfig: AppsettingService,
    private swat: SweetAlert2,
    private modalService: NgbModal,
    private router: Router,
    private http: HttpClient,
    private ItiInstructorService: ITI_InstructorService,
    private route: ActivatedRoute,
    private ITIGovtEMStaffMasterService: ITIGovtEMStaffMaster,
    private Swal2: SweetAlert2,
    private documentDetailsService: DocumentDetailsService
  ) { }

  async ngOnInit() {
   


    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isViewMode = true;
        this.isSSOVisible = true;
        this.showGetDetailsButton = false;
        this.showAadhaar = true;
        this.showJanAadhaar = true;
      } else {
        this.isViewMode = false;
        this.isSSOVisible = false;
        this.showGetDetailsButton = true;
        this.showAadhaar = true;
        this.showJanAadhaar = true;
      }
    });

    this.InstructorForm = this.formBuilder.group({
      // Personal Details
      Uid: ['', Validators.required],
      IsDomicile: [false],
      Name: ['', Validators.required],
      FatherOrHusbandName: ['', Validators.required],
      MotherName: ['', Validators.required],
      Dob: ['', Validators.required],
      Gender: ['', Validators.required],
      MaritalStatus: ['', Validators.required],
      Category: ['', Validators.required],
      Mobile: ['', [Validators.required, Validators.pattern(GlobalConstants.MobileNumberPattern)]],
      Email: ['', [Validators.required, Validators.pattern(GlobalConstants.EmailPattern)]],
      pincode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
      Correspondence_pincode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
      // Bank Details
      BankAccountNumber: ['', [Validators.required, Validators.pattern(GlobalConstants.AccountNoPattern)]],
      IFSCCode: ['', [Validators.required, Validators.pattern(GlobalConstants.IFSCPattern)]],
      BankName: ['', Validators.required],
      ConsentToAssignAsExaminer: [false],

      // Permanent Address
      PlotHouseBuildingNo: ['', Validators.required],
      StreetRoadLane: ['', Validators.required],
      AreaLocalitySector: ['', Validators.required],
      LandMark: ['', Validators.required],
      ddlState: ['', [DropdownValidators]],
      ddlDistrict: ['', [DropdownValidators]],
      PropTehsilID: ['', [DropdownValidators]],
      PropUrbanRural: [''],
      City: ['', Validators.required],
      villageID: [''],
      sameAsPermanent: [false],
      PermanentDocument: ['', Validators.required],   // aad new 19/11/2025


      // Correspondence Address
      Correspondence_PlotHouseBuildingNo: ['', Validators.required],
      Correspondence_StreetRoadLane: ['', Validators.required],
      Correspondence_AreaLocalitySector: ['', Validators.required],
      Correspondence_LandMark: ['', Validators.required],
      Correspondence_ddlState: ['', [DropdownValidators]],
      Correspondence_ddlDistrict: ['', [DropdownValidators]],
      Correspondence_PropTehsilID: ['', [DropdownValidators]],
      Correspondence_PropUrbanRural: [''],
      Correspondence_City: ['', Validators.required],
      Correspondence_villageID: [''],
   

      // Educational Qualification
      //Education_Exam: [''],
      //Education_Board: [''],
      //Education_Year: [''],
      //Education_Subjects: [''],
      //Education_Percentage: [''],
      //QualificationDocument: [''],

      //// Technical Qualification
      //Tech_Exam: [''],
      //Tech_Board: [''],
      //Tech_Subjects: [''],
      //Tech_Year: [''],
      //Tech_Percentage: [''],
      //TechQualificationDocument: [''],

      // Employment Details
      //Pan_No: [''],
    /*  Pan_No: ['', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]],*/
      Employee_Type: [''],
      Employer_Name: [''],
      Employer_Address: [''],
      Tan_No: [''],
      Aadhar: ['', [Validators.required, Validators.pattern(GlobalConstants.AadhaarPattern)]],
      AadharDocument: ['', Validators.required],   /// aad new 19/11/2025
      JanAadhar: [''],
      Employment_From: [''],
      Employment_To: [''],
      Basic_Pay: [''],
      EmploymentDocument: [''],
      TehsilName: [''],
      PostHeld: [''],
      BasicSalaryDocument: [''],
      EmployeeCode: ['']
    });

    this.EducationForm = this.formBuilder.group({
      Education_Exam: ['', Validators.required],
      Education_Board: ['', Validators.required],
      Education_Year: ['', Validators.required],
      Education_Subjects: ['', Validators.required],
      Education_Percentage: ['', [Validators.min(0), Validators.max(100)]],
      Education_CGPA: [''],
      EducationDocument: ['', Validators.required],
      MarksTypeID: ['', Validators.required],
      EduQualificationName: ['', Validators.required],
      EduOtherExaminationPassed: ['']
    
    });


    this.TechnicalForm = this.formBuilder.group({
      // Tech_Exam: ['', Validators.required],
      QualificationName: ['', Validators.required],
      QualificationLevel: ['', Validators.required],
      Tech_Board: ['', Validators.required],
     // Tech_Subjects: ['', Validators.required],
      StreamName: [''],
      StreamID: [''],
      Tech_Year: ['', [Validators.pattern('^[0-9]{4}$')]],
      Tech_Percentage: ['', [Validators.min(0), Validators.max(100)]],
      Tech_CGPA: ['', [Validators.min(0), Validators.max(10)]],
     // Tech_MarksTypeID: [''],
      TechDocument: ['', Validators.required],
      Tech_MarksTypeID: ['', Validators.required],
      //CITSCertified: [''],
      CITSCertified: ['0', Validators.required],
      Tech_CITSCertifiedDocument: ['', Validators.required],

      Tech_CITSTrade: [''],
      Tech_CITSYear: [''],
      TypeID: ['',],

      OtherCITSQualification: this.formBuilder.array([])
    });


    this.EmploymentForm = this.formBuilder.group({
      PanDocument: [''],
      Pan_No: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      Employee_Type: ['', Validators.required],
      Employer_Name: ['', Validators.required],
      Name: [''],
      Employer_Address: ['', Validators.required],
      Tan_No: ['', Validators.required],
      //Aadhar: [''],
      //JanAadhar: [''],
      Employment_From: ['', Validators.required],
      Employment_To: [''],
      Basic_Pay: ['', Validators.required],
      EmploymentDocument: ['', Validators.required],
      PostHeld: [''],
      BasicSalaryDocument: [''],
      EmployeeCode: [''],
      Employer_Registration: [''],
      //Employer_presentlyWorking: [false, Validators.required],
      Employer_presentlyWorking: ['false'],   // ← Default: No selected

    });
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
    
    this.sSOLoginDataModel = await JSON.parse(localStorage.getItem('SSOLoginUser') ?? '{}');
    if (this.sSOLoginDataModel.RoleID == null) {
      this.sSOLoginDataModel.RoleID = 0
    }

    let idParam = this.activatedRoute.snapshot.queryParams['Uid'] ?? '';

    this.urlId = idParam;

    if (this.uid != '' && this.uid != undefined) {
      this.urlId = this.uid
    }


    if (this.urlId != '' && this.urlId != null && this.urlId != undefined) {

      this.InstructorForm.patchValue({
        Uid: this.urlId
      });

      await this.GetById(this.urlId)
      
      if (this.uid) {
        await this.GetVerifiationList()
        debugger
        if (this.verifyrequest.PersonalStatus == 'Not Approved') {
          this.ispersonal = true
          this.InstructorForm.controls['IsDomicile'].enable()
          this.InstructorForm.controls['JanAadhar'].enable()
          this.InstructorForm.controls['Aadhar'].enable()
          this.InstructorForm.controls['AadharDocument'].enable()
          this.InstructorForm.controls['Name'].enable()
          this.InstructorForm.controls['FatherOrHusbandName'].enable()
          this.InstructorForm.controls['MotherName'].enable()
          this.InstructorForm.controls['Dob'].enable()
          this.InstructorForm.controls['Gender'].enable()
          this.InstructorForm.controls['MaritalStatus'].enable()
          this.InstructorForm.controls['Category'].enable()
          this.InstructorForm.controls['Category'].enable()
          this.InstructorForm.controls['Mobile'].enable()
          this.InstructorForm.controls['Email'].enable()
         
        }
        if (this.verifyrequest.BankStatus == 'Not Approved') {
          this.isbank = true
          this.InstructorForm.controls['BankAccountNumber'].enable()
          this.InstructorForm.controls['IFSCCode'].enable()
          this.InstructorForm.controls['BankName'].enable()
        }
        if (this.verifyrequest.AddressStatus == 'Not Approved') {
          this.isaddress = true
          this.InstructorForm.controls['PlotHouseBuildingNo'].enable()
          this.InstructorForm.controls['StreetRoadLane'].enable()
          this.InstructorForm.controls['AreaLocalitySector'].enable()
          this.InstructorForm.controls['LandMark'].enable()
          this.InstructorForm.controls['ddlState'].enable()
          this.InstructorForm.controls['ddlDistrict'].enable()
          this.InstructorForm.controls['PropTehsilID'].enable()
          this.InstructorForm.controls['City'].enable()
          this.InstructorForm.controls['pincode'].enable()
          this.InstructorForm.controls['PermanentDocument'].enable()
          this.InstructorForm.controls['sameAsPermanent'].enable()
        }

        if (this.verifyrequest.CorAddressStatus == 'Not Approved') {
          this.iscoraddress = true
          this.InstructorForm.controls['Correspondence_PlotHouseBuildingNo'].enable()
          this.InstructorForm.controls['Correspondence_StreetRoadLane'].enable()
          this.InstructorForm.controls['Correspondence_AreaLocalitySector'].enable()
          this.InstructorForm.controls['Correspondence_LandMark'].enable()
  
          this.InstructorForm.controls['Correspondence_ddlState'].enable()
          this.InstructorForm.controls['Correspondence_ddlDistrict'].enable()
          this.InstructorForm.controls['Correspondence_PropTehsilID'].enable()
          this.InstructorForm.controls['Correspondence_City'].enable()
          this.InstructorForm.controls['Correspondence_pincode'].enable()
        }
        if (this.verifyrequest.EducationalStatus == 'Not Approved') {
          this.iseducat = true
          this.EducationForm.enable()
        }
        if (this.verifyrequest.TechnicalStatus == 'Not Approved') {
          this.istechdetail = true
          this.TechnicalForm.enable()
        }
        if (this.verifyrequest.EmpStatus == 'Not Approved') {
          this.isempdetail = true
          this.EmploymentForm.enable()
        }


        this.request.StatusID=8
      }

      
    }

  

    await this.GetInstituteCategoryList();
    await this.GetManagmentType();
    await this.GetStateMaterData()
    await this.GetLateralCourse();
    await this.GetPassingYearDDL();
    await this.BoardDropdownData('Board');
    await this.GetcOmmonData();
    await this.QualificationDetailsLevel();
    await this.EduQualificationDetailsLevel();
    await this.GetCITSTrade();


    this.EmploymentForm.get("Employer_presentlyWorking")?.valueChanges.subscribe(val => {
      if (val === "true") {
        this.EmploymentForm.get("Employment_To")?.setValue(null);
        this.EmploymentForm.get("Employment_To")?.clearValidators();
      } else {
        this.EmploymentForm.get("Employment_To")?.setValidators([Validators.required]);
      }
      this.EmploymentForm.get("Employment_To")?.updateValueAndValidity();
    });
  }

  get _InstructorForm() { return this.InstructorForm.controls; }
  get _EmploymentForm() { return this.EmploymentForm.controls; }
  get _EducationForm() { return this.EducationForm.controls; }

  async ddlDistrict_Change() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.InstructorForm.value.Correspondence_ddlDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterList2 = data['Data'];
          debugger
          this.request.Correspondence_PropTehsilID = '0'
        }, error => console.error(error));

      await this.commonMasterService.CityMasterDistrictWise(this.InstructorForm.value.ddlDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CityMasterDDLList = data['Data'];
          console.log(this.CityMasterDDLList, "CityMasterDDLList")
      
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


  async ddlDistrict_Change2() {

    try {
      this.loaderService.requestStarted();


      await this.commonMasterService.TehsilMaster_DistrictIDWise(Number(this.InstructorForm.value.ddlDistrict))
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterList = data['Data'];
          this.request.PropTehsilID = '0'
        }, error => console.error(error));


      await this.commonMasterService.CityMasterDistrictWise(this.InstructorForm.value.ddlDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CityMasterDDLList = data['Data'];
          console.log(this.CityMasterDDLList, "CityMasterDDLList")
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

  async GetLateralCourse() {
    try {
      this.loaderService.requestStarted();
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

  async GetStateMaterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.StateMasterList = data['Data'];
          console.log(this.StateMasterList);
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

  async ddlState_Change() {
    console.log("State changed - (", this.InstructorForm.value.ddlState, ")");

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_StateIDWise(Number(this.InstructorForm.value.ddlState))
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
         
            this.request.ddlDistrict = '0'
          
       
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



  async ddlState_Changeid() {
    console.log("State changed - (", this.InstructorForm.value.ddlState, ")");

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_StateIDWise(Number(this.InstructorForm.value.ddlState))
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];




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


  addEducationQualification() {
    this.isedu = true;
    if (this.EducationForm.invalid) {
      alert("Please fill required fields before adding");
      return;
    }

    const MarksTypeID = String(this.educationRequest.MarksTypeID).trim(); 
    if (MarksTypeID === '0') { 
      const perc = Number(this.educationRequest.Education_Percentage);
      if (isNaN(perc) || perc < 0 || perc > 100) {
        alert("Percentage must be between 0 and 100");
        return;
      }
    } else if (MarksTypeID === '1') { 
      const cgpa = Number(this.educationRequest.Education_CGPA);
      if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        alert("CGPA must be between 0 and 10");
        return;
      }
    } else {
      alert("Please select Marks Type");
      return;
    }
    const EduQualificationName = this.eduQualificationDDL.filter(
      (q: any) => q.QualificationID == this.educationRequest.EduQualificationID
    )

    this.educationList.push({
      EducationDocument: this.educationRequest.EducationDocument,
      Education_Board: this.educationRequest.Education_Board,
      Education_CGPA: MarksTypeID === '1' ? this.educationRequest.Education_CGPA : null,
      Education_Exam: this.educationRequest.Education_Exam,
      Education_Percentage: MarksTypeID === '0' ? this.educationRequest.Education_Percentage : null,
      Education_Subjects: this.educationRequest.Education_Subjects,
      Education_Year: this.educationRequest.Education_Year,
      EduQualificationName: EduQualificationName[0]?.QualificationName,
      EduOtherExaminationPassed: this.educationRequest.EduOtherExaminationPassed,
      MarksTypeID: MarksTypeID,
      MarkTypeName: MarksTypeID === '0' ? 'Percentage' : 'CGPA'
    });

    console.log('education data ==>', this.educationList);

    this.educationRequest = new ITI_InstructorEducationalQualification();
    this.EducationForm.reset();
    this.isedu = false;
  }



  removeEducation(index: number) {
    this.educationList.splice(index, 1);
  }



  //addTechQualificationCITS() {
  //  this.formData.OtherCITSQualification.push(new ITI_InstructorTechnicalCITSQualificationList());
  //}
  addTechQualificationCITS() {
    if (!this.formData.OtherCITSQualification) {
      this.formData.OtherCITSQualification = [];
    }
    debugger
    if (this.formData.OtherCITSQualification.length === 0) {
      this.formData.OtherCITSQualification.push(
        new ITI_InstructorTechnicalCITSQualificationList()
      );
      return;
    }

    const lastItem =
      this.formData.OtherCITSQualification[
      this.formData.OtherCITSQualification.length - 1
      ];

    if (this.isCITSRowEmpty(lastItem)) {
      return;
    }

    if (!this.validateCITSRow(lastItem)) {
      return;
    }

    this.formData.OtherCITSQualification.push(
      new ITI_InstructorTechnicalCITSQualificationList()
    );
  }
  onCITSTradeChange(item: any) {
    const selectedStream = this.CITSStreamList?.find(
      (x: any) => x.StreamID == item.Tech_CITSTrade
    );

    item.Tech_CITSTradeName = selectedStream ? selectedStream.StreamName : '';
  }


  isCITSRowEmpty(item: any): boolean {
    return (
      !item ||
      (
        (!item.Tech_CITSYear || item.Tech_CITSYear === '') &&
        (!item.Tech_CITSTrade || item.Tech_CITSTrade === '') &&
        (!item.Tech_CITSCertifiedDocument || item.Tech_CITSCertifiedDocument === '')
      )
    );
  }

  validateCITSRow(item: any): boolean {
    let isValid = true;

    item.errors = {};

    if (!item.Tech_CITSYear || item.Tech_CITSYear === "") {
      item.errors.Tech_CITSYear = true;
      isValid = false;
    }

    if (!item.Tech_CITSTrade || item.Tech_CITSTrade === "") {
      item.errors.Tech_CITSTrade = true;
      isValid = false;
    }

    if (!item.Tech_CITSCertifiedDocument || item.Tech_CITSCertifiedDocument === "") {
      item.errors.Tech_CITSCertifiedDocument = true;
      isValid = false;
    }

    return isValid;
  }
  removeTechQualificationCITS(i: number) {
    this.formData.OtherCITSQualification.splice(i, 1);
  }


  async ViewCTISTechQualification(content: any, id: number, index: number) {
    this.formData.OtherCITSQualification = this.techRequestList[index].OtherCITSQualification;
    this.TechCITSId = id;
    this.searchtechCITSRequest.TechCITSId = this.TechCITSId;
    if (this.request.ID != 0) {
      await this.ViewCTISTechQualificationDetails()
    }
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
  }

  

  CloseModalPopup() {
    this.modalService.dismissAll();
    this.TechCITSId = 0;
  }

  async ViewCTISTechQualificationDetails() {
      try {
        this.loaderService.requestStarted();
        await this.ItiInstructorService.GetAllTechCITSDetails(this.searchtechCITSRequest).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("getbyid", data)
          if (data.State == EnumStatus.Success) {
            this.formData.OtherCITSQualification = data['Data']['Table'];
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

 
  async UploadDocument(event: any, item: any) {
    try {
       let uploadModel = new UploadFileModel();
      uploadModel.FolderName = "ITI/Instructor/";
      await this.documentDetailsService.UploadDocument(event, uploadModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
       
          if (this.State == EnumStatus.Success) {
            
            item.Tech_CITSCertifiedDocument =data.Data[0].FileName;
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


  addTechQualification() {
    if (!this.techRequest.QualificationID ) {
      alert("Please fill required fields before adding");
      return;
    }
    if (this.techRequest.Tech_MarksTypeID == '1') {
      const cgpa = Number(this.techRequest.Tech_CGPA);
      if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        alert("CGPA must be between 0 and 10");
        return;
      }
    }
    if (this.techRequest.Tech_MarksTypeID == '0') {
      const perc = Number(this.techRequest.Tech_Percentage);
      if (isNaN(perc) || perc < 0 || perc > 100) {
        alert("Percentage must be between 0 and 100");
        return;
      }
    }

    if (this.TechnicalForm.get('CITSCertified')?.value == '1' && this.techRequest.TypeID==0) {
      alert("Please Select Type");
      return;
    }

    const QualificationName = this.QualificationDDL.find(
      (q: any) => q.QualificationID == this.techRequest.QualificationID
    )?.QualificationName || '';
    const StreamName = this.StreamList.find(
      (q: any) => q.StreamID == this.techRequest.StreamID
    )?.StreamName || '';

    this.techRequestList.push({
      TechDocument: this.techRequest.TechDocument,
      Tech_Board: this.techRequest.Tech_Board,
      Tech_CGPA: this.techRequest.Tech_CGPA,
      Tech_MarksTypeID: this.techRequest.Tech_MarksTypeID,  
      QualificationLevel: this.techRequest.QualificationLevel,
      QualificationID: this.techRequest.QualificationID,
      Tech_Percentage: this.techRequest.Tech_Percentage,
      StreamID: this.techRequest.StreamID,
      Tech_Year: this.techRequest.Tech_Year,
      Tech_CITSYear: this.techRequest.Tech_CITSYear,
      Tech_CITSTrade: this.techRequest.Tech_CITSTrade,
      MarkTypeName: this.techRequest.Tech_MarksTypeID == '0' ? 'Percentage' : 'CGPA',
      CITSCertified: this.techRequest.CITSCertified,
      Tech_CITSCertifiedDocument: this.techRequest.Tech_CITSCertifiedDocument,
      QualificationName: QualificationName,
      StreamName: StreamName,
      OtherCITSQualification: this.formData.OtherCITSQualification,
      TypeID: this.techRequest.TypeID
    });
    console.log('Request List===>',this.techRequestList)
    this.formData.OtherCITSQualification = [new ITI_InstructorTechnicalCITSQualificationList()];


    this.TechnicalForm.reset({
      QualificationName: '',
      QualificationLevel: '',
      Tech_Board: '',
      StreamName: '',
      StreamID: '',
      Tech_Year: '',
      Tech_Percentage: '',
      Tech_CGPA: '',
      TechDocument: null,
      Tech_MarksTypeID: '',
      CITSCertified: '0',   
      Tech_CITSCertifiedDocument: '',
      Tech_CITSTrade: '',
      Tech_CITSYear: '',
      TypeID:0
    });


    //this.TechnicalForm.reset();
    this.techRequest.TechDocument = '';
  }


  removeTech(index: number) {
    this.techRequestList.splice(index, 1);
  }

  //addTechQualificationCITS() {
  //  debugger
  //  this.techRequestCITSList.push({
  //    Tech_CITSYear: this.techRequest.Tech_CITSYear,
  //    Tech_Trade: this.techRequest.Tech_Trade,
  //    CITSCertified: this.techRequest.CITSCertified,
  //    CITSCertifiedDocument: this.techRequest.CITSCertifiedDocument
  //  });
  //  this.TechnicalForm.reset();
  //}
  addEmployeeQualification() {
    if (this.EmploymentForm.invalid) {
      alert("Please fill required fields before adding");
      return;
    }

    const fromDate = this.employeeRequest.Employment_From
      ? new Date(this.employeeRequest.Employment_From)
      : null;

    const toDate =
      this.employeeRequest.Employer_presentlyWorking === 'true'
        ? new Date()   // today date if presently working = yes
        : this.employeeRequest.Employment_To
          ? new Date(this.employeeRequest.Employment_To)
          : null;

    if (fromDate && toDate) {
      if (toDate < fromDate) {
        alert("Date of Leaving cannot be earlier than Date of Joining");
        return;
      }

      const rowExperience = this.calculateExperience(fromDate, toDate);
      this.employeeRequest.TotalExperience = `${rowExperience.years} Year ${rowExperience.months} Month`;
    } else {
      this.employeeRequest.TotalExperience = '';
    }

    this.employeeRequestList.push({ ...this.employeeRequest });

    this.employeeRequest = new ITI_InstructorEmploymentDetails();
    this.EmploymentForm.reset();
    this.isEmp = false;
  }
  calculateExperience(fromDate: Date, toDate: Date) {
    let years = toDate.getFullYear() - fromDate.getFullYear();
    let months = toDate.getMonth() - fromDate.getMonth();

    if (toDate.getDate() < fromDate.getDate()) {
      months--;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months };
  }

  getOverallExperience() {
    let totalMonths = 0;

    this.employeeRequestList.forEach((item: any) => {
      const fromDate = item.Employment_From ? new Date(item.Employment_From) : null;

      const toDate =
        item.Employer_presentlyWorking === 'true'
          ? new Date()
          : item.Employment_To
            ? new Date(item.Employment_To)
            : null;

      if (fromDate && toDate) {
        let months =
          (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
          (toDate.getMonth() - fromDate.getMonth());

        // adjust if day is smaller
        if (toDate.getDate() < fromDate.getDate()) {
          months--;
        }

        totalMonths += months;
      }
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return `${years} Year ${months} Month`;
  }


  removeEmployee(index: number) {
    this.employeeRequestList.splice(index, 1);
  }


  async GetInstituteCategoryList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeCategory().then((data: any) => {
        this.InstituteCategoryList = data.Data;
        this.InstituteCategoryList = this.InstituteCategoryList.filter((e: any) => e.ID != 20)
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetManagmentType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetManagType().then((data: any) => {
        this.ManagmentTypeList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }


  async ddlState_Change2() {
    try {
      
    
        this.request.Correspondence_ddlState = this.InstructorForm.value.Correspondence_ddlState
     
     
      
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_StateIDWise(Number(this.InstructorForm.value.Correspondence_ddlState))
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList3 = data['Data'];
    
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

  onReset() {
    this.InstructorForm.reset();
    this.EmploymentForm.reset();
    this.TechnicalForm.reset();
    this.EducationForm.reset();
  }



 
  async onSubmit() {
    this.isSubmitted = true;

    this.request.Aadhar = this.InstructorForm.value.Aadhar
    if (this.request.IsDomicile == true && this.request.JanAadhar == '') {
      this.toastr.warning("Please Add Janaadhar Number ")
      return
    }
    //if (this.request.IsDomicile == true && this.IsJANVerify == false) {
    //  this.toastr.warning("Please Verify or Add Valid JanAadhar ")
    //  return
    //}
    if (this.request.ddlState != '6') {
      this.InstructorForm.controls['PropTehsilID'].clearAsyncValidators()
      this.InstructorForm.controls['Correspondence_PropTehsilID'].clearAsyncValidators()
      this.InstructorForm.controls['PropTehsilID'].updateValueAndValidity()
      this.InstructorForm.controls['Correspondence_PropTehsilID'].updateValueAndValidity()
    }

    if (this.InstructorForm.invalid) {
      return
    }
    if (this.educationList.length == 0) {
      this.toastr.warning("Please Add Education Detail")
      return
    }
    if (this.employeeRequestList.length == 0) {
      this.toastr.warning("Please Add Employee Details")
      return
    }
  this.Swal2.Confirmation("Are you sure you want to Submit?", async (result: any) => {
    if (result.isConfirmed) {
      this.isLoading = true;
      this.loaderService.requestStarted();
      try {
        const ssoid = this.request.Uid;

        //this.request = this.InstructorForm.value as ITI_InstructorDataModel;
        this.request.CreatedBy = '0'
        this.request.DepartmentID ='2'
        this.request.Uid = ssoid;
        this.request.EmploymentDetails = this.employeeRequestList;
        this.request.TechnicalQualifications = this.techRequestList;
        this.request.EducationalQualifications = this.educationList;
        console.log('Final Request Data:', this.request);
        if (this.request.StatusID == 0) {
          this.request.StatusID = 9

        }
        const response: any = await this.ItiInstructorService.SaveInstructorData(this.request);
        this.State = response['State'];
        this.Message = response['Message'];
        this.ErrorMessage = response['ErrorMessage'];

        if (this.State === EnumStatus.Success) {
          //  Show success alert
          await this.Swal2.Success(this.Message || 'Instructor data saved successfully!');
         
        } else {
          //  Show error alert
          await this.Swal2.Error(this.ErrorMessage || 'Something went wrong while saving data!');
        }

      } catch (ex) {
        console.error('Error:', ex);
        await this.Swal2.Error('An unexpected error occurred while submitting the form.');
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoading = false;
        }, 200);
      }
    } 
    else {
      //  User clicked Cancel
      this.toastr.info('Submission cancelled.');
      return;
    }
  });
}



  async onFinalSubmit() {
    this.isSubmitted = true;

    this.request.Aadhar = this.InstructorForm.value.Aadhar
    if (this.request.IsDomicile == true && this.request.JanAadhar == '') {
      this.toastr.warning("Please Add Janaadhar Number ")
      return
    }
    //if (this.request.IsDomicile == true && this.IsJANVerify == false) {
    //  this.toastr.warning("Please Verify or Add Valid JanAadhar ")
    //  return
    //}
    if (this.request.ddlState != '6') {
      this.InstructorForm.controls['PropTehsilID'].clearAsyncValidators()
      this.InstructorForm.controls['Correspondence_PropTehsilID'].clearAsyncValidators()
      this.InstructorForm.controls['PropTehsilID'].updateValueAndValidity()
      this.InstructorForm.controls['Correspondence_PropTehsilID'].updateValueAndValidity()
    }

    if (this.InstructorForm.invalid) {
      return
    }
    if (this.educationList.length == 0) {
      this.toastr.warning("Please Add Education Detail")
      return
    }
    if (this.techRequestList.length < 1) {
      this.toastr.warning("Please Add Technical Details")
      return
    }
    if (this.employeeRequestList.length == 0) {
      this.toastr.warning("Please Add Employee Details")
      return
    }
    this.Swal2.Confirmation("Are you sure you want to final Submit?,you cannot make changes after this", async (result: any) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.loaderService.requestStarted();
        try {
          const ssoid = this.request.Uid;

          //this.request = this.InstructorForm.value as ITI_InstructorDataModel;
          this.request.CreatedBy = '0'
          this.request.DepartmentID = '2'
          this.request.Uid = ssoid;
          this.request.EmploymentDetails = this.employeeRequestList;
          this.request.TechnicalQualifications = this.techRequestList;
          this.request.EducationalQualifications = this.educationList;
          console.log('Final Request Data:', this.request);
          if (this.request.StatusID = 9) {
            this.request.StatusID = 1
          } else {
            this.request.StatusID = 8 
          }

          
          const response: any = await this.ItiInstructorService.SaveInstructorData(this.request);
          this.State = response['State'];
          this.Message = response['Message'];
          this.ErrorMessage = response['ErrorMessage'];

          if (this.State === EnumStatus.Success) {
            //  Show success alert
            await this.Swal2.Success(this.Message || 'Instructor data saved successfully!');
            //this.InstructorForm.reset();
            //this.employeeRequestList = [];
            //this.techRequestList = [];
            //this.educationList = [];
          } else {
            //  Show error alert
            await this.Swal2.Error(this.ErrorMessage || 'Something went wrong while saving data!');
          }

        } catch (ex) {
          console.error('Error:', ex);
          await this.Swal2.Error('An unexpected error occurred while submitting the form.');
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
            this.isLoading = false;
          }, 200);
        }
      }
      else {
        //  User clicked Cancel
        this.toastr.info('Submission cancelled.');
        return;
      }
    });
  }



  async GetById(ID: string) {

    try {
      if (ID == "") {
        this.toastr.error("Please Enter SSOID");
        return;
      }

      await this.ItiInstructorService.GetInstructorDataBySsoid(ID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          ;
          if (data['Data']['Table'] && data['Data']['Table'].length === 0) {

            await this.SSOIDGetSomeDetails(ID)
            if (this.isSSOVisible) {
              this.InstructorForm.get('Uid')?.disable();

            } else {
              this.InstructorForm.get('Uid')?.enable();
            }

            return

          } else {
            if (this.sSOLoginDataModel.RoleID != 20 && this.sSOLoginDataModel.RoleID != 43 && this.urlId == '' &&
              data['Data']['Table'][0]['StatusID']!=9
           
            ) {

              this.swat.Info("Already Fill");

              setTimeout(() => {
                window.open('/InstructorTab', '_self');
              }, 1500);
     
            }
            
            this.isSSOVisible = true;
            this.request = data['Data']['Table'][0]
           
            const safeRequest = Object.fromEntries(
              Object.entries(this.request || {}).map(([key, value]) => [key, value ?? ''])
            );
            this.request.Dob = this.dateSetter(data['Data']['Table'][0]['Dob'])

            this.InstructorForm.patchValue({
              ddlDistrict: this.request.ddlDistrict,
              dob: this.request.Dob,
              AadharDocument: this.request.AadharDocument,
              PermanentDocument: this.request.PermanentDocument
            });


        
            if (data['Data']['Table1'] && data['Data']['Table1'].length > 0) {
              this.educationList = data['Data']['Table1']
            }
            if (data['Data']['Table2'] && data['Data']['Table2'].length > 0) {
              this.employeeRequestList = data['Data']['Table2']
            }
            if (data['Data']['Table3'] && data['Data']['Table3'].length > 0) {
              this.techRequestList = data['Data']['Table3']
            }

            if (this.sSOLoginDataModel.RoleID != 20 && this.sSOLoginDataModel.RoleID != 43 && this.request.StatusID!=9) {
              this.EducationForm.disable()
              this.EmploymentForm.disable()
              this.TechnicalForm.disable()
              this.InstructorForm.disable()
            }
            await this.commonMasterService.DistrictMaster_StateIDWise(Number(this.InstructorForm.value.Correspondence_ddlState))
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.DistrictMasterList3 = data['Data'];

              }, error => console.error(error));

            await this.commonMasterService.DistrictMaster_StateIDWise(Number(this.InstructorForm.value.ddlState))
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.DistrictMasterList = data['Data'];

               


              }, error => console.error(error));
        
            await this.commonMasterService.TehsilMaster_DistrictIDWise(this.InstructorForm.value.Correspondence_ddlDistrict)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.TehsilMasterList2 = data['Data'];

       
              }, error => console.error(error));

            await this.commonMasterService.TehsilMaster_DistrictIDWise(Number(this.InstructorForm.value.ddlDistrict))
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.TehsilMasterList = data['Data'];
           
              }, error => console.error(error));
         
     
            this.InstructorForm.patchValue({
          
              Correspondence_PropTehsilID: this.request.Correspondence_PropTehsilID,
              Correspondence_ddlDistrict: this.request.Correspondence_ddlDistrict,
              PropTehsilID: this.request.PropTehsilID,
              
            });
            this.request.ddlDistrict = this.InstructorForm.value.ddlDistrict
            console.log(this.request, "sdas")
            if (this.isSSOVisible) {
              this.InstructorForm.get('Uid')?.disable();
            } else {
              this.InstructorForm.get('Uid')?.enable();
            }
          }

  


        }, (error: any) => console.error(error));
      console.log('Request Datas:', this.request);
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 2000);
    }
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    const inputChar = String.fromCharCode(charCode);

    if (charCode <= 31) return true;
    if (charCode >= 48 && charCode <= 57) return true;

    if (inputChar === '.') {
      const input = (event.target as HTMLInputElement).value;
      if (input.indexOf('.') === -1) return true;
    }
    return false;
  }


  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {
    if (SSOID == "") {
      this.toastr.error("Please Enter SSOID");
      return;
    }

    const username = SSOID; // or hardcoded 'SIDDHA.AZAD'
    const appName = 'madarsa.test';
    const password = 'Test@1234';

    /*const url = `https://ssotest.rajasthan.gov.in:4443/SSOREST/GetUserDetailJSON/${username}/${appName}/${password}`;*/

    this.requestSSoApi.SSOID = username;
    this.requestSSoApi.appName = appName;
    this.requestSSoApi.password = password;


    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.CommonVerifierApiSSOIDGetSomeDetails(this.requestSSoApi).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        let response = JSON.parse(JSON.stringify(data));
        this.isSSOVisible = false;
        if (response?.Data) {

          let parsedData = JSON.parse(response.Data);
          if (parsedData != null) {
            
            this.isSSOVisible = true;
            this.request.Name = parsedData.displayName;
            //this.employeeRequest.Employer_Name = parsedData.displayName
            this.request.Mobile = parsedData.mobile;
            this.request.Email = parsedData.mailPersonal;
            this.request.Uid = parsedData.SSOID;
            this.request.Gender = parsedData.gender;
            if (this.request.Gender == undefined || this.request.Gender == null) {
              this.request.Gender=''
            }
            this.request.Correspondence_PlotHouseBuildingNo = parsedData.postalAddress;
            this.request.ddlState = parsedData.st;
            if (this.request.ddlState == undefined || this.request.ddlState == null) {
              this.request.ddlState ='0'
              this.InstructorForm.patchValue({
                ddlState: 0
              });

            }
            this.request.Aadhar = parsedData.AadhaarId,
              this.request.JanAadhar = parsedData.JanaadhaarId,
              this.request.Uid = SSOID


          }
          else {
            this.request.Uid = "";
            this.toastr.error("Enter Valid SSO ID")
            this.isSSOVisible = false;
            return;
          }
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
   
  async GetDetailsByJanAadhaar() {
    if (!this.request.JanAadhar || this.request.JanAadhar.length < 10 || this.request.JanAadhar.length > 12) {
      this.toastr.error("Invalid Jan Aadhaar Number");
      return;
    }
    this.IsJANVerify=false
    try {
      this.loaderService.requestStarted();

      const data: any = await this.StudentJanAadharDetailService.JanAadhaarMembersList(this.request.JanAadhar);

      if (data.State === EnumStatus.Success) {
        this.AdharMemberList = data.Data;
        console.log("Jan Aadhaar Details =>", this.AdharMemberList);

        if (this.AdharMemberList && this.AdharMemberList.length > 0) {
          /*    const member = this.AdharMemberList[0];*/
          this.IsShow = false
          this.IsShowDrop=true  
          //this.request.Name = member.NAME || '';
          //this.request.Mobile = member.MOBILE_NO || '';
          //this.request.Aadhar = member.AADHAR_REF_NO || '';
          
          //this.InstructorForm.patchValue({
          //  Name: this.request.Name,
          //  FatherOrHusbandName: this.request.FatherOrHusbandName,
          //  MotherName: this.request.MotherName,
          //  Mobile: this.request.Mobile,
          //  Aadhar: this.request.Aadhar,
          //  Dob: this.request.Dob,
          //  Gender: this.request.Gender
          //});
        }
      }
      else if (data.State === EnumStatus.Warning) {
        this.toastr.warning(data.Message + " Please check Jan Aadhaar number again");
      }
      else {
        this.toastr.error(data.ErrorMessage);
      }
    } catch (error) {
      console.error("Error fetching Jan Aadhaar details", error);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }


  async SendJanaadharOTP(row: IStudentJanAadharDetailModel) {
    try {
      this.Swal2.Confirmation("Are you sure you want to Generate OTP ?", async (result: any) => {
        if (result.isConfirmed) {
          this.SendOTP(row)
        }
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


  ResendOTP() {
    this.SendOTP(this.resendModel)
    this.resendModel = new IStudentJanAadharDetailModel()
  }


  async SendOTP(row: IStudentJanAadharDetailModel) {
    this.resendModel = row
    await this.StudentJanAadharDetailService.SendJanaadharOTP(row)
      .then((data: any) => {

        data = JSON.parse(JSON.stringify(data));
        console.log(data);
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];

        if (this.State == EnumStatus.Success) {
          this.startTimer();
          this.toastr.success('OTP sent Successfully')
          this.ResposeOTPModel = data['Data'];
          this.openModalGenerateOTP(this.modal_GenrateOTP, row);
        }
        else {
          this.toastr.error(this.ErrorMessage)
        }

      }, (error: any) => console.error(error)
      );
  }


  async VerifyOTP() {

    if (this.OTP.length > 0) {
      try {
        this.isSubmitted = true;
        this.loaderService.requestStarted();
        this.ResposeOTPModel.OTP = this.OTP;
        await this.StudentJanAadharDetailService.VerifyOTP(this.ResposeOTPModel)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log(data);
            if (this.State == EnumStatus.Success) {
              if (data.Data.janmemid == null || data.Data.janmemid == undefined || data.Data.janmemid == " " || data.Data.janaadhaarId == null || data.Data.janaadhaarId == undefined || data.Data.janaadhaarId == " ") {
                this.janaadharMemberDetails.janaadhaarId = this.resendModel.JAN_AADHAR
                this.janaadharMemberDetails.janmemid = this.resendModel.JAN_MEMBER_ID
              } else {
                this.janaadharMemberDetails = data.Data;
              }

              this.CloseModal();
              this.IsShow = true;
              this.IsShowDropdown = false;
              this.IsJANVerify=true
              this.Address = data.Data.Address;
              await this.FillMemberDetails();
              this.toastr.success("Succesfully Verified")
            }
            else {
              this.toastr.warning('Invalid OTP Please Try Again');
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
    else {
      this.toastr.warning('Please Enter OTP');
    }
  }

  startTimer(): void {
    this.showResendButton = false;
    this.timeLeft = GlobalConstants.DefaultTimerOTP * 60;

    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.showResendButton = true;
      }
    }, 1000);
  }

  CloseModal() {

    this.modalService.dismissAll();
  }

  async openModalGenerateOTP(content: any, row: IStudentJanAadharDetailModel) {
    console.log(row)

    this.OTP = '';
    this.MobileNo = '';
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


  async FillMemberDetails() {
    try {
      console.log(this.janaadharMemberDetails, "hhh")
      this.request.Name = this.janaadharMemberDetails.nameEng;
      this.request.FatherOrHusbandName = this.janaadharMemberDetails.fnameEng;
      this.request.MotherName = this.janaadharMemberDetails.mnameEng;
      this.request.Gender = this.janaadharMemberDetails?.gender == 'Male' ? '97' : this.janaadharMemberDetails?.gender == 'Female' ? '98' : '99';
      this.request.Mobile = this.janaadharMemberDetails.mobile;
      this.request.Email = this.janaadharMemberDetails.email;
      this.request.JanAadharMemberID = this.janaadharMemberDetails.janmemid;
      this.request.JanAadhar = this.janaadharMemberDetails.janaadhaarId;

      var result = this.CategoryAlist.find((f: any) => f.CasteCategoryName == this.janaadharMemberDetails.category)
      if (result != null || result != undefined) {
        this.request.Category = result.CasteCategoryID;
      }
      const dateStr = this.janaadharMemberDetails.dob;
      const [day = '', month = '', year = ''] = dateStr?.split('/') ?? [];
      const formattedDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];
      this.request.Dob = formattedDate;
    }
    catch (ex) {
      console.log(ex);

    }
  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      
      this.file = event.target.files[0];
      if (this.file) {
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "EducationType") {
                this.educationRequest.EducationDocument = data['Data'][0]["FileName"];
              }
              else if (Type == "TechType") {
                this.techRequest.TechDocument = data['Data'][0]["FileName"];
              }
              else if (Type == "EmpType") {
                this.employeeRequest.EmploymentDocument = data['Data'][0]["FileName"];
              }
              else if (Type == "Aadhar") {
                this.request.AadharDocument = data['Data'][0]["FileName"];
              }
              else if (Type == "PermanentDocument") {
                this.request.PermanentDocument = data['Data'][0]["FileName"];
              }
              else if (Type == "Basicsalary") {
                this.employeeRequest.BasicSalaryDocument = data['Data'][0]["FileName"];
              }
              else if (Type == "PanDoc") {
                this.employeeRequest.panDocument = data['Data'][0]["FileName"];
              }
              //else if (Type == "CITS") {
              //  this.techRequest.Tech_CITSCertifiedDocument = data['Data'][0]["FileName"];
              //}


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
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  Back() {
    debugger
    this.isSSOVisible = false;
    this.EducationForm.reset();
    this.TechnicalForm.reset();
    this.InstructorForm.reset();
    this.EmploymentForm.reset();
    this.request = new ITI_InstructorDataModel()
    this.InstructorForm.controls['Uid'].reset(); // reset value
    this.InstructorForm.controls['Uid'].enable();

  }

  Back2() {
    this.formSaved.emit(true);
  }

  openDatePicker(event: any) {
    event.target.showPicker();
  }


  validateNumber(event: KeyboardEvent): void {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.keyCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  async GetPassingYearDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.AdmissionPassingYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PassingYearList = data['Data'];

        }, (error: any) => console.error(error)
        );
      console.log('Passing Year List ==>', this.PassingYearList)
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
  async BoardDropdownData(MasterCode: string) {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'Board':
          this.BoardList = data['Data'];
          break;
        default:
          break;
      }
    });
  }



 //async onCopyCorrespondenceToggle() {
 //   if (this.sameAsPermanent) {
 //     this.request.Correspondence_PlotHouseBuildingNo = this.request.PlotHouseBuildingNo;
 //     this.request.Correspondence_StreetRoadLane = this.request.StreetRoadLane;
 //     this.request.Correspondence_AreaLocalitySector = this.request.AreaLocalitySector;
 //     this.request.Correspondence_LandMark = this.request.LandMark;
 //     this.request.Correspondence_ddlState = this.request.ddlState;
 //     await this.ddlState_Change2()
 //     this.request.Correspondence_ddlDistrict = this.request.ddlDistrict;
 //     await this.ddlDistrict_Change()
 //     this.request.Correspondence_PropTehsilID = this.request.PropTehsilID;
 //     this.request.Correspondence_City = this.request.City;
 //     this.request.Correspondence_pincode = this.request.pincode;

 //     //  Disable all correspondence fields in FormGroup (if reactive)
 //     if (this._InstructorForm) {
 //       Object.keys(this._InstructorForm.controls).forEach(key => {
 //         if (key.startsWith('Correspondence_')) {
 //           this.InstructorForm.controls[key].disable({ emitEvent: false });
 //         }
 //       });
 //     }
 //   } else {
 //     //  Enable all correspondence fields
 //     if (this._InstructorForm) {
 //       Object.keys(this._InstructorForm.controls).forEach(key => {
 //         if (key.startsWith('Correspondence_')) {
 //           this.InstructorForm.controls[key].enable({ emitEvent: false });
 //         }
 //       });
 //     }

 //     //  Clear all correspondence values
 //     this.request.Correspondence_PlotHouseBuildingNo = '';
 //     this.request.Correspondence_StreetRoadLane = '';
 //     this.request.Correspondence_AreaLocalitySector = '';
 //     this.request.Correspondence_LandMark = '';
 //     this.request.Correspondence_ddlState = '';
 //     this.request.Correspondence_ddlDistrict = '';
 //     this.request.Correspondence_PropTehsilID = '';
 //     this.request.Correspondence_City = '';
 //     this.request.Correspondence_pincode = '';
 //   }
  // }


  toggleAddress(event: Event) {


    this.sameAsPermanent = !this.sameAsPermanent;
    if (!this.sameAsPermanent) {
      this.sameAsPermanent = false
    }

    this.sameAsPermanent = (event.target as HTMLInputElement).checked;

    if (this.sameAsPermanent) {

      this.syncAddress();
      this.EnableDisableCorsAddressDetail(true)
    } else {

      this.EnableDisableCorsAddressDetail(false)
    }
  }


  async syncAddress() {
    if (this.sameAsPermanent) {

      this.request.Correspondence_PlotHouseBuildingNo = this.request.PlotHouseBuildingNo;
      this.request.Correspondence_StreetRoadLane = this.request.StreetRoadLane;
      this.request.Correspondence_AreaLocalitySector = this.request.AreaLocalitySector;
      this.request.Correspondence_LandMark = this.request.LandMark;
      this.request.Correspondence_ddlState = this.request.ddlState;
      this.request.Correspondence_ddlDistrict = this.request.ddlDistrict;

      await this.ddlState_Change2();
      this.request.Correspondence_ddlDistrict = this.request.ddlDistrict;

      debugger
      await this.commonMasterService.CityMasterDistrictWise(this.InstructorForm.value.ddlDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CityMasterDDLList = data['Data'];
          console.log(this.CityMasterDDLList, "CityMasterDDLList")

        }, error => console.error(error));
      debugger
      this.InstructorForm.value.Correspondence_ddlDistrict = this.request.Correspondence_ddlDistrict
      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.InstructorForm.value.Correspondence_ddlDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterList2 = data['Data'];
          debugger
          this.request.Correspondence_PropTehsilID = '0'
        }, error => console.error(error));
      this.request.Correspondence_ddlState = this.request.ddlState;
      this.request.Correspondence_PropTehsilID = this.request.PropTehsilID;

      this.request.Correspondence_City = this.request.City;
      this.request.Correspondence_pincode = this.request.pincode;
    }
  }

  EnableDisableCorsAddressDetail(isSelected: boolean) {

    const fields = [
      'Correspondence_PlotHouseBuildingNo',
      'Correspondence_StreetRoadLane',
      'Correspondence_AreaLocalitySector',
      'Correspondence_LandMark',
      'Correspondence_ddlState',
      'Correspondence_ddlDistrict',
      'Correspondence_PropTehsilID',
      'Correspondence_City',
      'Correspondence_pincode'
    ];

    fields.forEach(field => {
      const control = this.InstructorForm.controls[field];
      if (control) {
        isSelected
          ? control.disable({ emitEvent: false })
          : control.enable({ emitEvent: false });
      }
    });
  }

  async onCopyCorrespondenceToggle() {
    debugger
    if (this.sameAsPermanent) {
      debugger
      // Copy permanent → correspondence
      this.request.Correspondence_PlotHouseBuildingNo = this.request.PlotHouseBuildingNo;
      this.request.Correspondence_StreetRoadLane = this.request.StreetRoadLane;
      this.request.Correspondence_AreaLocalitySector = this.request.AreaLocalitySector;
      this.request.Correspondence_LandMark = this.request.LandMark;
      this.request.Correspondence_ddlState = this.request.ddlState;

      await this.ddlState_Change2();
      this.request.Correspondence_ddlDistrict = this.request.ddlDistrict;

      await this.ddlDistrict_Change();
      this.request.Correspondence_PropTehsilID = this.request.PropTehsilID;
      this.request.Correspondence_City = this.request.City;
      this.request.Correspondence_pincode = this.request.pincode;

      // Disable
      Object.keys(this.InstructorForm.controls).forEach(key => {
        if (key.startsWith('Correspondence_')) {
          this.InstructorForm.controls[key].disable({ emitEvent: false });
        }
      });

    } else {
      
      // Enable back
      Object.keys(this.InstructorForm.controls).forEach(key => {
        if (key.startsWith('Correspondence_')) {
          this.InstructorForm.controls[key].enable({ emitEvent: false });
        }
      });
      debugger
      // Clear
      this.request.Correspondence_PlotHouseBuildingNo = '';
      this.request.Correspondence_StreetRoadLane = '';
      this.request.Correspondence_AreaLocalitySector = '';
      this.request.Correspondence_LandMark = '';
      this.request.Correspondence_ddlState = '';
      this.request.Correspondence_ddlDistrict = '';
      this.request.Correspondence_PropTehsilID = '';
      this.request.Correspondence_City = '';
      this.request.Correspondence_pincode = '';
    }
  }



  onMarksTypeChange() {
    const selectedType = this.TechnicalForm.get('Tech_MarksTypeID')?.value;
    const cgpaCtrl = this.TechnicalForm.get('Tech_CGPA');
    const percCtrl = this.TechnicalForm.get('Tech_Percentage');
    cgpaCtrl?.clearValidators();
    percCtrl?.clearValidators();
    if (selectedType == '1') {
      percCtrl?.reset();
      cgpaCtrl?.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(10)     // CGPA cannot exceed 10
      ]);
    }
    else if (selectedType == '0') {
      cgpaCtrl?.reset();
      percCtrl?.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]);
    }

    cgpaCtrl?.updateValueAndValidity();
    percCtrl?.updateValueAndValidity();
  }



  async GetcOmmonData1() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('ExamOfLevel')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExaminationPassed = data['Data'];
          console.log('Examination Passed ==> ', this.ExaminationPassed);
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


  async GetcOmmonData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('ExamOfLevel')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //const allItems = data['Data'];
          //const allowed = ['8TH', '10TH', '10+2'];
          //this.ExaminationPassed = allItems.filter((x: any) =>
          //  allowed.includes(x.Name.toUpperCase())
          //);
          this.ExaminationPassed = data['Data'];
          console.log('Filtered Examination Passed ==> ', this.ExaminationPassed);
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


  async GetcOmmonData22() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.GetCommonMasterDDLByType('ExamOfLevel')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          const allItems = data['Data'];

          // Items you want to show
          const allowed = [
            'DIPLOMA',
            'DEGREE',
            'POST GRADUATION',
            'ANY OTHER'
          ];

          // Filter only allowed items
          this.ExaminationPassed2 = allItems.filter((x: any) =>
            allowed.includes(x.Name.toUpperCase())
          );

          console.log('Filtered Examination Passed ==> ', this.ExaminationPassed2);
        });
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


  onPanInput(event: any) {
    event.target.value = event.target.value.toUpperCase();
    this.EmploymentForm.get('Pan_No')?.setValue(event.target.value, { emitEvent: false });
  }


  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  //async onExamChange(selectedValue: string) {
  //  if (!selectedValue) {
  //    const ctrl = this.EducationForm.get('Education_Subjects');
  //    if (ctrl?.disabled) ctrl.enable({ emitEvent: false });
  //    return;
  //  }

  //  const sel = (selectedValue || '').trim().toUpperCase();
  //  const autoExams = ['Middle school', 'Secondary'];
  //  if (autoExams.includes(sel)) {
  //    const value = 'All Subject';
  //    this.educationRequest.Education_Subjects = value;
  //    const ctrl = this.EducationForm.get('Education_Subjects');
  //    ctrl?.setValue(value, { emitEvent: false });
  //    ctrl?.disable({ emitEvent: false });
  //  }
  //  else if (sel === 'Higher secondary') {
  //    this.educationRequest.Education_Subjects = '';

  //    const ctrl = this.EducationForm.get('Education_Subjects');
  //    ctrl?.enable({ emitEvent: false });
  //    ctrl?.setValue('', { emitEvent: false });
  //  }
  //  else {
  //    const ctrl = this.EducationForm.get('Education_Subjects');
  //    if (ctrl?.disabled) ctrl.enable({ emitEvent: false });
  //  }
  //}


  //async onExamChange(selectedId: string) {
  //  console.log('onExamChange called with:', selectedId);
  //  if (!selectedId) {
  //    const ctrl = this.EducationForm.get('Education_Subjects');
  //    if (ctrl?.disabled) ctrl.enable({ emitEvent: false });
  //    return;
  //  }
  //  if (!Array.isArray(this.eduQualificationDDL)) {
  //    console.warn('eduQualificationDDL not loaded yet');
  //    return;
  //  }
  //  const selected = this.eduQualificationDDL.find(
  //    x => String(x.QualificationID) === String(selectedId)
  //  );
  //  console.log('selected item:', selected);
  //  const name = selected?.QualificationName?.trim().toLowerCase() ?? '';

  //  const autoExams = ['middle school', 'secondary'];
  //  const subjectsCtrl = this.EducationForm.get('Education_Subjects');

  //  if (autoExams.includes(name)) {
  //    const value = 'All Subject';
  //    this.educationRequest.Education_Subjects = value;
  //    subjectsCtrl?.setValue(value, { emitEvent: false });
  //    subjectsCtrl?.disable({ emitEvent: false });
  //  } else if (name === 'higher secondary') {
  //    this.educationRequest.Education_Subjects = '';
  //    subjectsCtrl?.enable({ emitEvent: false });
  //    subjectsCtrl?.setValue('', { emitEvent: false });
  //  } else {
  //    if (subjectsCtrl?.disabled) subjectsCtrl.enable({ emitEvent: false });
  //  }
  //}



  //async QualificationDetailsLevel() {

  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.QualificationDetailsDDL(this.QualificationDetailsLevelDDL).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      this.QualificationDetailsLevelDDL = data.Data;
  //      console.log("GetQualificationLevel ==>", this.QualificationDetailsLevelDDL);
  //    })


  //  } catch (error) {
  //    console.error(error);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  async QualificationDetailsLevel() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.QualificationDetailsDDL(this.QualificationDetailsLevelDDL)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));

          const allowed = ["Diploma/Certificate Course", "Under Graduate", "Post Graduate"];
          this.QualificationDetailsLevelDDL = data.Data.filter(
            (x: any) => allowed.includes(x.QualificationLevel)
          );

          console.log("Filtered Qualification Levels ==>", this.QualificationDetailsLevelDDL);
        });

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  

  async EduQualificationDetailsLevel() {
    try {
      this.loaderService.requestStarted();

      const data: any = await this.commonMasterService.QualificationDetailsDDL(this.EduQualificationDetailsLevelDDL);
      const fullList = data?.Data ?? [];

      this.EduQualificationDetailsLevelDDL = fullList.filter((x: any) =>
        x.QualificationLevel === 'School Education' || x.QualificationLevel === 'Under Graduate' || x.QualificationLevel === 'Post Graduate'
      );

      console.log("Edu Filtered Qualification Levels ==>", this.EduQualificationDetailsLevelDDL);

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }

  async examinationPass(selectedLevel: string = '') {
    const level = selectedLevel ?? this.techRequest.QualificationLevel;
    this.techRequest.QualificationName = '';
    this.QualificationModel.QualificationLevel = level

    await this.commonMasterService.QualificationDDL(this.QualificationModel).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.QualificationDDL = data.Data;
      if (selectedLevel == 'Post Graduate') {
        this.QualificationDDL = this.QualificationDDL.filter((e: any) => e.QualificationID != 8 && e.QualificationID != 9)
      }
      else if (selectedLevel == 'Under Graduate') {
        this.QualificationDDL = this.QualificationDDL.filter((e: any) => e.QualificationID != 3 && e.QualificationID != 4)
      }
      console.log("GetQualificationDDL ==>", this.QualificationDDL);
    })
  }
  async eduExaminationPass(selectedLevel: string = '') {
    const level = selectedLevel ?? this.educationRequest.EduQualificationLevel;
    this.educationRequest.EduQualificationName = '';
    this.QualificationModel.QualificationLevel = level

    await this.commonMasterService.QualificationDDL(this.QualificationModel).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.eduQualificationDDL = data.Data;
      if (selectedLevel == 'Post Graduate') {
        this.eduQualificationDDL =this.eduQualificationDDL.filter((e: any) => e.QualificationID != 6 && e.QualificationID != 7)
      }
      else if (selectedLevel == 'Under Graduate') {
        this.eduQualificationDDL =this.eduQualificationDDL.filter((e: any) => e.QualificationID != 1 && e.QualificationID != 2)
      }
      console.log("edu Examination Pass ==>", this.eduQualificationDDL);
    })
  }

  async streamddl(selectedstream: string = '') {

    const level = selectedstream ?? this.techRequest.QualificationLevel;

    this.techRequest.Tech_Board = '';
    var Department:number = 0

    if (selectedstream == 'BTER') {
      Department = 1
    } else {
      Department = 2
    }

    await this.commonMasterService.StreamMaster(Department)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamList = data['Data'];
        console.log('Stream List ==> ', this.StreamList);
      }, error => console.error(error));
  }


  onFileChange(event: Event, type: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.TechnicalForm.patchValue({ Tech_CITSCertifiedDocument: file.name });
      this.techRequest.Tech_CITSCertifiedDocument = file.name;
    }
  }


  dynamicLabel: string = "";

  onEmployerChange() {
    const selected = this.EmploymentForm.get('Employer_Registration')?.value;

    switch (selected) {
      case 'TAN':
        this.dynamicLabel = "TAN of Employer";
        break;

      case 'GSTIN':
        this.dynamicLabel = "GSTIN of Employer";
        break;

      case 'EPFO':
        this.dynamicLabel = "EPFO Establishment No";
        break;

      case 'ESIC':
        this.dynamicLabel = "ESIC Registration No";
        break;

      case 'CIN':
        this.dynamicLabel = "CIN of Employer";
        break;

      default:
        this.dynamicLabel = "TAN of Employer";
        break;
    }
  }

  showOtherExam = false; 

  async onExamChange(selectedId: string) {
    console.log('onExamChange called with:', selectedId);

    if (!selectedId) {
      const ctrl = this.EducationForm.get('Education_Subjects');
      if (ctrl?.disabled) ctrl.enable({ emitEvent: false });

      this.showOtherExam = false;
      this.EducationForm.get('OtherExaminationPassed')?.clearValidators();
      this.EducationForm.get('OtherExaminationPassed')?.setValue('');
      this.EducationForm.get('OtherExaminationPassed')?.updateValueAndValidity({ emitEvent: false });
      return;
    }

    if (!Array.isArray(this.eduQualificationDDL)) {
      console.warn('eduQualificationDDL not loaded yet');
      return;
    }

    const selected = this.eduQualificationDDL.find(
      x => String(x.QualificationID) === String(selectedId)
    );
    console.log('selected item:', selected);

    const name = (selected?.QualificationName ?? '').toString().trim().toLowerCase();

    const autoExams = ['middle school', 'secondary'];
    const subjectsCtrl = this.EducationForm.get('Education_Subjects');

    if (autoExams.includes(name)) {
      const value = 'All Subject';
      this.educationRequest.Education_Subjects = value;
      subjectsCtrl?.setValue(value, { emitEvent: false });
      subjectsCtrl?.disable({ emitEvent: false });
    } else if (name === 'higher secondary') {
      this.educationRequest.Education_Subjects = '';
      subjectsCtrl?.enable({ emitEvent: false });
      subjectsCtrl?.setValue('', { emitEvent: false });
    } else {
      if (subjectsCtrl?.disabled) subjectsCtrl.enable({ emitEvent: false });
    }

    if (name === 'other') {
      this.showOtherExam = true;

      this.EducationForm.get('OtherExaminationPassed')?.setValidators([Validators.required]);
      this.EducationForm.get('OtherExaminationPassed')?.updateValueAndValidity({ emitEvent: false });

      this.EducationForm.get('OtherExaminationPassed')?.setValue('', { emitEvent: false });
    } else {
      if (this.showOtherExam) {
        this.showOtherExam = false;
        this.EducationForm.get('OtherExaminationPassed')?.clearValidators();
        this.EducationForm.get('OtherExaminationPassed')?.setValue('', { emitEvent: false });
        this.EducationForm.get('OtherExaminationPassed')?.updateValueAndValidity({ emitEvent: false });
      }
    }
  }

  async GetCITSTrade() {
    var Department: number = 0
    Department = 2
    
  await this.commonMasterService.StreamMaster(Department)
  .then((data: any) => {
    data = JSON.parse(JSON.stringify(data));
    this.CITSStreamList = data['Data'];
    console.log('Stream List ==> ', this.CITSStreamList);
  }, error => console.error(error));
  }


  dateSetter(date: any) {
    const Dateformat = new Date(date);
    const year = Dateformat.getFullYear();
    const month = String(Dateformat.getMonth() + 1).padStart(2, '0');
    const day = String(Dateformat.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }



  async GetVerifiationList() {
    try {
      debugger
      var obj = {
        InstructorID: this.request.ID,
        ActiveStatus: 1,
        StatusID: 0,
        Action: "VerificationList"
      }
      this.loaderService.requestStarted();
      await this.ItiInstructorService.GetverificationStatus(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.verifyrequest = data['Data'][0];

        }, (error: any) => console.error(error)
        );
      console.log('Passing Year List ==>', this.PassingYearList)
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


  janMember = new JanAadharVerifyMemberDetails()
  async getJanadharData(data: any)
  {
    try {
      this.janMember = data as JanAadharVerifyMemberDetails
      this.toastr.success("Succesfully Verified")
      console.log("getJanadharData", data);
    }
    catch (erro) {
      console.log(erro);
    }
  }

  @ViewChild(JanAadharDetailComponent) janadharComponent!: JanAadharDetailComponent;
  verifyJanadhar() {

    const janAadhar = this.request?.JanAadhar?.toString() ?? '';

    if (janAadhar=='')
    {
      this.toastr.warning("Please Enter Janaadhar Details");
    }

    if (janAadhar.length < 10 || janAadhar.length > 12)
    {
      this.toastr.error("Invalid Janadhar Details")
    }
    this.janadharComponent.startVerification(janAadhar);
  }




}



