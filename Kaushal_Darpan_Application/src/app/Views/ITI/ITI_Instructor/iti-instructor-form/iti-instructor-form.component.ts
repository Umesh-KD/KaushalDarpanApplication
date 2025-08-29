import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { DeferBlockBehavior } from '@angular/core/testing';
import html2canvas from 'html2canvas';
import { ITI_InstructorDataModel, ITI_InstructorEducationalQualification, ITI_InstructorEmploymentDetails, ITI_InstructorTechnicalQualification } from '../../../../Models/ITI/ItiInstructorDataModel';
import { ITI_InstructorService } from '../../../../Services/ITI/ITI_Instructor/ITI_Instructor.Service';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { ApplicationStudentDatamodel, IStudentJanAadharDetailModel, JanAadharMemberDetails } from '../../../../Models/StudentJanAadharDetailModel';

@Component({
  selector: 'app-iti-instructor',
  standalone: false,
  templateUrl: './iti-instructor-form.component.html',
  styleUrl: './iti-instructor-form.component.css'
})
export class ItiInstructorFormComponent {

  public urlId: number = 0;
  public InstructorForm!: FormGroup
  public EducationForm!: FormGroup
  public TechnicalForm!: FormGroup
  public EmploymentForm!: FormGroup
  public isSSOVisible: boolean = false;
  public showAadhaar: boolean = false;
  public showJanAadhaar: boolean = false;
  public ResidenceList: any = []
  public CompanyMasterDDLList: any[] = [];
  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;
  public DistrictMasterList: any[] = [];
  public StateMasterList: any[] = [];
  public DistrictMasterList3: any[] = [];
  public BoardList: any = []
  closeResult: string | undefined;

  public request = new ITI_InstructorDataModel()
  public educationList: ITI_InstructorEducationalQualification[] = [];
  public educationRequest: ITI_InstructorEducationalQualification = new ITI_InstructorEducationalQualification();
  public techRequestList: ITI_InstructorTechnicalQualification[] = [];
  public techRequest = new ITI_InstructorTechnicalQualification()
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
    private Swal2: SweetAlert2
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


