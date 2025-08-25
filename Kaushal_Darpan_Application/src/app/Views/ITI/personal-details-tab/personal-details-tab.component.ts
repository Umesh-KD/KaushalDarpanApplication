import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ItiApplicationFormService } from '../../../Services/ItiApplicationForm/iti-application-form.service';
import { PersonalDetailsDatamodel } from '../../../Models/ITIFormDataModel';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ItiApplicationSearchmodel } from '../../../Models/ItiApplicationPreviewDataModel';
import { JanAadharMemberDetails } from '../../../Models/StudentJanAadharDetailModel';
import { ItiTradeSearchModel, TSPTehsilDataModel } from '../../../Models/CommonMasterDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { TspAreasService } from '../../../Services/Tsp-Areas/Tsp-Areas.service';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
declare function LoadData(): any;
@Component({
    selector: 'app-personal-details-tab',
    templateUrl: './personal-details-tab.component.html',
    styleUrls: ['./personal-details-tab.component.css'],
    standalone: false
})
export class PersonalDetailsTabComponent implements OnInit {
  tooltipVisible = false;
  tooltipMessage = 'Please type word in english and enter space to convert in hindi';
  public DepartmentID: any = 0;
  public _enumDepartment = EnumDepartment
  public testid: string = ''
  public sSOLoginDataModel = new SSOLoginDataModel()
  public PersonalDetailForm!: FormGroup
  public request = new PersonalDetailsDatamodel()
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
  public box8thChecked:boolean = false
  public box10thChecked:boolean = false
  public searchRequest = new ItiApplicationSearchmodel()
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

  public ItiPHTradeList: any = []
  public settingsMultiselect: object = {};
  public TradeList8th: any[] = [];
  public TradeList10th: any[] = [];
  PH10thTradeList: any[] = [];
  PH8thTradeList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private ItiApplicationFormService: ItiApplicationFormService,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private tspAreaService: TspAreasService,
    private encryptionService: EncryptionService,
    private routers: Router
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
        ddlCategoryB: ['', [DropdownValidators]],
        ddlCategoryc: ['', [DropdownValidators]],
        //ddlCategoryE: ['', [DropdownValidators]],

