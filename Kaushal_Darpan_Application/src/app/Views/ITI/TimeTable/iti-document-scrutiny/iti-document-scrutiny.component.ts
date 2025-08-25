import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ItiTradeSearchModel, TSPTehsilDataModel } from '../../../../Models/CommonMasterDataModel';
import { JanAadharMemberDetails } from '../../../../Models/StudentJanAadharDetailModel';
import { ItiApplicationSearchmodel } from '../../../../Models/ItiApplicationPreviewDataModel';
import { HighestQualificationDetailsDataModel, PersonalDetailsDatamodel, Qualification10thDetailsDataModel, Qualification12thDetailsDataModel, Qualification8thDetailsDataModel, QualificationDetailsDataModel } from '../../../../Models/ITIFormDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItiDocumentscrutinymodel } from '../../../../Models/ITI/ItiDocumentScrutinyDataModel';
import { EnumDepartment, EnumStatus, EnumVerificationAction, GlobalConstants } from '../../../../Common/GlobalConstants';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ItiApplicationFormService } from '../../../../Services/ItiApplicationForm/iti-application-form.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TspAreasService } from '../../../../Services/Tsp-Areas/Tsp-Areas.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { VerificationDocumentDetailList } from '../../../../Models/StudentVerificationDataModel';
import { ItiDocumentscrutinyService } from '../../../../Services/ItidocumentScrutiny/Iti-document-scrutiny.service';
import { BterSearchmodel } from '../../../../Models/ApplicationFormDataModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2'
import { StudentVerificationListService } from '../../../../Services/StudentVerificationList/student-verification-list.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RejectModel } from '../../../../Models/DocumentScrutinyDataModel';
@Component({
  selector: 'app-iti-document-scrutiny',
  standalone: false,
  
  templateUrl: './iti-document-scrutiny.component.html',
  styleUrl: './iti-document-scrutiny.component.css'
})
export class ItiDocumentScrutinyComponent {
  public testid: string = ''
  public sSOLoginDataModel = new SSOLoginDataModel()
  public PersonalDetailForm!: FormGroup
  public request = new ItiDocumentscrutinymodel()
  public isSubmitted: boolean = false
  public maritialList: any = []
  public CategoryBlist: any = []
  public CategoryAlist: any = []
  public ReligionList: any = []
  public NationalityList: any = []
  public category_CList: any = []
  public category_PreList: any = []
  public ParentIncomeList: any = []
  public PWDCategoryList: any = []
  public BranchName: any = []
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public ItiTradeList: any = []
  public QualificationDataList: any = []
  public box8thChecked: boolean = false
  public box10thChecked: boolean = false
  public box12thChecked: boolean = false
  public searchRequest = new BterSearchmodel()
  public janaadharMemberDetails = new JanAadharMemberDetails()
  public ItiTradeListAll: any = []
  public tradeSearchRequest = new ItiTradeSearchModel()
  public GenderList: any = []
  public DevnarayanAreaList: any = []
  public DevnarayanTehsilList: any = []
  public ApplicationID: number = 0;
  public PrefentialCategoryList: any = []
  public TspDistrictList: any = []
  public filteredTehsilList: any = []
  public TspTehsilRequest = new TSPTehsilDataModel()
  public TspTehsilList: any = []
  public Isremarkshow: boolean = false
  public filteredDocumentDetails: VerificationDocumentDetailList[] = []
  public ItiPHTradeList: any = []
  public settingsMultiselect: object = {};
  public TradeList8th: any[] = [];
  public TradeList10th: any[] = [];
  PH10thTradeList: any[] = [];
  PH8thTradeList: any[] = [];
  PH12thTradeList: any[] = [];
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public SSOLoginDataModel = new SSOLoginDataModel()
  public StateMasterList: any = []
  public HighQualificationForm!: FormGroup;
  public QualificationForm8th!: FormGroup;
  public QualificationForm10th!: FormGroup;
  public QualificationForm12th!: FormGroup;
  public formData = new HighestQualificationDetailsDataModel()

  public box8Checked: boolean = false;  
  public box10Checked: boolean = false;
  public box12Checked: boolean = false;
  public formData8th = new Qualification8thDetailsDataModel()
  public formData12th = new Qualification12thDetailsDataModel()
  public formData10th = new Qualification10thDetailsDataModel()
  public changeshow: boolean=false
  // public request = new QualificationDetailsDataModel()
/*  public request: QualificationDetailsDataModel[] = []*/
  public disable10thCheckbox: boolean = false
  public disable8thCheckbox: boolean = false
  public disable12thCheckbox: boolean = false
  public BoardList: any = []
  public PassingYearList: any = []

  public MarksTypeList: any = []
  public DocumentStatusList: any = []
  public reject = new RejectModel()

