import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { GlobalConstants, EnumCourseType, EnumVerificationAction, EnumDepartment ,EnumLateralCourse, EnumStatus, EnumCasteCategory, EnumRole } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { BterSearchmodel, SupplementaryDataModel, Lateralsubject, LateralEntryQualificationModel, BterOtherDetailsModel, HighestQualificationModel } from '../../../../Models/ApplicationFormDataModel';
import { TSPTehsilDataModel } from '../../../../Models/CommonMasterDataModel';
import { DocumentCategoryDataModel, DocumentScrutinyDataModel, RejectModel } from '../../../../Models/DocumentScrutinyDataModel';
import { DocumentDetailsDataModel } from '../../../../Models/ITIFormDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { VerificationDocumentDetailList } from '../../../../Models/StudentVerificationDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators, DropdownValidators1, DropdownValidatorsString1 } from '../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { StudentVerificationListService } from '../../../../Services/StudentVerificationList/student-verification-list.service';
import { TspAreasService } from '../../../../Services/Tsp-Areas/Tsp-Areas.service';
import { StudentStatusHistoryComponent } from '../../../Student/student-status-history/student-status-history.component';
import { ItiApplicationFormService } from '../../../../Services/ItiApplicationForm/iti-application-form.service';
import { CorrectMeritService } from '../../../../Services/BTER/CorrectMerit/correct-merit.service';
import { MeritDocumentCategoryDataModel, MeritDocumentScrutinyDataModel } from '../../../../Models/BTER/CorrectMeritDataModel';
import { query } from '@angular/animations';
import { BterApplicationForm } from '../../../../Services/BterApplicationForm/bterApplication.service';

@Component({
  selector: 'app-edit-merit-document',
  standalone: false,
  templateUrl: './edit-merit-document.component.html',
  styleUrl: './edit-merit-document.component.css'
})

export class EditMeritDocumentComponent {

  public SSOLoginDataModel = new SSOLoginDataModel()
  public DocumentDetailsFormGroup!: FormGroup;
  public formData = new DocumentDetailsDataModel()
  public _GlobalConstants: any = GlobalConstants;
  public request = new MeritDocumentScrutinyDataModel()
  UploadDocCategory = new MeritDocumentCategoryDataModel();
  public searchRequest = new BterSearchmodel()
  public OtherData = new BterOtherDetailsModel()
  public formData1 = new HighestQualificationModel()
  public isSubmitted: boolean = false
  public QualificationDataList: any = []
  public box10thChecked: boolean = false
  public box8thChecked: boolean = false
  public isSupp: boolean = false
  public IsShowDropdown: boolean = false
  public ApplicationID: number = 0;
  public PersonalDetailForm!: FormGroup
  public QualificationForm!: FormGroup
  public SupplementaryForm!: FormGroup
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
  public ErrorMessage: string = '';
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
  public filteredDocumentDetails: VerificationDocumentDetailList[] = []
  public TspDistrictList: any = []
  public filteredTehsilList: any = []
  public TspTehsilRequest = new TSPTehsilDataModel()
  public TspTehsilList: any = []
  public DevnarayanAreaList: any = []
  public DevnarayanTehsilList: any = []
  @ViewChild(StudentStatusHistoryComponent) childComponent!: StudentStatusHistoryComponent;
  public hideHighestQualification: boolean = false
  public EnglishQualificationForm!: FormGroup
  public PrefentialCategoryList: any = []
  public IdentityProofList: any = []
  public ResidenceList: any = []
  public SchemelIst: any = []
  public ParentIncome: any = []
  public ShowOtherBoard10th: boolean = false;
  public ShowOtherBoard12th: boolean = false;
  public BoardList10: any = [];
  public BoardList12: any = [];
  public BoardStateList10: any = [];
  public BoardStateList12: any = [];
  public BoardExamList10: any = [];
  public BoardExamList12: any = [];
  public QualificationPassingYearList: any = []
  public SupplyPassingYearList: any = []
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private correctMeritService: CorrectMeritService,
    public appsettingConfig: AppsettingService,
    private ItiApplicationFormService: ItiApplicationFormService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ApplicationService: StudentVerificationListService,
    private modalService: NgbModal,
    private swat: SweetAlert2,
    private tspAreaService: TspAreasService,
    private ApplicationService1: BterApplicationForm,
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