        ddlIncomeDetail: ['',],
        ddlMinority: [''],
        ddlEWSCategory: [''],
        ddlEligible8thTradesID: [''],
        ddlEligible10thTradesID: [''],
        ddlPWDCategoryID: [''],
        txtDomicile: [{ value: '', disabled: true }],
        IsTSP: [''],
        IsSaharia: [''],
        TspDistrictID: [''],
        subCategory: [''],
        IsDevnarayan: [''],
        DevnarayanDistrictID: [''],
        DevnarayanTehsilID: [''],
        TSPTehsilID: [''],
        PH8thTradeList: [[],],
        PH10thTradeList: [[],],
        Apaarid: [''],
      });
      await this.GetPHTrades();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID
    this.searchRequest.DepartmentID = EnumDepartment.ITI;
    this.request.DepartmentID = EnumDepartment.ITI;;
    
    this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0")) 
    if (this.ApplicationID > 0) {
      this.searchRequest.ApplicationID = this.ApplicationID;
      this.request.ApplicationID = this.ApplicationID;
      this.GetById()
    }


    await this.GetMasterDDL();
    await this.QualificationDataById();
    this.GetAllDataTrades();
    

    this.PersonalDetailForm.valueChanges.pipe(
      debounceTime(500)  // Wait 500ms after the last input change
    ).subscribe(() => {
      LoadData();  // Trigger translation on value change
      setTimeout(() => {
        this.SetFoamData()
      }, .100);

    })
  }

  showTooltip(event: FocusEvent): void {
    this.tooltipVisible = true;
  }

  hideTooltip(event: FocusEvent): void {
    this.tooltipVisible = false;
  }

  SetFoamData() {
    // Assuming IndiTrans is available globally
    const inputFields = document.querySelectorAll('[gtranslate="true"]');
    inputFields.forEach((inputField: Element) => {
      // Ensure inputField is an HTMLInputElement
      const input = inputField as HTMLInputElement;
      const originalValue = input.value;

      // Only translate text fields with value
      if (originalValue) {
        // Trigger translation by assigning the original value
        input.value = originalValue;

        // Assuming Google Translate updates the field instantly,
        // we can directly access the translated text after the translation.
        setTimeout(() => {
          const translatedText = input.value;

          // Get the form control name from the 'formControlName' attribute
          const formControlName = input.getAttribute('formControlName');
          if (formControlName) {
            // Update the corresponding form control with the translated text
            this.PersonalDetailForm.get(formControlName)?.setValue(translatedText, { emitEvent: false });
          }
        }, 100);  // Timeout to ensure translation has time to complete
      }
    });
  }

  get _PersonalDetailForm() { return this.PersonalDetailForm.controls; }

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

  async SavePersonalDetails() {

    console.log(this.PersonalDetailForm.value);

    const tradeIds8 = this.PH8thTradeList.map((item: any) => item.Id)

    this.request.PH8thTradeList = JSON.stringify(tradeIds8)
    this.request.PH8thTradeList = JSON.parse(this.request.PH8thTradeList).join(',');
    console.log("PH8thTradeList",this.request.PH8thTradeList)

    const tradeIds10 = this.PH10thTradeList.map((item: any) => item.Id)
    this.request.PH10thTradeList = JSON.stringify(tradeIds10)
    this.request.PH10thTradeList = JSON.parse(this.request.PH10thTradeList).join(',');
    console.log("PH10thTradeList", this.request.PH10thTradeList )

    try {
      this.isSubmitted = true;

      if (this.PersonalDetailForm.invalid) {
        this.toastr.error('Invalid form Details');
        return;
      }

      if (this.request.CategoryA == 3) {
        if(this.request.subCategory == 1) {
          this.request.IsTSP = true
          this.request.IsSaharia = false
        } else if(this.request.subCategory == 2) {
          this.request.IsSaharia = true
          this.request.IsTSP = false
        } else if(this.request.subCategory == 3) {
          this.request.IsTSP = false
          this.request.IsSaharia = false
        } else {
          this.toastr.warning('Please Select उप वर्ग (Subcategory)');
          return
        }
      }

      if(this.request.IsTSP == true) {
        if(this.request.TspDistrictID == 0 || this.request.TspDistrictID == null || this.request.TspDistrictID == undefined) {
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
      if(this.request.CategoryC == 69) {
        if(this.request.PWDCategoryID == 0 || this.request.PWDCategoryID == null || this.request.PWDCategoryID == undefined) {
          this.toastr.warning('Please Select पीडब्ल्यूडी श्रेणी (PWD Category)');
          return
        }
        // if(this.box10thChecked && this.PH10thTradeList.length == 0) {
        //   this.toastr.warning('पात्र 10th के व्यवसाय चुने (Eligible 10th Trades) ');
        //   return
        // }
        // if(this.box8thChecked && this.PH8thTradeList.length == 0) {
        //   this.toastr.warning('पात्र 8th के व्यवसाय चुने (Eligible 8th Trades)');
        //   return
        // }
      }
      if(this.request.CategoryA == 9) {
        this.request.IsEWSCategory = 1
      }
      if (this.request.CategoryC != 69) {
        this.request.PWDCategoryID=0
      }


      if (this.request.IndentyProff == 1 && this.request.DetailID.length < 12) {
        this.toastr.warning("Invalid Aadhar Number");
        return
      } else if (this.request.IndentyProff == 2 && this.request.DetailID.length < 14) {
        this.toastr.warning("Invalid Aadhar Enrollment ID");
        return
      }

      this.loaderService.requestStarted();

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      console.log("this.request",this.request)
      
      await this.ItiApplicationFormService.SavePersonalDetailsData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success)
          {
            this.toastr.success(data.Message)
            this.tabChange.emit(1);
          }
          else
          {
            if (data.Data == '-5')
            {
              this.toastr.warning('You have already registered for the two-year course in the previous academic session.');
              this.routers.navigate(['/dashboard']);
            }
            else
            {
              this.toastr.error(data.ErrorMessage)
            }
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

  async GetById() {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();

      await this.ItiApplicationFormService.GetApplicationDatabyID(this.searchRequest)
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

            if (this.request.DetailID != null || this.request.DetailID != undefined || this.request.DetailID != '') {
              this.request.IndentyProff = 1
            }
            if(this.request.MobileNumber != null || this.request.MobileNumber != undefined || this.request.MobileNumber != '') {
              this.request.WhatsNumber = this.request.MobileNumber
            }

            if (this.request.Nationality == null || this.request.Nationality == undefined || this.request.Nationality == 0) {
              this.request.Nationality = 66;
            }


            
            this.request.Domicile = data.Data.Prefential
            
            if (data.Data.IsTSP == true) {
              this.request.subCategory = 1
            } else if (data.Data.IsSaharia == true) {
              this.request.subCategory = 2
            } else {
              this.request.subCategory = 3
            }   
          }

          this.PH8thTradeList = this.request.PH8thTradeList.split(',').map(x => ({ Id: parseInt(x) }))
          this.PH10thTradeList = this.request.PH10thTradeList.split(',').map(x => ({Id: parseInt(x)}))

          const selectedIDs8 = this.PH8thTradeList.map((item: any) => item.Id)
          const selectedIDs10 = this.PH10thTradeList.map((item: any) => item.Id)
          this.GetPHTrades();
          this.PH8thTradeList = this.ItiPHTradeList.filter((item: any) => {
            return selectedIDs8.includes(item.Id);
          })

          this.PH10thTradeList = this.ItiPHTradeList.filter((item: any) => {
            return selectedIDs10.includes(item.Id);
          })
                

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

          if (this.request.IndentyProff)



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
          console.log("NationalityList", this.NationalityList)
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
          this.category_CList = this.category_CList.filter((list: any) => list.Name != 'Kashmiri Migrants (KM)')
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
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
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

      await this.commonMasterService.PrefentialCategoryMaster(EnumDepartment.ITI)
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
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 4000);
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
      }, 4000);
    }
  }

  ResetPersonalDetails() {
/*    this.request.DOB = '';*/
/*    this.request.Gender = '';*/
    this.request.WhatsNumber = '';
    this.request.StudentNameHindi = '';
    this.request.LandlineNumber = '';
    this.request.FatherNameHindi = '';
    this.request.MotherNameHindi = '';
    this.request.IndentyProff = 0;
    this.request.DetailID = '';
    this.request.Maritial = 0;
    this.request.Religion = 0;
    this.request.Nationality = 66;
    this.request.IsMinority = false
    this.request.IsSaharia = false
    this.request.IsTSP = false
    this.request.ParentIncome = 0
    this.request.IsEWSCategory = 0
/*    this.request.CategoryA = 0;*/
    this.request.CategoryB = 0;
    this.request.CategoryC = 0;
    this.request.Eligible8thTradesID = 0;
    this.request.Eligibl10thTradesID = 0;
    this.request.PWDCategoryID = 0;
    this.request.CategoryE = 0;
    this.request.IsDevnarayan = 0
    this.request.IsDevnarayan = 0
    this.request.IsDevnarayan = 0
    this.request.IsDevnarayan = 0
    this.request.subCategory = 0
    this.request.DevnarayanTehsilID = 0
    this.request.DevnarayanDistrictID = 0
    this.request.TSPTehsilID = 0
    this.request.TspDistrictID = 0
    this.request.Apaarid = ''

  }


  async QualificationDataById()
  {
    this.isSubmitted = false;
    try
    {
      this.loaderService.requestStarted();
      await this.ItiApplicationFormService.GetQualificationDatabyID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.QualificationDataList = data.Data
          this.QualificationDataList.map((list: any) => {
            if(list.Qualification == "10") {
              this.box10thChecked = true
            }
            if (list.Qualification == "8") {
              this.box8thChecked = true
            }
          })
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 4000);
    }
  }

  filterString(input: string): string {
    return input.replace(/[^a-zA-Z]/g, '');
  }

  filterNumber(input: string): string {
    return input.replace(/[^0-9]/g, '');
  }

  async Back() {
    this.tabChange.emit(0)
  }

  async FillMemberDetails(){
    try {
      this.request.StudentName = this.janaadharMemberDetails.nameEng;
      this.request.StudentNameHindi = this.janaadharMemberDetails.nameHnd;
      this.request.FatherName = this.janaadharMemberDetails.fnameEng;
      this.request.FatherNameHindi = this.janaadharMemberDetails.fnameHnd;
      this.request.MotherName = this.janaadharMemberDetails.mnameEng;
      this.request.MotherNameHindi = this.janaadharMemberDetails.mnameHnd;
      this.request.Gender = this.janaadharMemberDetails.gender;
      this.request.MobileNumber = this.janaadharMemberDetails.mobile;
      this.request.JanAadharMemberID = this.janaadharMemberDetails.janmemid;
      this.request.JanAadharNo = this.janaadharMemberDetails.janaadhaarId;
      var result = this.CategoryAlist.find((f: any) => f.CasteCategoryName == this.janaadharMemberDetails.category)
      if (result != null || result != undefined) {
        this.request.CategoryA=     result.CasteCategoryID;
      }

      const dateStr = this.janaadharMemberDetails.dob; 
      const [day, month, year] = dateStr.split('/'); 
      const formattedDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0]; 
      this.request.DOB = formattedDate;
    } catch (ex) {
      console.log(ex);
    }
  }

  async GetAllDataTrades() {
    try {
      this.tradeSearchRequest.action = '_getAllData'
      this.loaderService.requestStarted();
      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiTradeListAll = data.Data
        console.log("ItiTradeListAll",this.ItiTradeListAll)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 4000);
    }
  }

  async GetPHTrades() {
    try {
      this.tradeSearchRequest.action = '_getPHTrades'
      this.loaderService.requestStarted();
      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiPHTradeList = data.Data
        console.log("ItiPHTradeList",this.ItiPHTradeList)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 4000);
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

  async SetDepartmentID()
  {
  }

  noNumbersAllowed(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    // Allow everything except number keys (48–57 are '0' to '9')
    if (charCode >= 48 && charCode <= 57) {
      event.preventDefault(); // stop the number from being entered
      return false;
    }

    return true;
  }

  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }


}