  showModal: boolean = false;
  @ViewChild('modal_Acknowledgement') modal_Acknowledgement: any;
  closeResult: string | undefined;
  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private ItiApplicationFormService: ItiDocumentscrutinyService,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private tspAreaService: TspAreasService,
    public appsettingConfig: AppsettingService,
    private swat: SweetAlert2,
    private Rejectservice: StudentVerificationListService,
    private modalService: NgbModal,
    private router: Router,
  ) { }


  async ngOnInit() {

    this.settingsMultiselect = {
      singleSelection: false,
      idField: 'Id',
      textField: 'TradeName',
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

    this.PersonalDetailForm = this.formBuilder.group(
      {
        txtName: [{ value: '', disabled: true }, Validators.required],
        txtnameHindi: [{ value: '' }, Validators.required],
        txtEmail: [{ value: '', disabled: true }, Validators.pattern(GlobalConstants.EmailPattern)],
        txtFather: [{ value: '', disabled: true }, Validators.required],
        txtFatherHindi: [{ value: '' }, Validators.required],
        txtDOB: [{ value: '', disabled: true }, Validators.required],
        txtMotherEngname: [{ value: '', disabled: true }, Validators.required],
        Gender: [{ value: '', disabled: true }],
        MobileNumber: [{ value: '', disabled: true }, Validators.required],
        txtWhatsappMobileNumber: [''],
        txtMotherHindiname: [{ value: '' }, Validators.required],
        txtLandlineNumber: [''],
        txtDetailsofIDProof: ['', Validators.required],
        ddlIdentityProof: ['', [DropdownValidators]],
        ddlMaritial: ['', [DropdownValidators]],
        ddlReligion: ['', [DropdownValidators]],
        ddlNationality: ['', [DropdownValidators]],
        ddlCategoryA: [{ value: '', disabled: true }],
        ddlCategoryB: [{ value: '', disabled: true }],
        ddlCategoryc: [{ value: '', disabled: true }],
        ddlCategoryE: [{ value: '', disabled: true }],

        ddlIncomeDetail: ['',],
        ddlMinority: [{ value: '', disabled: true }],
        ddlEWSCategory: [{ value: '', disabled: true }],
        ddlEligible8thTradesID: [''],
        ddlEligible10thTradesID: [''],
        ddlPWDCategoryID: [{ value: '', disabled: true }],
        txtDomicile: [{ value: '', disabled: true }],
        IsTSP: [''],
        IsSaharia: [''],
        TspDistrictID: [''],
        subCategory: [{ value: '', disabled: true }],
        IsDevnarayan: [''],
        DevnarayanDistrictID: [''],
        DevnarayanTehsilID: [''],
        TSPTehsilID: [''],
        PH8thTradeList: [[],],
        PH10thTradeList: [[],],
      });

    this.HighQualificationForm = this.formBuilder.group(
      {
        ddlState: ['', [DropdownValidators]],
        txtBoardUniversity: ['', Validators.required],
        txtSchoolCollege: ['', Validators.required],
        txtHighestQualification: ['', Validators.required],
        txtYearOfPassing: ['', Validators.required],
        txtRollNumber: ['', Validators.required],
        ddlMarksType: ['', [DropdownValidators]],
        txtMaxMarks: ['', Validators.required],
        txtMarksObatined: ['', Validators.required],
        txtPercentage: [{ value: '', disabled: true }],
      });

    this.QualificationForm8th = this.formBuilder.group({
      ddlState8: ['', [DropdownValidators]],
      txtSchoolCollege8: ['', Validators.required],
      txtYearOfPassing8: ['', Validators.required],
      txtRollNumber8: ['', Validators.required],
      ddlMarksType8: ['', [DropdownValidators]],
      txtMaxMarks8: ['', Validators.required],
      txtMarksObatined8: ['', Validators.required],
      txtPercentage8: [{ value: '', disabled: true }],
    })

    this.QualificationForm10th = this.formBuilder.group({
      ddlState10: ['', [DropdownValidators]],
      txtBoardUniversity10: ['', Validators.required],
      txtYearOfPassing10: ['', Validators.required],
      txtRollNumber10: ['', Validators.required],
      ddlMarksType10: ['', [DropdownValidators]],
      txtMaxMarks10: ['', Validators.required],
      txtMarksObatined10: ['', Validators.required],
      txtMathsMaxMarks10: ['', Validators.required],
      txtMathsMarksObtained10: ['', Validators.required],
      txtScienceMaxMarks10: ['', Validators.required],
      txtScienceMarksObtained10: ['', Validators.required],
      txtPercentage10: [{ value: '', disabled: true }],
    })

    this.QualificationForm12th = this.formBuilder.group({
      ddlState12: ['', [DropdownValidators]],
      txtSchoolCollege12: ['', Validators.required],
      txtYearOfPassing12: ['', Validators.required],
      txtRollNumber12: ['', Validators.required],
      ddlMarksType12: ['', [DropdownValidators]],
      txtMaxMarks12: ['', Validators.required],
      txtMarksObatined12: ['', Validators.required],
      txtPercentage12: [{ value: '', disabled: true }],
    })

    await this.GetPHTrades();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID
    this.searchRequest.DepartmentID = EnumDepartment.ITI;
    this.request.DepartmentID = EnumDepartment.ITI;;

    this.ApplicationID = Number(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? 0)
    if (this.ApplicationID > 0) {
      this.searchRequest.ApplicationID = this.ApplicationID;
      this.request.ApplicationID = this.ApplicationID;
      this.GetById()
    }

    this.GetStateMaterData()
    this.calculatePercentageHigh()
    this.calculatePercentage8th()
    this.calculatePercentage10th()
    await this.loadDropdownData('Board')
    await this.GetPassingYearDDL()
    await this.GetMasterDDL();
 
    this.GetAllDataTrades();
  }

  async OnRemarkChange(dOC: any) {
    if (dOC.Status == EnumVerificationAction.Revert) {
      dOC.ShowRemark = true;
    } else {
      dOC.ShowRemark = false;
      dOC.Remark = '';
    }
    this.Isremarkshow = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert);
  }




  get _PersonalDetailForm() { return this.PersonalDetailForm.controls; }

  get _HighQualificationForm() { return this.HighQualificationForm.controls; }
  get _QualificationForm8th() { return this.QualificationForm8th.controls; }
  get _QualificationForm10th() { return this.QualificationForm10th.controls; }
  get _QualificationForm12th() { return this.QualificationForm12th.controls; }

  async GetStateMaterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StateMasterList = data['Data'];
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

  async loadDropdownData(MasterCode: string) {
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

  async selectDDID(districtID: number) {
    if (districtID > 0) {
      this.filteredTehsilList = this.DevnarayanTehsilList.filter((tehsil: any) =>
        Number(tehsil.DistrictID.toString().trim()) == Number(districtID)
      );
      console.log('Filtered Tehsils:', this.filteredTehsilList);
    } else {
      this.filteredTehsilList = [];
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

      await this.commonMasterService.GetCommonMasterData('ItiTradeList')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ItiTradeList = data['Data'];
        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.GetCommonMasterDDLByType('ParentIncome')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ParentIncomeList = data['Data'];
        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterDDLByType('PWDCategory')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PWDCategoryList = data['Data'];
        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.StreamMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BranchName = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.GetCommonMasterData('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
          console.log("GenderList", this.GenderList)
        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterData('DevnarayanDistrict')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DevnarayanAreaList = data['Data'];
          console.log("GenderList", this.DevnarayanAreaList)
        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterData('DevnarayanAreaTehsil')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DevnarayanTehsilList = data['Data'];
          console.log("GenderList", this.DevnarayanTehsilList)
        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.PrefentialCategoryMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.PrefentialCategoryList = data['Data'];
          console.log(this.PrefentialCategoryList, "list")
        }, error => console.error(error));

      await this.commonMasterService.GetCommonMasterData('TspDistrict')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TspDistrictList = data['Data'];
          console.log("TspDistrictList", this.TspDistrictList)
        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.CategoryBDDLData(EnumDepartment.ITI)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*  console.log(data, 'ggg');*/
          this.CategoryBlist = data['Data'];

        }, (error: any) => console.error(error)
      );
      await this.commonMasterService.GetCommonMasterDDLByType('MarksType')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.MarksTypeList = data['Data'];
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

  async GetPassingYearDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.AdmissionPassingYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
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

  onClick8thCheckbox() {
    this.box8Checked = !this.box8Checked;
    if (!this.box8Checked) {
      this.QualificationForm8th.reset();
      this.formData8th = new Qualification8thDetailsDataModel()
    } else {
      // alert("यदि आप आठवीं(8th option) का चयन करेंगे तो केवल आठवीं प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है इसी प्रकार यदि दसवीं(10th option) का चयन करेंगे तो केवल दसवीं प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है तथा यदि आप बाहरवी(12th option) का चयन करेंगे तो केवल बाहरवी प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है| यदि आप एक से ज्यादा योग्यता के व्यवसाय का चयन करते है तो आपको प्रत्येक व्यवसाय योग्यता के लिए विकल्प पत्र भरना आवश्यक होगा|")
    /*  this.openModalAcknowledgement(this.modal_Acknowledgement);*/
    }
  }

  onClick10thCheckbox() {
    this.box10Checked = !this.box10Checked;
    if (!this.box10Checked) {
      this.QualificationForm10th.reset();
      this.formData10th = new Qualification10thDetailsDataModel()
    } else {
      // alert("यदि आप आठवीं(8th option) का चयन करेंगे तो केवल आठवीं प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है इसी प्रकार यदि दसवीं(10th option) का चयन करेंगे तो केवल दसवीं प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है तथा यदि आप बाहरवी(12th option) का चयन करेंगे तो केवल बाहरवी प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है| यदि आप एक से ज्यादा योग्यता के व्यवसाय का चयन करते है तो आपको प्रत्येक व्यवसाय योग्यता के लिए विकल्प पत्र भरना आवश्यक होगा|")
    /*  this.openModalAcknowledgement(this.modal_Acknowledgement);*/
    }
  }

  onClick12thCheckbox() {
    this.box12Checked = !this.box12Checked;
    if (!this.box12Checked) {
      this.QualificationForm12th.reset();
      this.formData12th = new Qualification12thDetailsDataModel()
    } else {
      // alert("यदि आप आठवीं(8th option) का चयन करेंगे तो केवल आठवीं प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है इसी प्रकार यदि दसवीं(10th option) का चयन करेंगे तो केवल दसवीं प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है तथा यदि आप बाहरवी(12th option) का चयन करेंगे तो केवल बाहरवी प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है| यदि आप एक से ज्यादा योग्यता के व्यवसाय का चयन करते है तो आपको प्रत्येक व्यवसाय योग्यता के लिए विकल्प पत्र भरना आवश्यक होगा|")
      /*  this.openModalAcknowledgement(this.modal_Acknowledgement);*/
    }
  }
 
  calculatePercentageHigh(): void {
    if (this.formData.MarksTypeIDHigh == 84) {
      this.formData.MaxMarksHigh = 10
      this.HighQualificationForm.get('txtMaxMarks')?.disable();
    } else if (this.formData.MarksTypeIDHigh == 83) {
      this.HighQualificationForm.get('txtMaxMarks')?.enable();
    }
    let maxMarks = this.formData.MaxMarksHigh;
    let marksObtained = this.formData.MarksObtainedHigh;

    if (this.formData.MarksTypeIDHigh == 84) {

      if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;
        if (percentage <= 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData.PercentageHigh = '';
          this.formData.MarksObtainedHigh = 0;
        } else {
          this.formData.PercentageHigh = percentage.toFixed(2);
        }
      } else {
        if (maxMarks != 0 && marksObtained != 0) {
          this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
          this.formData.PercentageHigh = '';
          this.formData.MarksObtainedHigh = 0;
        }
      }
    } else if (this.formData.MarksTypeIDHigh == 83 && marksObtained <= maxMarks) {
      if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
        const percentage = (marksObtained / maxMarks) * 100;
        if (percentage <= 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData.PercentageHigh = '';
          this.formData.MarksObtainedHigh = 0;
        } else {
          this.formData.PercentageHigh = percentage.toFixed(2);
        }
      } else {
        if (maxMarks != 0 && marksObtained != 0) {
          this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
          this.formData.PercentageHigh = '';
          this.formData.MarksObtainedHigh = 0;
        }
      }
    }
  }


  calculatePercentage12th(): void {
    if (this.formData12th.MarksTypeID12 == 84) {
      this.formData12th.MaxMarks12 = 10
      this.QualificationForm12th.get('txtMaxMarks12')?.disable();
    } else if (this.formData12th.MarksTypeID12 == 83) {
      this.QualificationForm12th.get('txtMaxMarks12')?.enable();
    }
    let maxMarks = this.formData12th.MaxMarks12;
    let marksObtained = this.formData12th.MarksObtained12;

    if (this.formData12th.MarksTypeID12 == 84) {
      if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;
        if (percentage <= 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData12th.Percentage12 = '';
          this.formData12th.MarksObtained12 = 0;
        } else {
          this.formData12th.Percentage12 = percentage.toFixed(2);
        }
      } else {
        if (maxMarks > 0 && marksObtained > 0) {
          this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
          this.formData12th.Percentage12 = '';
          this.formData12th.MarksObtained12 = 0;
        }

      }
    } else if (this.formData12th.MarksTypeID12 == 83) {
      if (maxMarks < 0 && marksObtained < 0) {
        this.toastr.warning('Maximum Marks and Marks Obtained cannot be Negative');
        this.formData12th.Percentage12 = '';
        this.formData12th.MarksObtained12 = 0;
      } else {
        if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
          const percentage = (marksObtained / maxMarks) * 100;
          if (percentage <= 33) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
            this.formData12th.Percentage12 = '';
            this.formData12th.MarksObtained12 = 0;
          } else {
            this.formData12th.Percentage12 = percentage.toFixed(2);
          }
        } else {
          if (maxMarks != 0 && marksObtained != 0) {
            this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
            this.formData12th.Percentage12 = '';
            this.formData12th.MarksObtained12 = 0;
          }
        }
      }

    }
  }

  calculatePercentage8th(): void {
    if (this.formData8th.MarksTypeID8 == 84) {
      this.formData8th.MaxMarks8 = 10
      this.QualificationForm8th.get('txtMaxMarks8')?.disable();
    } else if (this.formData8th.MarksTypeID8 == 83) {
      this.QualificationForm8th.get('txtMaxMarks8')?.enable();
    }
    let maxMarks = this.formData8th.MaxMarks8;
    let marksObtained = this.formData8th.MarksObtained8;

    if (this.formData8th.MarksTypeID8 == 84) {
      if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;
        if (percentage <= 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData8th.Percentage8 = '';
          this.formData8th.MarksObtained8 = 0;
        } else {
          this.formData8th.Percentage8 = percentage.toFixed(2);
        }
      } else {
        if (maxMarks > 0 && marksObtained > 0) {
          this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
          this.formData8th.Percentage8 = '';
          this.formData8th.MarksObtained8 = 0;
        }

      }
    } else if (this.formData8th.MarksTypeID8 == 83) {
      if (maxMarks < 0 && marksObtained < 0) {
        this.toastr.warning('Maximum Marks and Marks Obtained cannot be Negative');
        this.formData8th.Percentage8 = '';
        this.formData8th.MarksObtained8 = 0;
      } else {
        if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
          const percentage = (marksObtained / maxMarks) * 100;
          if (percentage <= 33) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
            this.formData8th.Percentage8 = '';
            this.formData8th.MarksObtained8 = 0;
          } else {
            this.formData8th.Percentage8 = percentage.toFixed(2);
          }
        } else {
          if (maxMarks != 0 && marksObtained != 0) {
            this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
            this.formData8th.Percentage8 = '';
            this.formData8th.MarksObtained8 = 0;
          }
        }
      }

    }
  }

  restrictInvalidCharacters(event: any) {
    const value = event.target.value;
    const invalidChars = /[+\-*/]/g;
    if (invalidChars.test(value)) {
      event.target.value = value.replace(invalidChars, '');
    }
  }

  calculatePercentage10th(): void {
    if (this.formData10th.MarksTypeID10 == 84) {
      this.formData10th.MaxMarks10 = 10
      this.formData10th.MathsMaxMarks10 = 10
      this.formData10th.ScienceMaxMarks10 = 10
      this.QualificationForm10th.get('txtMaxMarks10')?.disable();
      this.QualificationForm10th.get('txtMathsMaxMarks10')?.disable();
      this.QualificationForm10th.get('txtScienceMaxMarks10')?.disable();
    } else if (this.formData10th.MarksTypeID10 == 83) {
      this.QualificationForm10th.get('txtMaxMarks10')?.enable();
      this.QualificationForm10th.get('txtMathsMaxMarks10')?.enable();
      this.QualificationForm10th.get('txtScienceMaxMarks10')?.enable();
    }
    let maxMarks = this.formData10th.MaxMarks10;
    let marksObtained = this.formData10th.MarksObtained10;

    if (this.formData10th.MarksTypeID10 == 84) {

      if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;
        if (percentage <= 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData10th.Percentage10 = '';
          this.formData10th.MarksObtained10 = 0;
        } else {
          this.formData10th.Percentage10 = percentage.toFixed(2);
        }
      } else {
        if (maxMarks != 0 && marksObtained != 0) {
          this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
          this.formData10th.Percentage10 = '';
          this.formData10th.MarksObtained10 = 0;
          this.formData10th.MathsMarksObtained10 = 0;
          this.formData10th.ScienceMarksObtained10 = 0;
        }
      }
    } else if (this.formData10th.MarksTypeID10 == 83) {
      if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
        const percentage = (marksObtained / maxMarks) * 100;
        if (percentage <= 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData10th.Percentage10 = '';
          this.formData10th.MarksObtained10 = 0;
        } else {
          this.formData10th.Percentage10 = percentage.toFixed(2);
        }
      } else {
        if (maxMarks != 0 && marksObtained != 0) {
          this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
          this.formData10th.Percentage10 = '';
          this.formData10th.MarksObtained10 = 0;
          this.formData10th.MathsMarksObtained10 = 0;
          this.formData10th.ScienceMarksObtained10 = 0;
        }
      }
    }
  }

  ScienceAndMathsMarksValidation() {
    if (this.formData10th.ScienceMarksObtained10 != 0 && this.formData10th.ScienceMaxMarks10 != 0 &&
      this.formData10th.ScienceMarksObtained10 > this.formData10th.ScienceMaxMarks10) {
      this.toastr.warning('Science Marks Obtained cannot be greater than Science Maximum Marks', 'Error');
      this.formData10th.ScienceMarksObtained10 = 0;
      return;
    }

    if (this.formData10th.MathsMarksObtained10 != 0 && this.formData10th.MathsMaxMarks10 != 0 &&
      this.formData10th.MathsMarksObtained10 > this.formData10th.MathsMaxMarks10) {
      this.toastr.warning('Maths Marks Obtained cannot be greater than Maths Maximum Marks', 'Error');
      this.formData10th.MathsMarksObtained10 = 0;
      return;
    }

    if (this.formData10th.MarksTypeID10 == 83) {
      if (
        this.formData10th.ScienceMarksObtained10 != 0 &&
        this.formData10th.MathsMarksObtained10 != 0 &&
        this.formData10th.ScienceMaxMarks10 != 0 &&
        this.formData10th.MathsMaxMarks10 != 0
      ) {
        if ((this.formData10th.ScienceMarksObtained10 + this.formData10th.MathsMarksObtained10) > this.formData10th.MarksObtained10) {
          this.toastr.warning('Science and Maths Marks Obtained cannot be greater than Aggregate Marks Obtained', 'Error');
          this.formData10th.ScienceMarksObtained10 = 0;
          this.formData10th.MathsMarksObtained10 = 0;
          return;
        }
      }
    }
  }

  RollNumberValidation(input: any) {
    return input.replace(/[^a-zA-Z0-9/]/g, '');
  }


  ResetPersonalDetails() {
    this.request.DOB = '';
    this.request.Gender = '';
    this.request.WhatsNumber = '';
    this.request.LandlineNumber = '';
    this.request.IndentyProff = 0;
    this.request.DetailID = '';
    this.request.Maritial = 0;
    this.request.Religion = 0;
    this.request.Nationality = 0;
    this.request.IsMinority = false
    this.request.ParentIncome = 0
    this.request.IsEWSCategory = 0
    this.request.CategoryA = 0;
    this.request.CategoryB = 0;
    this.request.CategoryC = 0;
    this.request.Eligible8thTradesID = 0;
    this.request.Eligibl10thTradesID = 0;
    this.request.PWDCategoryID = 0;
    this.request.CategoryE = 0;
  }
  filterString(input: string): string {
    return input.replace(/[^a-zA-Z]/g, '');
  }

  filterNumber(input: string): string {
    return input.replace(/[^0-9]/g, '');
  }
  async GetAllDataTrades() {
    try {
      this.tradeSearchRequest.action = '_getAllData'
      this.loaderService.requestStarted();
      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiTradeListAll = data.Data
        console.log("ItiTradeListAll", this.ItiTradeListAll)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetPHTrades() {
    try {
      this.tradeSearchRequest.action = '_getPHTrades'
      this.loaderService.requestStarted();
      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiPHTradeList = data.Data
        console.log("ItiPHTradeList", this.ItiPHTradeList)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  // multiselect events
  public onFilterChange(item: any) {
    console.log(item);
  }
  public onDropDownClose(item: any) {
    console.log(item);
  }

  public onItemSelect(item: any) {
    console.log(item);
  }
  public onDeSelect(item: any) {
    console.log(item);
  }

  public onSelectAll(items: any) {
    console.log(items);
  }
  public onDeSelectAll(items: any) {
    console.log(items);
  }

  async SetDepartmentID() {
  }

  async GetById() {
    // const DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.ItiApplicationFormService.DocumentScrunityData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("What I got from DB", data.Data)
          if (data['Data'] != null) {
            this.request = data['Data']
            this.GetTspTehsilList()
            const dob = new Date(data['Data']['DOB']);
            const year = dob.getFullYear();
            const month = String(dob.getMonth() + 1).padStart(2, '0');
            const day = String(dob.getDate()).padStart(2, '0');
            this.request.DOB = `${year}-${month}-${day}`;


          }

          this.request.QualificationDetailsDataModel = data['Data']['QualificationDetailsDataModel']
          console.log(this.request.QualificationDetailsDataModel, "sdfsf")
          this.request.QualificationDetailsDataModel.map((list: any) => {

            if (list.Qualification == "8") {
              this.box8Checked = true
              this.formData8th.StateID8 = list.StateID
              this.formData8th.SchoolCollege8 = list.SchoolCollege
              this.formData8th.YearofPassing8 = list.YearofPassing
              this.formData8th.RollNumber8 = list.RollNumber
              this.formData8th.MarksTypeID8 = list.MarksTypeID
              this.formData8th.MaxMarks8 = list.MaxMarks
              this.formData8th.MarksObtained8 = list.MarksObtained
              this.calculatePercentage8th()

            } else if (list.Qualification == "10") {
              this.box10Checked = true
              this.formData10th.StateID10 = list.StateID
              this.formData10th.BoardUniversity10 = list.BoardUniversity
              this.formData10th.YearofPassing10 = list.YearofPassing
              this.formData10th.RollNumber10 = list.RollNumber
              this.formData10th.MarksTypeID10 = list.MarksTypeID
              this.formData10th.MaxMarks10 = list.MaxMarks
              this.formData10th.MarksObtained10 = list.MarksObtained
              this.formData10th.MathsMaxMarks10 = list.MathsMaxMarks
              this.formData10th.MathsMarksObtained10 = list.MathsMarksObtained
              this.formData10th.ScienceMaxMarks10 = list.ScienceMaxMarks
              this.formData10th.ScienceMarksObtained10 = list.ScienceMarksObtained
              this.calculatePercentage10th()

            }
            if (list.Qualification == "12") {
              this.box12Checked = true
              this.formData12th.StateID12 = list.StateID
              this.formData12th.SchoolCollege12 = list.SchoolCollege
              this.formData12th.YearofPassing12 = list.YearofPassing
              this.formData12th.RollNumber12 = list.RollNumber
              this.formData12th.MarksTypeID12 = list.MarksTypeID
              this.formData12th.MaxMarks12 = list.MaxMarks
              this.formData12th.MarksObtained12 = list.MarksObtained
              this.calculatePercentage12th()

            }
            else {
              this.formData.StateIDHigh = list.StateID
              this.formData.BoardUniversityHigh = list.UniversityBoard
              this.formData.SchoolCollegeHigh = list.SchoolCollege
              this.formData.HighestQualificationHigh = list.Qualification
              this.formData.YearofPassingHigh = list.YearofPassing
              this.formData.RollNumberHigh = list.RollNumber
              this.formData.MarksTypeIDHigh = list.MarksTypeID
              this.formData.MaxMarksHigh = list.MaxMarks
              this.formData.MarksObtainedHigh = list.MarksObtained
              this.calculatePercentageHigh()
  
            }
            console.log(this.formData, "formdata")
          })








          this.request.VerificationDocumentDetailList = data['Data']['VerificationDocumentDetailList']




          this.request.VerificationDocumentDetailList.some((x: any) => x.Status === 5); this.request.VerificationDocumentDetailList.forEach((x: any) => {
            if (x.Status === 5) {
              x.Status = 0;
            }
          });

          if (this.request.VerificationDocumentDetailList.some((x: any) => x.Status != 0)) {
            this.changeshow = false
          } else if (this.request.VerificationDocumentDetailList.every((x: any) => x.Status == 0)) {
            this.changeshow = true
          }

          this.Isremarkshow = this.request.VerificationDocumentDetailList.some((x: any) => x.Status === EnumVerificationAction.Revert);
        
          //this.request.DOB = new Date(data['Data']['DOB']).toISOString().split('T').shift().toString();
          //this.request.Religion = data['Data']['Religion']
          //this.request.VerificationDocumentDetailList.forEach((dOC: any) => {
          //  dOC.ShowRemark = dOC.Status === EnumVerificationAction.Revert;
          //});

          // Recalculate Isremarkshow
/*          this.Isremarkshow = this.request.VerificationDocumentDetailList.some((x: any) => x.Status === EnumVerificationAction.Revert);*/

          if (this.request?.VerificationDocumentDetailList) {

            this.filteredDocumentDetails = this.request.VerificationDocumentDetailList.filter((x) => x.GroupNo === 1);
          } else {

            this.filteredDocumentDetails = [];
          }


          this.PH8thTradeList = this.request.PH8thTradeList.split(',').map(x => ({ Id: parseInt(x) }))
          this.PH10thTradeList = this.request.PH10thTradeList.split(',').map(x => ({ Id: parseInt(x) }))
          this.PH12thTradeList = this.request.PH12thTradeList.split(',').map(x => ({ Id: parseInt(x) }))

          const selectedIDs8 = this.PH8thTradeList.map((item: any) => item.Id)
          const selectedIDs10 = this.PH10thTradeList.map((item: any) => item.Id)
          const selectedIDs12 = this.PH12thTradeList.map((item: any) => item.Id)
          this.GetPHTrades();
          this.PH8thTradeList = this.ItiPHTradeList.filter((item: any) => {
            return selectedIDs8.includes(item.Id);
          })

          this.PH10thTradeList = this.ItiPHTradeList.filter((item: any) => {
            return selectedIDs10.includes(item.Id);
          })

          this.PH12thTradeList = this.ItiPHTradeList.filter((item: any) => {
            return selectedIDs12.includes(item.Id);
          })

          this.request.Domicile = data.Data.Prefential

          if (data.Data.IsTSP == true) {
            this.request.subCategory = 1
            console.log("subCategory", this.request.subCategory)
          } else if (data.Data.IsSaharia == true) {
            this.request.subCategory = 2
          } else {
            this.request.subCategory = 3
          }

          // Fetch the Tehsils if not already loaded
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
          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

          this.cdRef.detectChanges();
          this.cdRef.markForCheck();
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async SaveData() {
    this.isSubmitted = true;

    if (this.box8Checked && this.QualificationForm8th.invalid) {
      this.toastr.error('QualificationForm8th Form is invalid!');
      // Object.keys(this.QualificationForm8th.controls).forEach(key => {
      //   const control = this.QualificationForm8th.get(key);

      //   if (control && control.invalid) {
      //     this.toastr.error(`Control ${key} is invalid`);
      //     Object.keys(control.errors!).forEach(errorKey => {
      //       this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
      //     });
      //   }
      // });
      return;
    }

    if (this.box10Checked && this.QualificationForm10th.invalid) {
      this.toastr.error('QualificationForm10th Form is invalid! ');
      // Object.keys(this.QualificationForm10th.controls).forEach(key => {
      //   const control = this.QualificationForm10th.get(key);

      //   if (control && control.invalid) {
      //     this.toastr.error(`Control ${key} is invalid`);
      //     Object.keys(control.errors!).forEach(errorKey => {
      //       this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
      //     });
      //   }
      // });
      return;
    }

    if (this.box12Checked && this.QualificationForm12th.invalid) {
      this.toastr.error('QualificationForm12th Form is invalid!');
      // Object.keys(this.QualificationForm8th.controls).forEach(key => {
      //   const control = this.QualificationForm8th.get(key);

      //   if (control && control.invalid) {
      //     this.toastr.error(`Control ${key} is invalid`);
      //     Object.keys(control.errors!).forEach(errorKey => {
      //       this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
      //     });
      //   }
      // });
      return;
    }

    if (this.box10Checked && this.box8Checked && Number(this.formData8th.YearofPassing8) > Number(this.formData10th.YearofPassing10)) {
      this.toastr.warning('Passing Year of 8th must be less than Passing Year of 10th', 'Invalid');
      return;
    }

    if (this.box12Checked && this.box8Checked && Number(this.formData8th.YearofPassing8) > Number(this.formData12th.YearofPassing12)) {
      this.toastr.warning('Passing Year of 8th must be less than Passing Year of 12th', 'Invalid');
      return;
    }

    if (this.box12Checked && this.box10Checked && Number(this.formData10th.YearofPassing10) > Number(this.formData12th.YearofPassing12)) {
      this.toastr.warning('Passing Year of 10th must be less than Passing Year of 12th', 'Invalid');
      return;
    } 

    if (this.formData.YearofPassingHigh != '' && this.formData.YearofPassingHigh != '0') {
      if (Number(this.formData8th.YearofPassing8) >= Number(this.formData.YearofPassingHigh) ||
        Number(this.formData10th.YearofPassing10) >= Number(this.formData.YearofPassingHigh) ||
        Number(this.formData12th.YearofPassing12) >= Number(this.formData.YearofPassingHigh)){
        this.toastr.warning('Passing Year of Highest Qualification must be greater than Passing Year of 8th and 10th and 12th', 'Invalid');
        return;
      }
    }

    if (this.box12Checked && this.formData12th.Percentage12 == '' || this.formData12th.Percentage12 == '0') {
      this.toastr.warning('Percentage of 12th is required', 'Invalid');
      return;
    }

    if (this.box10Checked && this.formData10th.Percentage10 == '' || this.formData10th.Percentage10 == '0') {
      this.toastr.warning('Percentage of 10th is required', 'Invalid');
      return;
    }

    if (this.box8Checked && this.formData8th.Percentage8 == '' || this.formData8th.Percentage8 == '0') {
      this.toastr.warning('Percentage of 8th is required', 'Invalid');
      return;
    }

    this.request.QualificationDetailsDataModel = [];

    if (this.box8Checked) {
      this.request.QualificationDetailsDataModel.push({
        ApplicationID: this.ApplicationID,
        SSOID: this.SSOLoginDataModel.SSOID,
        StateID: this.QualificationForm8th.value.ddlState8,
        BoardUniversity: '',
        SchoolCollege: this.QualificationForm8th.value.txtSchoolCollege8,
        Qualification: '8',
        YearofPassing: this.QualificationForm8th.value.txtYearOfPassing8,
        RollNumber: this.QualificationForm8th.value.txtRollNumber8,
        MarksTypeID: this.QualificationForm8th.value.ddlMarksType8,
        MaxMarks: this.QualificationForm8th.value.txtMaxMarks8,
        MarksObtained: this.QualificationForm8th.value.txtMarksObatined8,
        Percentage: Number(this.formData8th.Percentage8),
        MathsMaxMarks: 0,
        MathsMarksObtained: 0,
        ScienceMaxMarks: 0,
        ScienceMarksObtained: 0,
        ModifyBy: this.SSOLoginDataModel.UserID,
        DepartmentID: 2,
        CreatedBy: this.SSOLoginDataModel.UserID,
        ActiveStatus: 1,
        DeleteStatus: 0,
        UniversityBoard: ''
      });
    }

    if (this.box10Checked) {
      this.request.QualificationDetailsDataModel.push({
        ApplicationID: this.ApplicationID,
        SSOID: this.SSOLoginDataModel.SSOID,
        StateID: this.QualificationForm10th.value.ddlState10,
        BoardUniversity: this.QualificationForm10th.value.txtBoardUniversity10,
        SchoolCollege: '',
        Qualification: '10',
        YearofPassing: this.QualificationForm10th.value.txtYearOfPassing10,
        RollNumber: this.QualificationForm10th.value.txtRollNumber10,
        MarksTypeID: this.QualificationForm10th.value.ddlMarksType10,
        MaxMarks: this.QualificationForm10th.value.txtMaxMarks10,
        MarksObtained: this.QualificationForm10th.value.txtMarksObatined10,
        Percentage: Number(this.formData10th.Percentage10),
        MathsMaxMarks: this.QualificationForm10th.value.txtMathsMaxMarks10,
        MathsMarksObtained: this.QualificationForm10th.value.txtMathsMarksObtained10,
        ScienceMaxMarks: this.QualificationForm10th.value.txtScienceMaxMarks10,
        ScienceMarksObtained: this.QualificationForm10th.value.txtScienceMarksObtained10,
        ModifyBy: this.SSOLoginDataModel.UserID,
        DepartmentID: 2,
        CreatedBy: this.SSOLoginDataModel.UserID,
        ActiveStatus: 1,
        DeleteStatus: 0,
        UniversityBoard: ''
      });
    }

    if (this.box12Checked) {
      this.request.QualificationDetailsDataModel.push({
        ApplicationID: this.ApplicationID,
        SSOID: this.SSOLoginDataModel.SSOID,
        StateID: this.QualificationForm12th.value.ddlState12,
        BoardUniversity: '',
        SchoolCollege: this.QualificationForm12th.value.txtSchoolCollege12,
        Qualification: '12',
        YearofPassing: this.QualificationForm12th.value.txtYearOfPassing12,
        RollNumber: this.QualificationForm12th.value.txtRollNumber12,
        MarksTypeID: this.QualificationForm12th.value.ddlMarksType12,
        MaxMarks: this.QualificationForm12th.value.txtMaxMarks12,
        MarksObtained: this.QualificationForm12th.value.txtMarksObatined12,
        Percentage: Number(this.formData12th.Percentage12),
        MathsMaxMarks: 0,
        MathsMarksObtained: 0,
        ScienceMaxMarks: 0,
        ScienceMarksObtained: 0,
        ModifyBy: this.SSOLoginDataModel.UserID,
        DepartmentID: 2,
        CreatedBy: this.SSOLoginDataModel.UserID,
        ActiveStatus: 1,
        DeleteStatus: 0,
        UniversityBoard: ''
      });
    }

    if (this.HighQualificationForm.invalid) {
      console.log("this.QualificationForm10th.invalid");
    } else {
      this.request.QualificationDetailsDataModel.push({
        ApplicationID: this.ApplicationID,
        SSOID: this.SSOLoginDataModel.SSOID,
        StateID: this.HighQualificationForm.value.ddlState,
        BoardUniversity: '0',
        SchoolCollege: this.HighQualificationForm.value.txtSchoolCollege,
        Qualification: this.HighQualificationForm.value.txtHighestQualification,
        YearofPassing: this.HighQualificationForm.value.txtYearOfPassing,
        RollNumber: this.HighQualificationForm.value.txtRollNumber,
        MarksTypeID: this.HighQualificationForm.value.ddlMarksType,
        MaxMarks: this.HighQualificationForm.value.txtMaxMarks,
        MarksObtained: this.HighQualificationForm.value.txtMarksObatined,
        Percentage: Number(this.formData.PercentageHigh),
        MathsMaxMarks: 0,
        MathsMarksObtained: 0,
        ScienceMaxMarks: 0,
        ScienceMarksObtained: 0,
        ModifyBy: this.SSOLoginDataModel.UserID,
        DepartmentID: 2,
        CreatedBy: this.SSOLoginDataModel.UserID,
        ActiveStatus: 1,
        DeleteStatus: 0,
        UniversityBoard: this.HighQualificationForm.value.txtBoardUniversity,
      });
    }

    if (!this.box8Checked && !this.box10Checked && !this.box12Checked) {
      this.toastr.error("Please Select and fill at least one qualification..... ")
      return
    }

    const tradeIds8 = this.PH8thTradeList.map((item: any) => item.Id)

    this.request.PH8thTradeList = JSON.stringify(tradeIds8)
    this.request.PH8thTradeList = JSON.parse(this.request.PH8thTradeList).join(',');
    console.log("PH8thTradeList", this.request.PH8thTradeList)

    const tradeIds10 = this.PH10thTradeList.map((item: any) => item.Id)
    this.request.PH10thTradeList = JSON.stringify(tradeIds10)
    this.request.PH10thTradeList = JSON.parse(this.request.PH10thTradeList).join(',');
    console.log("PH10thTradeList", this.request.PH10thTradeList)

    const tradeIds12 = this.PH12thTradeList.map((item: any) => item.Id)

    this.request.PH12thTradeList = JSON.stringify(tradeIds12)
    this.request.PH12thTradeList = JSON.parse(this.request.PH12thTradeList).join(',');
    console.log("PH12thTradeList", this.request.PH12thTradeList)

    if (this.PersonalDetailForm.invalid) {
      this.toastr.error('Invalid form Details');
      return;
    }



    const IsRemarKvalid = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert && x.Remark == '' || x.Status == 0);
    if (IsRemarKvalid == true) {
      /*      this.toastr.error("Please enter valisd Remark")*/
      return
    }


    this.Isremarkshow = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert);



  
    console.log(this.request)


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


    if (this.request.IsTSP == true) {
      if (this.request.TspDistrictID == 0 || this.request.TspDistrictID == null || this.request.TspDistrictID == undefined) {
        this.toastr.warning('Please Select अनुसूचित जिला (Tribal District)');
        return
      }
      if (this.request.TSPTehsilID == 0 || this.request.TSPTehsilID == null || this.request.TSPTehsilID == undefined) {
        this.toastr.warning('Please Select अनुसूचित तहसील (Tribal Tehsil)')
        return
      }
    } else {
      this.request.TspDistrictID = 0
    }
    if (this.request.CategoryC == 69) {
      if (this.request.PWDCategoryID == 0 || this.request.PWDCategoryID == null || this.request.PWDCategoryID == undefined) {
        this.toastr.warning('Please Select पीडब्ल्यूडी श्रेणी (PWD Category)');
        return
      }
      if (this.box10thChecked && this.PH10thTradeList.length == 0) {
        this.toastr.warning('पात्र 10th के व्यवसाय चुने (Eligible 10th Trades) ');
        return
      }
      if (this.box8thChecked && this.PH8thTradeList.length == 0) {
        this.toastr.warning('पात्र 8th के व्यवसाय चुने (Eligible 8th Trades)');
        return
      }
    }

    if (this.request.CategoryA == 9) {
      this.request.IsEWSCategory = 1
    }




    this.request.ModifyBy = this.SSOLoginDataModel.UserID;
    this.request.DepartmentID = EnumDepartment.ITI


    this.swat.Confirmation(confirmationMessage, async (result: any) => {
      if (result.isConfirmed) {

        this.loaderService.requestStarted();
        try {
          await this.ItiApplicationFormService.Save_Documentscrutiny(this.request)
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

    if (this.reject.Remark == '') {
      this.toastr.error("Please Enter Remarks")
      return
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
          await this.Rejectservice.Reject_Document(this.reject)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data);
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (this.State = EnumStatus.Success) {
                this.toastr.success(this.Message)
                this.CloseModel()
              /*  this.router.navigate(['/StudentVerificationList'])*/
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

}