    this.InstructorForm = this.formBuilder.group(
      {
        // Personal Details
        Uid: ['', Validators.required],
        IsDomicile: [false, Validators.required] ,
        Name: ['', Validators.required],
        FatherOrHusbandName: ['', Validators.required],
        MotherName: ['', Validators.required],
        Dob: ['', Validators.required],
        Gender: ['', [DropdownValidators]],
        MaritalStatus: ['', [DropdownValidators]],
        Category: ['', [DropdownValidators]],
        Mobile: ['', Validators.required],
        Email: ['', Validators.required],

        // Permanent Address
        PlotHouseBuildingNo: ['', Validators.required],
        StreetRoadLane: ['', Validators.required],
        AreaLocalitySector: ['', Validators.required],
        LandMark: ['', Validators.required],
        ddlState: ['', [DropdownValidators]],
        ddlDistrict: ['', [DropdownValidators]],
        PropTehsilID: [''],
        PropUrbanRural: [''],
        City: ['', Validators.required],
        villageID: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
        //  pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],

        // Correspondence Address
        Correspondence_PlotHouseBuildingNo: ['', Validators.required],
        Correspondence_StreetRoadLane: ['', Validators.required],
        Correspondence_AreaLocalitySector: ['', Validators.required],
        Correspondence_LandMark: ['', Validators.required],
        Correspondence_ddlState: ['', [DropdownValidators]],
        Correspondence_ddlDistrict: ['', [DropdownValidators] ],
        Correspondence_PropTehsilID: ['', [DropdownValidators]],
        Correspondence_PropUrbanRural: [''],
        Correspondence_City: ['', Validators.required],
        Correspondence_villageID: ['', Validators.required],
        Correspondence_pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],

        // Educational Qualification
        Education_Exam: [''],
        Education_Board: [''],
        Education_Year: [''],
        Education_Subjects: [''],
        Education_Percentage: [''],
        QualificationDocument: [''],

        // Technical Qualification
        Tech_Exam: [''],
        Tech_Board: [''],
        Tech_Subjects: [''],
        Tech_Year: [''],
        Tech_Percentage: [''],
        TechQualificationDocument: [''],

        // Employment Details
        Pan_No: ['',],
        Employee_Type: [''],
        Employer_Name: [''],
        Employer_Address: [''],
        Tan_No: [''],
        Aadhar: ['', [Validators.required, Validators.pattern(GlobalConstants.AadhaarPattern)]],
        JanAadhar: [''],
        Employment_From: [''],
        Employment_To: [''],
        Basic_Pay: [''],
        EmploymentDocument: [''],
        TehsilName: ['', Validators.required]
      });


    this.EducationForm = this.formBuilder.group({
      Education_Exam: ['', Validators.required],
      Education_Board: ['', Validators.required],
      Education_Year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      Education_Subjects: ['', Validators.required],
      Education_Percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      EducationDocument: ['', Validators.required]
    });


    this.TechnicalForm = this.formBuilder.group({
      Tech_Exam: ['', Validators.required],
      Tech_Board: ['', Validators.required],
      Tech_Subjects: ['', Validators.required],
      Tech_Year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      Tech_Percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      TechDocument: ['', Validators.required]
    });


    this.EmploymentForm = this.formBuilder.group({
      Pan_No: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      Employee_Type: ['', Validators.required],
      Employer_Name: ['', Validators.required],
      Employer_Address: ['', Validators.required],
      Tan_No: ['', Validators.required],
      //Aadhar: [''],
      //JanAadhar: [''],
      Employment_From: ['', Validators.required],
      Employment_To: ['', Validators.required],
      Basic_Pay: ['', Validators.required],
      EmploymentDocument: ['', Validators.required]
    });


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    let idParam = Number(this.activatedRoute.snapshot.paramMap.get('id')?.toString());
    this.urlId = idParam;

    this.GetInstituteCategoryList();
    this.GetManagmentType();
    this.GetStateMaterData()
    this.GetLateralCourse()
  }

  get _InstructorForm() { return this.InstructorForm.controls; }

  async ddlDistrict_Change() {

    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.InstructorForm.value.ddlDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterList = data['Data'];

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

      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.InstructorForm.value.Correspondence_ddlDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterList2 = data['Data'];

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
    if (!this.educationRequest.Education_Exam || !this.educationRequest.Education_Board) {
      alert("Please fill required fields before adding");
      return;
    }

    this.educationList.push({ ...this.educationRequest });

    this.educationRequest = new ITI_InstructorEducationalQualification();

    this.EducationForm.reset();
  }

  removeEducation(index: number) {
    this.educationList.splice(index, 1);
  }



  addTechQualification() {
    if (!this.techRequest.Tech_Exam || !this.techRequest.Tech_Board) {
      alert("Please fill required fields before adding");
      return;
    }

    this.techRequestList.push({ ...this.techRequest });

    this.techRequest = new ITI_InstructorTechnicalQualification();

    this.TechnicalForm.reset();
  }

  removeTech(index: number) {
    this.techRequestList.splice(index, 1);
  }


  addEmployeeQualification() {
    if (!this.employeeRequest.Pan_No || !this.employeeRequest.Employer_Name) {
      alert("Please fill required fields before adding");
      return;
    }

    this.employeeRequestList.push({ ...this.employeeRequest });

    this.EmploymentForm.reset();
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

  onReset(): void {
    this.InstructorForm.reset();
  }


  async onSubmit() {

    debugger;

    console.log('Form submitted:iinstructor', this.InstructorForm.value);
    this.isLoading = true;
    this.isSubmitted = true;
    this.loaderService.requestStarted();

    try {
      if (this.InstructorForm.valid) {

        var ssoid = this.request.Uid
        this.request = this.InstructorForm.value as ITI_InstructorDataModel;

        this.request.CreatedBy = this.sSOLoginDataModel.UserID.toString();
        this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID.toString();

        this.request.Uid = ssoid
        this.request.EmploymentDetails = this.employeeRequestList;
        this.request.TechnicalQualifications = this.techRequestList;
        this.request.EducationalQualifications = this.educationList;

        await this.ItiInstructorService.SaveInstructorData(this.request)
          .then((response: any) => {
            this.State = response['State'];
            this.Message = response['Message'];
            this.ErrorMessage = response['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              this.toastr.success(this.Message);

            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
            console.log('Response from service:', response);
          });
        console.log('Request Data:', this.request);
      } else {
        console.log('Form is invalid');
        this.InstructorForm.markAllAsTouched();
      }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }


  async GetById(ID: string) {

    debugger

    try {
      if (ID == "") {
        this.toastr.error("Please Enter SSOID");
        return;
      }

      await this.ItiInstructorService.GetInstructorDataBySsoid(ID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data['Data']['Table'] && data['Data']['Table'].length === 0) {

            await this.SSOIDGetSomeDetails(ID)
            return

          } else {

            this.toastr.error("Already Fill")
            this.isSSOVisible = true;
            this.request = data['Data']['Table'][0]
            this.InstructorForm.patchValue(this.request);
            if (data['Data']['Table1'] && data['Data']['Table1'].length > 0) {
              this.educationList = data['Data']['Table1']
            }

            if (data['Data']['Table2'] && data['Data']['Table2'].length > 0) {
              this.employeeRequestList = data['Data']['Table2']
            }
            if (data['Data']['Table3'] && data['Data']['Table3'].length > 0) {
              this.techRequestList = data['Data']['Table3']

            }

            this.EducationForm.disable()
            this.EmploymentForm.disable()
            this.TechnicalForm.disable()
            this.InstructorForm.disable()

            await this.ddlState_Change2();
            await this.ddlState_Change();
            await this.ddlDistrict_Change();
            await this.ddlDistrict_Change2();

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

  async changeUrbanRural() {
    // this.GetGramPanchayatSamiti()
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
    debugger
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
            this.request.Mobile = parsedData.mobile;
            this.request.Email = parsedData.mailPersonal;
            this.request.Uid = parsedData.SSOID;
            this.request.Gender = parsedData.gender;
            this.request.Correspondence_PlotHouseBuildingNo = parsedData.postalAddress;
            this.request.ddlState = parsedData.st;
            this.request.Aadhar = parsedData.AadhaarId,
              this.request.JanAadhar = parsedData.JanaadhaarId,
              this.request.Uid = SSOID

            this.InstructorForm.get('Uid')?.disable();
            this.InstructorForm.patchValue({
              Name: this.request.Name,
              Mobile: this.request.Mobile,
              Gender: this.request.Gender,
              Dob: this.request.Dob,
              Email: this.request.Email,
              pincode: this.request.pincode,
              Correspondence_PlotHouseBuildingNo: this.request.Correspondence_PlotHouseBuildingNo,
              ddlState: this.request.ddlState,
              Aadhar: this.request.Aadhar,
              JanAadhar: this.request.JanAadhar,
              Uid: this.request.Uid

            });

          }
          else {
            this.request.Uid = "";
            this.isSSOVisible = true;
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

    if (this.request.JanAadhar.length < 10 || this.request.JanAadhar.length > 12) {
      this.toastr.error("Invalid Janadhar Details")
    }
    try {
      this.loaderService.requestStarted();
      await this.StudentJanAadharDetailService.JanAadhaarMembersList(this.request.JanAadhar)

        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.AdharMemberList = data.Data;
            console.log(this.AdharMemberList, "adhar");
            this.request.Name = data['Data']['NAME'];
            console.log(this.request, "request");
          } else if (data.State === EnumStatus.Warning) {
            this.toastr.warning(data.Message + " Please check Janadhar/ Adhar Number again")
          } else {
            this.toastr.error(data.ErrorMessage)
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

  async SendJanaadharOTP(row: IStudentJanAadharDetailModel) {
    try {
      this.Swal2.Confirmation("Are you sure you want to Generate OTP ?", async (result: any) => {
        // Check if the user confirmed the action
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
            debugger
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
      this.model.StudentName = this.janaadharMemberDetails.nameEng;
      this.model.FatherName = this.janaadharMemberDetails.fnameEng;
      this.model.MotherName = this.janaadharMemberDetails.mnameEng;
      this.model.Gender = this.janaadharMemberDetails?.gender == 'Male' ? '97' : this.janaadharMemberDetails?.gender == 'Female' ? '98' : '99';
      this.model.MobileNumber = this.janaadharMemberDetails.mobile;
      this.model.Email = this.janaadharMemberDetails.email;
      this.model.JanAadharMemberID = this.janaadharMemberDetails.janmemid;
      this.model.JanAadharNo = this.janaadharMemberDetails.janaadhaarId;

      var result = this.CategoryAlist.find((f: any) => f.CasteCategoryName == this.janaadharMemberDetails.category)
      if (result != null || result != undefined) {
        this.model.CategoryA = result.CasteCategoryID;
      }
      const dateStr = this.janaadharMemberDetails.dob;   
      const [day = '', month = '', year = ''] = dateStr?.split('/') ?? [];
      const formattedDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0]; 
      this.model.DOB = formattedDate;
    }
    catch (ex) {
      console.log(ex);

    }
  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      debugger;
      this.file = event.target.files[0];
      if (this.file) {
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "EducationType") {
                //this.request.Dis_DocName = data['Data'][0]["Dis_FileName"];
                this.educationRequest.EducationDocument = data['Data'][0]["FileName"];
              }
              else if (Type == "TechType") {
                //this.request.Dis_DocName = data['Data'][0]["Dis_FileName"];
                this.techRequest.TechDocument = data['Data'][0]["FileName"];
              }
              else if (Type == "EmpType") {
                //this.request.Dis_DocName = data['Data'][0]["Dis_FileName"];
                this.employeeRequest.EmploymentDocument = data['Data'][0]["FileName"];
              }

              //item.FilePath = data['Data'][0]["FilePath"];
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
    this.isSSOVisible = false;
    this.EducationForm.reset();
    this.TechnicalForm.reset();
    this.InstructorForm.reset();
    this.EmploymentForm.reset();
    this.InstructorForm.controls['Uid'].enable();
  }



}