    this.PersonalDetailForm = this.formBuilder.group({
        ddlPreferentialCategory: [{ value: '' }, [DropdownValidators]],
        ddlPreferentialType: [{ value: '', disabled: true } , [DropdownValidators]],
        txtJanAadhaar: [''],
        txtName: ['', Validators.required],
        txtSSOID: [''],
        txtnameHindi: [{ value: '' }, Validators.required],
        txtEmail: [''],
        txtFather: [{ value: '', disabled: true }, Validators.required],
        txtFatherHindi: [{ value: '' }, Validators.required],
        txtDOB: ['', Validators.required],
        txtMotherEngname: [{ value: '' }, Validators.required],
        Gender: [''],
        MobileNumber: ['', Validators.required],
        txtMotherHindiname: [{ value: '' }, Validators.required],
        ddlIdentityProof: ['', Validators.required],
        txtDetailsofIDProof: ['', [Validators.required, this.validateIDLength.bind(this)]],
        CertificateNo: ['', Validators.required],
        txtGeneratDate: ['', Validators.required],
        DepartmentName: ['', Validators.required],
        TradeLevel: [''],
        TradeID: [''],
        DirectAdmissionTypeID: [''],
        BranchID: [''],
        Apaarid: [''],
        ddlMaritial: ['', [DropdownValidators]],
        ddlReligion: ['', [DropdownValidators]],
        ddlNationality: ['', [DropdownValidators]],
        ddlCategoryA: [ ''],
        ddlCategoryB: [''],
        ddlCategorycp: [{ value: '', disabled: true }],
        ddlCategoryck: [{ value: '', disabled: true }],
        ddlCategoryE: [''],
        ddlPrefential: [{ value: '', disabled: false }, [DropdownValidators]],
        IsTSP: [''],
        IsSaharia: [''],
        TspDistrictID: [''],
        IsMinority: [''],
        subCategory: [''],
        IsDevnarayan: [''],
        DevnarayanDistrictID: [''],
        DevnarayanTehsilID: [''],
        TSPTehsilID: [''],
        ddlCategoryD: [{ value: '', disabled: false }],
        ddlIsMBCCertificate: [0,]
      });
    this.QualificationForm = this.formBuilder.group({
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
        txtRollNo: ['', Validators.required],
        ddlPassingYear: ['', [DropdownValidators]],
      });

    this.RadioForm = this.formBuilder.group({
        SubjectRadio: ['']
      })

    this.LateralQualificationForm = this.formBuilder.group({
        ddlCourseID: ['', [DropdownValidators]],
        txtRollNumber: ['', Validators.required],
        txtAggregateMaximumMarks: ['', Validators.required],
        txtAggregateMarksObtained: ['', Validators.required],
        txtpercentage: [{ value: '', disabled: true }],
        ddlStateID: ['', [DropdownValidators]],
        ddlBoardID: ['', [DropdownValidators]],
        ddlPassyear: ['', [DropdownValidators]],
        ddlMarksType: ['', [DropdownValidators]],
        SubjectID: ['', Validators.required]
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

    this.IdentityProofList = [{ Id: '1', Name: 'Aadhar Number' }, { Id: '2', Name: 'Aadhar Enrolment ID' }, { Id: '3', Name: 'Jan Aadhar Id' }]
    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.DocumentDetailsFormGroup = this.formBuilder.group({

    });
    this.searchRequest.DepartmentID = EnumDepartment.BTER;
    this.ApplicationID = Number(this.activatedRoute.snapshot.queryParamMap.get('ApplicationID') ?? 0);
    
    await this.GetMasterDDL()
    await this.GetPrefentialCategory(0);
    await this.GetStateMatserDDL()
    await this.GetPassingYearDDL()
    await this.calculatePercentage()
    await this.GetMarktYPEDDL()
    await this.calculateLateralPercentage()

    await this.GetLateralCourse()
    await this.GetOtherMasterDDL();

    if (this.ApplicationID > 0) {
      this.searchRequest.ApplicationID = this.ApplicationID;
      await this.GetDocumentbyID()
      await this.GetOtherById();
    } else {
      window.location.href = "/StudentVerificationList";

    }
  }

  get _PersonalDetailForm() { return this.PersonalDetailForm.controls; }
  get _QualificationForm() { return this.QualificationForm.controls; }
  get _SupplementaryForm() { return this.SupplementaryForm.controls; }
  get _LateralQualificationForm() { return this.LateralQualificationForm.controls; }
  get _EnglishQualificationForm() { return this.EnglishQualificationForm.controls; }


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

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (this.request.MarkType == 84) {
      if (!/^[0-9.]$/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    } else {
      if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    }
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


  async ViewHistory(row: any, ID: number) {
    //this.searchRequest.action = "_GetstudentWorkflowdetails";
    //this.GetAllDataActionWise();

    this.childComponent.OpenRevertDocumentPopup(ID, this.searchRequest.ApplicationID);
  }

  onItemSelect(item: any, centerID: number) {

    if (!this.SubjectID.includes(item)) {
      this.SubjectID.push(item);
    }

  }

  onDeSelect(item: any, centerID: number) {

    /*  this.SubjectID = this.SubjectID.filter((i: any) => i.InstituteID !== item.InstituteID);*/

  }

  onSelectAll(items: any[], centerID: number) {

    /*    this.SelectedSubjectList = [...items];*/

  }

  onDeSelectAll(centerID: number) {

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
          console.log(data);
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

  async GetTspTehsilList() {
    this.TspTehsilRequest.DistrictID = this.request.TspDistrictID
    try {
      this.loaderService.requestStarted();

      await this.tspAreaService.TSPArea_GetTehsil_DistrictWise(this.TspTehsilRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TspTehsilList = data['Data'];
          console.log("TspTehsilList", this.TspTehsilList)
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

  async passingYear() {

    const selectedYear = this.request.PassingID;
    if (selectedYear) {
      this.QualificationPassingYearList = this.PassingYearList.filter((item: any) => item.Year > selectedYear);
      this.SupplypassingYear();
    } else {
      this.PassingYearList;
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


  async GetStreamCourse() {
    try {

      this.loaderService.requestStarted();
      if (this.lateralrequest.CourseID == EnumLateralCourse.Diploma_Engineering) {
        this.action = "Lateral_Diploma"
        this.lateralrequest.Qualification = "Diploma_Engineering"
      } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary_Vocational) {
        this.action = "Senior_Seconary_Vocational"
        this.lateralrequest.Qualification = "Senior_Secondary_Vocational"
      } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
        this.action = "Senior_Seconary"
        this.lateralrequest.Qualification = "Senior_Secondary"
      }
      else if (this.lateralrequest.CourseID == EnumLateralCourse.ITI_Tenth) {
        this.action = "Lateral_Trade"
        this.lateralrequest.Qualification = "ITI_Tenth"
      }
      this.SubjectID = []

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

        // Upload to server folder
        this.loaderService.requestStarted();
        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log("File upload data", data);
            if (data.State === EnumStatus.Success) {
              switch (Type) {
                case "CategoryA":
                  this.UploadDocCategory.Dis_CategoryAName = data['Data'][0]["Dis_FileName"];
                  this.UploadDocCategory.CategoryAProfilePhoto = data['Data'][0]["FileName"];
                  break;
                case "CategoryB":
                  this.UploadDocCategory.Dis_CategoryBName = data['Data'][0]["Dis_FileName"];
                  this.UploadDocCategory.CategoryBProfilePhoto = data['Data'][0]["FileName"];
                  break;
                case "CategoryC":
                  this.UploadDocCategory.Dis_CategoryCName = data['Data'][0]["Dis_FileName"];
                  this.UploadDocCategory.CategoryCProfilePhoto = data['Data'][0]["FileName"];
                  break;
                case "Prefential":
                  this.UploadDocCategory.Dis_PrefentialName = data['Data'][0]["Dis_FileName"];
                  this.UploadDocCategory.PrefentialProfilePhoto = data['Data'][0]["FileName"];
                  break;
                case "MotherCertificate":
                  this.UploadDocCategory.Dis_MotherCertificateName = data['Data'][0]["Dis_FileName"];
                  this.UploadDocCategory.MotherCertificateProfilePhoto = data['Data'][0]["FileName"];
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
  changeKM() {
    if (this.request.IsKM == "1") {
      this.request.PrefentialCategoryType = 2;
      this.request.CategoryA = 1;
      // this.PersonalDetailForm.get('ddlCategoryA')?.disable();
    } else {
      this.Showdropdown();
    }
  }

  async Showdropdown() {
    
    var th = this;
    var data = this.PrefentialCategoryList.filter(function (dta: any) { return dta.ID == th.request.ENR_ID });
    if (data != undefined && data.length > 0) {
      this.request.PrefentialCategoryType = data.length > 0 ? data[0].TypeID : 0;
      this.PersonalDetailForm.get('ddlPreferentialType')?.disable();
    }

    if (this.request.ENR_ID != 5 && this.request.PrefentialCategoryType == 2) {
      this.request.CategoryA = 1;
      // this.PersonalDetailForm.get('ddlCategoryA')?.disable();
      this.PersonalDetailForm.get('ddlCategoryck')?.enable();
      //this.IdentityProofList = [{ Id: '1', Name: 'Aadhar Number' }, { Id: '2', Name: 'Aadhar Enrolment ID' }]
      this.IdentityProofList.splice(2, 1)
    } else {
      // this.PersonalDetailForm.get('ddlCategoryA')?.enable();
      this.PersonalDetailForm.get('ddlCategoryck')?.disable();
      this.request.IsKM = "0";
      if (this.IdentityProofList.filter(function (dt: any) { return dt.Id == 3 }).length == 0) {
        this.IdentityProofList.push({ Id: '3', Name: 'Jan Aadhar Id' });
      }

      if (this.SSOLoginDataModel.RoleID == EnumRole.DTE
        || this.SSOLoginDataModel.RoleID == EnumRole.DTENON
        || this.SSOLoginDataModel.RoleID == EnumRole.DTELateral
        || this.SSOLoginDataModel.RoleID == 80 || this.SSOLoginDataModel.RoleID == 81) {
        // this.PersonalDetailForm.get('ddlCategoryA')?.enable();

      }
      else {
        // this.PersonalDetailForm.get('ddlCategoryA')?.disable();
      }

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
      this.PersonalDetailForm.get('ddlCategoryB')?.clearValidators();
      this.PersonalDetailForm.get('ddlCategorycp')?.clearValidators();
      this.PersonalDetailForm.get('ddlCategoryD')?.clearValidators();
      this.PersonalDetailForm.get('ddlCategoryE')?.clearValidators();
      this.PersonalDetailForm.get('TSPTehsilID')?.clearValidators();
      this.PersonalDetailForm.get('TspDistrictID')?.clearValidators();

      this.PersonalDetailForm.get('ddlCategoryB')?.updateValueAndValidity();
      this.PersonalDetailForm.get('ddlCategorycp')?.updateValueAndValidity();
      this.PersonalDetailForm.get('ddlCategoryD')?.updateValueAndValidity();
      this.PersonalDetailForm.get('ddlCategoryE')?.updateValueAndValidity();
      this.PersonalDetailForm.get('TSPTehsilID')?.updateValueAndValidity();
      this.PersonalDetailForm.get('TspDistrictID')?.updateValueAndValidity();
    } else {
      this.PersonalDetailForm.get('ddlCategoryB')?.setValidators(DropdownValidators1);
      this.PersonalDetailForm.get('ddlCategorycp')?.setValidators(DropdownValidatorsString1);
      if (this.request.Gender != 97 && this.request.Maritial != 62) {
        this.PersonalDetailForm.get('ddlCategoryD')?.setValidators(DropdownValidators1);
        this.PersonalDetailForm.get('ddlCategoryD')?.updateValueAndValidity();
      } else {
        this.request.CategoryD = 0;
      }
      this.PersonalDetailForm.get('ddlCategoryE')?.setValidators(DropdownValidators1);

      this.PersonalDetailForm.get('ddlCategoryB')?.updateValueAndValidity();
      this.PersonalDetailForm.get('ddlCategorycp')?.updateValueAndValidity();

      this.PersonalDetailForm.get('ddlCategoryE')?.updateValueAndValidity();

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
            debugger
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

  ShowOtherdropdown() {
    if (this.OtherData.ParentsIncome == 71) {   
      this.IsShowDropdown = true
    } else {
      this.IsShowDropdown = false
      this.OtherData.EWS = 0
      this.OtherData.ApplyScheme = 0
      this.OtherData.IncomeSource = ''
    }
  }

  async GetDocumentbyID() {
    this.isSubmitted = false;

    this.searchRequest.SSOID = this.SSOLoginDataModel.SSOID;
    this.searchRequest.DepartmentID = EnumDepartment.BTER;
    try {
      this.loaderService.requestStarted();
      await this.correctMeritService.MeritDocumentScrunityData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'data ');
          debugger
          if (data['Data'] != null) {
            this.request = data['Data']

            // ------------------ Personal details data binding starts ----------------------- //
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

            this.GetTspTehsilList()
            this.commonMasterService.GetCommonMasterData('DevnarayanAreaTehsil')
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.DevnarayanTehsilList = data['Data'];
                this.selectDDID(this.request.DevnarayanDistrictID);
                this.filteredTehsilList.ID = this.request.DevnarayanDistrictID;
                this.request.DevnarayanTehsilID = data.Data.DevnarayanTehsilID;
              }, (error: any) => {
              });
            this.request.DevnarayanTehsilID;

            this.request.ENR_ID = data['Data']['Prefential']

            this.changeMaritalStatus();
            this.request.CategoryD = data['Data']['CategoryD']
            this.changeKM();

            // ------------------ Personal details data binding End ----------------------- //

            /* alert(this.request.IsSupplement)*/
            this.request.IsSupplement = data['Data']['IsSupplement']
            if (data['Data']['IsSupplement'] === true) {
              this.isSupplement = true
            } else {
              this.isSupplement = false
            }

            if (this.request.PassingID == null) {
              this.request.PassingID = ''
            } else {
              this.request.PassingID = data['Data']['PassingID']
            }
            this.BoardChange(this.request.QualificationID)
            this.BoardStateChange(this.request.QualificationID)
            
            this.request.VerificationDocumentDetailList = data['Data']['VerificationDocumentDetailList']
          
            this.request.VerificationDocumentDetailList = this.request.VerificationDocumentDetailList.map(doc => ({
              ...doc,
              DisFileName: doc.DisFileName.replace(/^upload the scanned copy of /i, '') // Remove "upload the "
            }));       
          }
          if (this.request.LateralEntryQualificationModel == null) {
            this.request.LateralEntryQualificationModel = []
            this.lateralrequest = new LateralEntryQualificationModel()
          } else {
            this.request.LateralEntryQualificationModel = data['Data']['LateralEntryQualificationModel']
            this.lateralrequest = data['Data']['LateralEntryQualificationModel'][0]
            this.GetStreamCourse();
            this.SubjectID = data['Data']['LateralEntryQualificationModel'][0]['SubjectID'];
          }
            if (this.request.VerificationDocumentDetailList) {   
              this.filteredDocumentDetails = this.request.VerificationDocumentDetailList.filter((x) => x.GroupNo === 1);
              this.request.VerificationDocumentDetailList = this.request.VerificationDocumentDetailList.filter((x) => x.GroupNo != 1);
            } else {
              this.filteredDocumentDetails = [];
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

  onIdentityProofChange() {
    this.PersonalDetailForm.get('txtDetailsofIDProof')?.updateValueAndValidity();
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
  async GetMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('MaritalStatus')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.maritialList = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterDDLByType('CategoryD')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryDlist = data['Data'];

        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.CategoryBDDLData(EnumDepartment.BTER)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryBlist = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryAlist = data['Data'];

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
      await this.commonMasterService.GetCommonMasterData('PrefentialCategory')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.category_PreList = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterData('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterData('Board')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BoardList = data['Data'];
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
    catch (ex) {
      console.log(ex);
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
    this.isSupp = true

    if (this.SupplementaryForm.invalid) {
      return console.log("error");
    }

    //Show Loading
    try {
      this.request.SupplementaryDataModel.push(
        {
          PassingID: this.addrequest.PassingID,
          RollN0: this.addrequest.RollN0,
          Subject: this.addrequest.Subject,
          EducationCategory: this.addrequest.EducationCategory,
          MaxMarksSupply: this.addrequest.MaxMarksSupply,
          ObtMarksSupply: this.addrequest.ObtMarksSupply,
          SupplementryID: 0
        }
      );

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
    this.addrequest.RollN0 = '';

    setTimeout(() => {
      this.loaderService.requestEnded();
    }, 200);
  }




  calculatePercentage(): void {
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
        if (percentage <= 33) {
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
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
        const percentage = (marksObtained / maxMarks) * 100;
        if (percentage <= 33) {
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

  calculateLateralPercentage(): void {
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
        const percentage = marksObtained * 9.5;
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
      this.QualificationForm.get('txtAggregateMaximumMarks')?.enable();
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
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



  async SaveData() {
    
    this.isSubmitted = true;
    if (this.request.IsSupplement == true) {
      if (this.request.SupplementaryDataModel.length < 1) {
        this.toastr.error("please Add Supplementry details")
        return
      }
    }

    if (this.PersonalDetailForm.invalid) {
      return
    }
    if (this.QualificationForm.invalid) {
      return
    }

    this.request.LateralEntryQualificationModel = []
    if (this.request.CourseType == EnumCourseType.Lateral) {
      if (this.LateralQualificationForm.invalid) {
        return
      }
      if (this.lateralrequest.CourseID == EnumLateralCourse.Diploma_Engineering) {
        if (this.SubjectID.length != 1) {
          this.toastr.error("Please Select Only One Stream")
          this.isSubmitted = false
          return
        }

      } else if (this.lateralrequest.CourseID == EnumLateralCourse.ITI_Tenth) {
        if (this.SubjectID.length != 1) {
          this.toastr.error("Please Select Only One trade")
          this.isSubmitted = false
          return
        }

      } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
        if (this.SubjectID.length != 3) {
          this.toastr.error("Please Select 3 Subjects")
          this.isSubmitted = false
          return
        }



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

      })
    }

    if (this.request.CategoryA == 3) {
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
        this.toastr.error('Please Select उप वर्ग (Subcategory)');
        return
      }
    }


    if (this.request.IsTSP == true) {
      if (this.request.TspDistrictID == 0 || this.request.TspDistrictID == null || this.request.TspDistrictID == undefined) {
        this.toastr.error('Please Select अनुसूचित जिला (Tribal District)');
        return
      }
    } else {
      this.request.TspDistrictID = 0
    }




    this.request.DocumentPushModel = []
    if (this.request.CategoryA == EnumCasteCategory.ST && this.UploadDocCategory.CategoryAProfilePhoto!='') {
      this.AddCategoryDocument(36,1)
    }
    else if (this.request.CategoryA == EnumCasteCategory.EWS && this.UploadDocCategory.CategoryAProfilePhoto != '') {
      this.AddCategoryDocument(35, 1)
    }
    else if (this.request.CategoryA == EnumCasteCategory.SC && this.UploadDocCategory.CategoryAProfilePhoto != '') {
      this.AddCategoryDocument(37, 1)
    }
    else if (this.request.CategoryA == EnumCasteCategory.OBC && this.UploadDocCategory.CategoryAProfilePhoto != '') {
      this.AddCategoryDocument(38, 1)
    }
    else if (this.request.CategoryA == EnumCasteCategory.MBC && this.UploadDocCategory.CategoryAProfilePhoto != '') {
      this.AddCategoryDocument(39, 1)
    }

    if (this.request.CategoryB == 1 && this.UploadDocCategory.CategoryBProfilePhoto != '') {
      this.AddCategoryDocument(40, 2)
    }
    else if (this.request.CategoryB == 2  && this.UploadDocCategory.CategoryBProfilePhoto != '') {
      this.AddCategoryDocument(41, 2)
    }
    else if (this.request.CategoryB == 3 && this.UploadDocCategory.CategoryBProfilePhoto != '') {
      this.AddCategoryDocument(42, 2)
    }
    else if (this.request.CategoryB == 4 && this.UploadDocCategory.CategoryBProfilePhoto != '') {
      this.AddCategoryDocument(43, 2)
    }
    else if (this.request.CategoryB == 5 && this.UploadDocCategory.CategoryBProfilePhoto != '') {
      this.AddCategoryDocument(44, 2)
    }
    else if (this.request.CategoryB == 6 && this.UploadDocCategory.CategoryBProfilePhoto != '') {
      this.AddCategoryDocument(45, 2)
    }
    else if (this.request.CategoryB == 7 && this.UploadDocCategory.CategoryBProfilePhoto != '') {
      this.AddCategoryDocument(46, 2)
    }
    else if (this.request.CategoryB == 8 && this.UploadDocCategory.CategoryBProfilePhoto != '') {
      this.AddCategoryDocument(47, 2)
    }
    else if (this.request.CategoryB == 9 && this.UploadDocCategory.CategoryBProfilePhoto != '') {
      this.AddCategoryDocument(48, 2)
    }

    if (this.request.CategoryC == 68 && this.UploadDocCategory.CategoryCProfilePhoto != '') {
      this.AddCategoryDocument(49, 3)
    }
    else if (this.request.CategoryC == 69 && this.UploadDocCategory.CategoryCProfilePhoto != '') {
      this.AddCategoryDocument(50, 3)
    }

    if (this.request.Prefential == 2 && this.UploadDocCategory.PrefentialProfilePhoto != '') {
      this.AddCategoryDocument(53, 4)
    }
    else if (this.request.Prefential == 5 && this.UploadDocCategory.PrefentialProfilePhoto != '') {
      this.AddCategoryDocument(54, 4)
    }
    else if (this.request.Prefential == 7 && this.UploadDocCategory.PrefentialProfilePhoto != '') {
      this.AddCategoryDocument(55, 4)
    }


    this.request.ModifyBy = this.SSOLoginDataModel.UserID;
    this.request.DepartmentID = EnumDepartment.BTER
    this.request.IsSupplement = this.isSupplement
    this.request.status = EnumVerificationAction.Verified
    this.request.MeritID = this.ApplicationID
    this.swat.Confirmation('Are you Sure you want to make changes', async (result: any) => {
      if (result.isConfirmed) {

        this.loaderService.requestStarted();
        try {
          
          await this.correctMeritService.Save_MeritDocumentscrutiny(this.request)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data);
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                if (this.request.DepartmentID == EnumCourseType.Engineering) {
                  this.router.navigate(['/CorrectMeritENG', 1]);
                }
                else {
                  this.router.navigate(['/CorrectMeritNonENG', 2]);
                }
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

    if (this.reject.Remark == '') {
      this.toastr.error("Please Enter Remarks")
      return
    }
    this.reject.ModifyBy = this.SSOLoginDataModel.UserID;
    this.reject.DepartmentID = EnumDepartment.BTER
    this.reject.ApplicationID = this.request.ApplicationID
    this.reject.Action = EnumVerificationAction.RejectMerit
    this.CloseModel()
    this.swat.Confirmation("Are you sure you want to Reject?", async (result: any) => {

      if (result.isConfirmed) {

        this.loaderService.requestStarted();
        try {
          await this.correctMeritService.Reject_Document(this.reject)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data);
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                this.CloseModel()
            /*    this.router.navigate(['/StudentVerificationList'])*/
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

  onroute() {
    if (this.request.DepartmentID == EnumCourseType.Engineering) {
      this.router.navigate(['/CorrectMeritENG', 1]);
    }
    else {
      this.router.navigate(['/CorrectMeritNonENG', 2]);
    }
  }
 


  AddCategoryDocument(DocumentMasterID: number, CategoryType: number)
  {
    var vDisFileName = ''
    var vFileName = ''
    var vCategory=''
    if (CategoryType == 1)//cateforyname
    {
      vDisFileName = this.UploadDocCategory.Dis_CategoryAName;
      vFileName = this.UploadDocCategory.CategoryAProfilePhoto
      vCategory='CategoryA'
    }
    else if (CategoryType == 2)
    {
      vDisFileName = this.UploadDocCategory.Dis_CategoryBName;
      vFileName = this.UploadDocCategory.CategoryBProfilePhoto
      vCategory = 'CategoryB'
    }
    else if (CategoryType == 3)
    {
      vDisFileName = this.UploadDocCategory.Dis_CategoryCName;
      vFileName = this.UploadDocCategory.CategoryCProfilePhoto
      vCategory = 'CategoryC'
    }
    else if (CategoryType == 4)
    {
      vDisFileName = this.UploadDocCategory.Dis_PrefentialName;
      vFileName = this.UploadDocCategory.PrefentialProfilePhoto
      vCategory = 'Prefential'
    }
    else if (CategoryType == 5)
    {
      vDisFileName = this.UploadDocCategory.Dis_MotherCertificateName;
      vFileName = this.UploadDocCategory.MotherCertificateProfilePhoto
      vCategory = 'Mother'
    }



    this.request.DocumentPushModel.push({
      DisFileName: vDisFileName,
      FileName: vFileName,
      DocumentDetailsID: 0,
      DocumentMasterID: DocumentMasterID,
      ModifyBy: this.SSOLoginDataModel.UserID,
      Status: EnumVerificationAction.Verified,
      Remark: '',
      TransactionID: this.request.ApplicationID,
      Category: vCategory
    });
  }



}
