  import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDatamodel, BterSearchmodel } from '../../../Models/ApplicationFormDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DataServiceService } from '../../../Services/DataService/data-service.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { BterApplicationForm } from '../../../Services/BterApplicationForm/bterApplication.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TspAreasService } from '../../../Services/Tsp-Areas/Tsp-Areas.service';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ItiReportDataModel, ItiSanctionOrderList } from '../../../Models/ITI/ItiReportDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ITIsService } from '../../../Services/ITIs/itis.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { ITICollegeProfileService } from '../../../Services/ITI-College-Profile/iticollege-profile.service';
import { HiringRoleMasterService } from '../../../Services/HiringRoleMaster/hiring-role-master.service';
@Component({
  selector: 'app-iti-college-report',
  standalone: false,
  templateUrl: './iti-college-report.component.html',
  styleUrl: './iti-college-report.component.css'
})
export class ItiCollegeReportComponent {
  public isAddrequest: boolean = false
  public isAddrequest1: boolean = false
  public ReportForm!: FormGroup
  public BasicReportForm!: FormGroup
  public NewReportFormGroup!: FormGroup
  public AddReportFormGroup1!: FormGroup
  public _enumRole = EnumRole
  public CompanyMasterDDLList: any[] = [];
  public DivisionMasterList: any[] = [];
  public DISCOM: any[] = [];
  public ItiDDLlist: any[] = [];
  public InstituteCategoryList: any[] = [];
  minDate: string = '';
  public ParliamentMaster: any[] = [];
  public AssemblyMaster: any[] = [];
  public PanchayatSamitiList: any[] = [];
  public SubDivisionMasterList: any[] = [];
  public ResidenceList: any[] = [];
  public DocumentPlanList: any[] = [];
  public filterplanorderList: any[] = [];
  public filterbuildorderList: any[] = [];
  public TehsilMasterList: any[] = [];
  public DistrictMasterList1: any[] = [];
  public searchRequest = new ItiSanctionOrderList();
  public VillageList: any[] = [];
  public GramPanchayatList: any[] = [];
  public BoardList: any = []
  public request = new ItiReportDataModel()
  public PostSanctionList: any[] = []
  public TradeSanctionList: any[] = []
  public MetpSanctionList: any[] = []
  /*  public addrequest = new SupplementaryDataModel()*/
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public errorMessage = '';
  public HrMasterFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public stateMasterDDL: any = []
  public PassingYearList: any = []
  public maritialList: any = []
  public TypeID:number=0
  public OrderList: any = []
  public CategoryBlist: any = []
  public CategoryAlist: any = []
  public CategoryDlist: any = []
  public CityMasterDDLList: any = []
  public isSupplement: boolean = false
  public NationalityList: any = []
  public ReligionList: any = []
  public category_CList: any = []
  public category_PreList: any = []
  public ApplicationID: number = 0;
  public searchrequest = new BterSearchmodel()
  public GenderList: any = ''
  public ParentID: number = 0
  @ViewChild('otpModal') childComponent!: OTPModalComponent;


  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private ApplicationService: ITIsService,
    private ApplicationService1: ITICollegeProfileService,
    private toastr: ToastrService,
    private dataService: DataServiceService,
    private activatedRoute: ActivatedRoute,
    private appsettingConfig: AppsettingService,
    private swat: SweetAlert2,
    private routers: Router,
    private ScholarshipService: HiringRoleMasterService,
  ) { }





  async ngOnInit() {
    // form group
    this.ReportForm = this.formBuilder.group(
      {
        txtName: [''],
        LandMark: [''],
        AreaLocalitySector: [''],
        StreetRoadLane: [''],
        PlotHouseBuildingNo: ['', Validators.required],
        Loksabha: ['', Validators.required],
        LandAvailable: ['', Validators.required],
        Vidhansabha: ['', Validators.required],
        PanchayatDis: ['', Validators.required],
        ItiCode: ['', Validators.required],
       /* MISCode: ['', Validators.required],*/
        //SanctionOrderNo: ['', Validators.required],
        //SanctionOrderDate: ['', Validators.required],
        //TradeOrderNo: ['', Validators.required],
        //TradeOrderDate: ['', Validators.required],
        PrincipleName: ['', Validators.required],
        PrincipleMobile: ['', Validators.required],
        PrincipleEmailID: ['', Validators.required],
        ApproachRoad: ['', Validators.required],
        InternalRoad: ['', Validators.required],
        Harvesting: ['', Validators.required],
        ElectPhase: ['', Validators.required],
        IsSolarPanel: ['', Validators.required],
        IsBoundaryWall: ['', Validators.required],
        WaterSupply: ['', Validators.required],
        ElectConnection: ['', Validators.required],
        PanelCapacity: ['', Validators.required],
        HostelUtilized: ['', Validators.required],
        NoOfTree: ['', Validators.required],
        ElectPhaserequired: ['', Validators.required],
        LandTypeID: ['', Validators.required],
        LandAddress: [''],
        Pincode: ['', Validators.required],

        ContractLoad: [''],
        CollegePlace: [''],
        BuildShortage: [''],
        IsHostel: ['', Validators.required],
        txtYear: ['', [Validators.required]],
        PanchayatId: ['', [DropdownValidators]],
        AnnoucementType: ['', [DropdownValidators]],
        DivisionID: ['', [DropdownValidators]],
        DistrictID: ['', [DropdownValidators]],
        SubDivisionID: ['', [DropdownValidators]],
        TehsilID: ['', [DropdownValidators]],
        UrbanRural: ['', [DropdownValidators]],
        GramPanchayatSamiti: ['', [DropdownValidators]],
        VillageID: ['', [DropdownValidators]],
        CityID: ['', [DropdownValidators]],
        AdministrativeBodyId: ['', [DropdownValidators]],
        Category: ['', [DropdownValidators]],
        Ownership: ['', [DropdownValidators]],
        InstitutionCategoryId: ['', [DropdownValidators]],
        CollegeID: [''],
        Islanddetail: [''],
        IsConstructdetail: [''],
        IsElectricdetail: [''],
        IsDistrictHq:[''],
        //AdministrativeeOrderNo: ['', Validators.required],
        //AdministrativeOrderDate: ['', Validators.required],
        FinancialSanction: ['', Validators.required],
        Ward: ['', Validators.required],
        KhasraKhataNo: ['', Validators.required],
        NodalItiCode: ['', Validators.required],
        NodalIti: ['', Validators.required],
        NodalPostAddresss: ['', Validators.required],
        NodalOrderDate: ['', Validators.required],
        NodalOrderNo: ['', Validators.required],
        IsOperatingOwn: ['', Validators.required],
        Remarks: [''],
        PercentCivilWork: ['', Validators.required],
        ConstructionAgency: ['', Validators.required],
        SubDivOffice: ['', Validators.required],
        ContractDemand: [''],
        SanctionLoad: ['', Validators.required],
        ConsumerName: ['', Validators.required],
        ConnectionType: ['', [DropdownValidators]],
        DISCOM: ['', [DropdownValidators]],
        TakenOverDate: ['', Validators.required],
        PDName: ['', Validators.required],
        ContractorName: ['', Validators.required],
        PDMobile: ['', Validators.required],
        ContractorMobile: ['', Validators.required],
        IsDispute: ['', Validators.required],
        //AdministrativeeOrderNo: ['', Validators.required],
        //AdministrativeOrderDate: ['', Validators.required],
        //FinancialSanction: ['', Validators.required],

        PercentCivilDate: ['', Validators.required],
        IsPurposeHall: ['', Validators.required],
        IsMainITI: ['', Validators.required],
        IsBuildingTaken: ['', Validators.required],

        ShilanyasDate: ['', Validators.required],
        LokarpanDate: ['', Validators.required],
        LokarpanName: ['', Validators.required],
        LokarpanPost: ['', Validators.required],
        ShilanyasPost: ['', Validators.required],
        ShilanyasName: ['', Validators.required],
        StartDate: ['', Validators.required],
        CompleteDate: ['', Validators.required],

        //FrontPhoto: [''],
        //SidePhoto: [''],
        //InteriorPhoto: [''],
        //SanctionOrderCopy: [''],
        //TradeCopy: [''],

      });

    this.BasicReportForm = this.formBuilder.group(
      {

        ApproachRoad: ['', Validators.required],
        InternalRoad: ['', Validators.required],
        Harvesting: ['', Validators.required],
        ElectPhase: ['', Validators.required],
        IsSolarPanel: ['', Validators.required],
        IsBoundaryWall: ['', Validators.required],

        ElectConnection: ['', Validators.required],
        PanelCapacity: ['', Validators.required],
        HostelUtilized: ['', Validators.required],
        NoOfTree: ['', Validators.required],
        ElectPhaserequired: ['', Validators.required],

        ContractLoad: [''],
        BuildShortage: [''],
        IsHostel: ['', Validators.required],

        Remarks: [''],



        //FrontPhoto: [''],
        //SidePhoto: [''],
        //InteriorPhoto: [''],
        //SanctionOrderCopy: [''],
        //TradeCopy: [''],

      });


    this.NewReportFormGroup = this.formBuilder.group({
      /*  ConstructionAgency: ['', Validators.required],*/
      PDName: ['', Validators.required],
      ContractorName: ['', Validators.required],
      PDMobile: ['', Validators.required],
      ContractorMobile: ['', Validators.required],
      IsDispute: ['', Validators.required],
      //AdministrativeeOrderNo: ['', Validators.required],
      //AdministrativeOrderDate: ['', Validators.required],
      //FinancialSanction: ['', Validators.required],
      PercentCivilWork: ['', Validators.required],
      PercentCivilDate: ['', Validators.required],
      IsPurposeHall: ['', Validators.required],
      IsMainITI: ['', Validators.required],
      IsBuildingTaken: ['', Validators.required],
      TakenOverDate: ['', Validators.required],
      IsOperatingOwn: [''],
      ShilanyasDate: ['', Validators.required],
      LokarpanDate: ['', Validators.required],
      LokarpanName: ['', Validators.required],
      LokarpanPost: ['', Validators.required],
      ShilanyasPost: ['', Validators.required],
      ShilanyasName: ['', Validators.required],
      StartDate: ['', Validators.required],
      CompleteDate: ['', Validators.required],


    })


    this.AddReportFormGroup1 = this.formBuilder.group({

      FinancialSanction: ['', Validators.required],
      PercentCivilWork: ['', Validators.required],
      PercentCivilDate: ['', Validators.required],
      IsPurposeHall: ['', Validators.required],
      IsMainITI: ['', Validators.required],
      IsBuildingTaken: ['', Validators.required],
      TakenOverDate: ['', Validators.required],
      //IsOperatingOwn: ['', Validators.required],


    })
    const today = new Date();   // ✅ declared here
    this.minDate =
      today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');




    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.searchrequest.SSOID = this.sSOLoginDataModel.SSOID
    //this.searchrequest.DepartmentID = EnumDepartment.BTER;
    //this.request.DepartmentID = EnumDepartment.BTER;
    this.ApplicationID = Number(this.activatedRoute.snapshot.queryParamMap.get('ID')?.toString());
    this.TypeID = Number(this.activatedRoute.snapshot.queryParamMap.get('TypeID')?.toString());
    this.request.IsNewCollege=1


    //await this.loadDropdownData('Board')
    //await this.GetStateMatserDDL()
    //await this.GetPassingYearDDL()

    //this.request.CollegeName = this.sSOLoginDataModel.InstituteName
    //this.request.CollegeID = this.sSOLoginDataModel.InstituteID

    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin) {
      this.resetValidatoresIPA();
    }
    
    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIBuildingAdmin || this.sSOLoginDataModel.RoleID == 260) {
      const controlsToFreeze = [
        'txtName',
        'Loksabha',

        'Vidhansabha',

        'SanctionOrderNo',
        'SanctionOrderDate',

        /*        'PanchayatId',*/
        'CollegeID',
        'txtYear',
        'Category',
        'DivisionID',
        'DistrictID',
        'SubDivisionID',
        'TehsilID',
        //'UrbanRural',
        //'GramPanchayatSamiti',
        //'VillageID',
        //'CityID',
        //'AdministrativeBodyId',
        //'AdministrativeeOrderNo',
        //'AdministrativeOrderDate',
        //'FinancialSanction',
        'ItiCode',
        'AnnoucementType',
        'IsDistrictHq',
        'CollegePlace',
        'InstitutionCategoryId'
        //'MISCode',
        //'ConstructionAgency'


      ];

      controlsToFreeze.forEach(controlName => {
        const control = this.ReportForm.get(controlName);
        if (control) {
          control.disable();  // ❄️ Freeze input
        }
      });

    } else {
      const controlsToUnfreeze = [
        'txtName',
        'Loksabha',

        'Vidhansabha',

        'SanctionOrderNo',
        'SanctionOrderDate',

        /*        'PanchayatId',*/
        'CollegeID',
        'txtYear',
        'Category',
        'DivisionID',
        'DistrictID',
        'SubDivisionID',
        'TehsilID',
        //'UrbanRural',
        //'GramPanchayatSamiti',
        //'VillageID',
        //'CityID',
        //'AdministrativeBodyId',
        //'AdministrativeeOrderNo',
        //'AdministrativeOrderDate',
        'FinancialSanction',
        'ItiCode',
        //'MISCode',
        'ConstructionAgency'
      ];

      controlsToUnfreeze.forEach(controlName => {
        const control = this.NewReportFormGroup.get(controlName);
        if (control) {
          control.enable();  // 🔓 Allow editing
        }
      });
    }

    //if (this.sSOLoginDataModel.RoleID == EnumRole.ITIBuildingAdmin) {
    //  const controlsToFreeze = [
    //    // Existing fields

    //    // Newly added fields
    //    'ConstructionAgency',
    //    'PDName',
    //    'ContractorName',
    //    'PDMobile',
    //    'ContractorMobile',
    //    'IsDispute',
    //    'AdministrativeeOrderNo',
    //    'AdministrativeOrderDate'
    //  ];

    //  controlsToFreeze.forEach(controlName => {
    //    const control = this.NewReportFormGroup.get(controlName);
    //    if (control) {
    //      control.disable(); // ❄️ Freeze input
    //    }
    //  });

    //} else {
    //  const controlsToUnfreeze = [

    //    'ConstructionAgency',
    //    'PDName',
    //    'ContractorName',
    //    'PDMobile',
    //    'ContractorMobile',
    //    'IsDispute',
    //    'AdministrativeeOrderNo',
    //    'AdministrativeOrderDate'
    //  ];

    //  controlsToUnfreeze.forEach(controlName => {
    //    const control = this.NewReportFormGroup.get(controlName);
    //    if (control) {
    //      control.enable(); // 🔓 Allow editing
    //    }
    //  });
    //}


    if (this.sSOLoginDataModel.RoleID == 260) {
      const controlsToFreeze = [
        'NodalOrderDate',
        'NodalOrderNo',
        'NodalPostAddresss',
        'PrincipleEmailID',
        'PrincipleMobile',
        'PrincipleName',
        'NodalIti',
        'NodalItiCode'

        //'MISCode',
        //'ConstructionAgency'


      ];

      controlsToFreeze.forEach(controlName => {
        const control = this.ReportForm.get(controlName);
        if (control) {
          control.disable();  // ❄️ Freeze input
        }
      });
    }



    if (this.TypeID == 1) {
      this.ReportForm.disable()
      this.NewReportFormGroup.disable()
      this.BasicReportForm.disable()
      this.AddReportFormGroup1.disable()
    }


    if (this.sSOLoginDataModel.RoleID == 20 || this.sSOLoginDataModel.RoleID == 43) {
      this.request.CollegeID = this.sSOLoginDataModel.InstituteID
      this.ReportForm.controls['CollegeID'].disable()
      await this.GetCollegeDetails(this.request.CollegeID)

    }


    if (this.ApplicationID > 0) {
      await this.GetById(this.ApplicationID)
      if (this.sSOLoginDataModel.RoleID == 20 && this.TypeID != 1 && this.request.StatusID==1) {

        window.open("/ItiEstablishmentList", "_Self")
      }

    }
     this.request.IsNewCollege=1
    await this.GetGovtITI()
    /*    await this.GetParliamentITI()*/
    await this.GetDivisionMasterList()
    await this.GetLateralCourse()
    await this.GetcOmmonData()
    await this.GetDocumentPlan()
    await this.GetInstituteCategoryList()
    /*    await this.GetOrderList()*/


  }

  get _ReportForm() { return this.ReportForm.controls; }
  get _NewReportForm() { return this.NewReportFormGroup.controls; }
  get AddReportFormGroup() { return this.AddReportFormGroup1.controls; }
  get _BasicReportForm() { return this.BasicReportForm.controls; }



  async GetGovtITI() {
    try {


      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData("GovtIti")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.ItiDDLlist = data['Data'];

          // console.log(this.DivisionMasterList)
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



  async GetOrderList() {
    try {
      debugger
      this.PostSanctionList = []
     

      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData("OrderList", this.ParentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.OrderList = data['Data'];
         
          // console.log(this.DivisionMasterList)
        }, error => console.error(error));

      if (this.ParentID == 1) {

        this.request.OrderType = 2;
      }

        if(this.ParentID == 2) {
        this.request.OrderType = 5;
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


  async GetParliamentITI() {
    try {


      this.loaderService.requestStarted();
      await this.commonMasterService.GetParliamentMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.ParliamentMaster = data['Data'];
          console.log(this.ParliamentMaster)



          // console.log(this.DivisionMasterList)
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




  async GetAssemblyITI(ID: any = 0) {
    try {


      this.loaderService.requestStarted();
      this.commonMasterService.AssemblyMaster_DistrictIDWise(0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.AssemblyMaster = data['Data'];

          this.commonMasterService.PanchayatSamiti(ID)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));

              this.PanchayatSamitiList = data['Data'];

            }
            )
          // console.log(this.DivisionMasterList)
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



  public file!: File;

  async onFilechange(event: any, Type: string) {
    try {

      this.file = event.target.files[0];
      if (this.file) {

        //if (!this.validateFileName(this.file.name))
        //{
        //  this.toastr.error('Invalid file name. Please remove special characters from file');
        //  return;
        //}
        //// Type validation
        if (['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(this.file.type)) {
          // Size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less than 2MB File');
            return;
          }
        }
        else {
          this.toastr.error('Select Only jpeg/jpg/png file');
          return;
        }

        //if (this.file.name.split('.').length > 2)
        //{
        //  this.toastr.error('Invalid file name. Please remove extra . from file');
        //  return ;
        //}



        // Upload to server folder
        this.loaderService.requestStarted();
        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log("photo data", data);
            if (data.State === EnumStatus.Success) {





              switch (Type) {
                case "SanctionOrderCopy":

                  this.request.SanctionOrderCopy = data['Data'][0]["FileName"];

                  break;
                case "TradeCopy":

                  this.request.TradeCopy = data['Data'][0]["FileName"];

                  break;
                case "SidePhoto":

                  this.request.SidePhoto = data['Data'][0]["FileName"];

                  break;
                case "InteriorPhoto":
                  this.request.InteriorPhoto = data['Data'][0]["FileName"];

                  break;
                case "FrontPhoto":
                  this.request.FrontPhoto = data['Data'][0]["FileName"];


                  break;
                case "AdministrativeCopy":
                  this.request.AdministrativeCopy = data['Data'][0]["FileName"];


                  break;
                case "FinancialCopy":
                  this.request.FinancialCopy = data['Data'][0]["FileName"];


                  break;
                case "AllotmentLetter":
                  this.request.AllotmentLetter = data['Data'][0]["FileName"];


                  break;
                case "BuildingPlanCopy":
                  this.request.BuildingPlanCopy = data['Data'][0]["FileName"];


                  break;
                case "DomeViewCopy":
                  this.request.DomeViewCopy = data['Data'][0]["FileName"];

                  break;

                case "MetpCopy":
                  this.request.MetpCopy = data['Data'][0]["FileName"];

                  break;
                case "WorkOrderCopy":
                  this.request.WorkOrderCopy = data['Data'][0]["FileName"];

                  break;
                case "WorkCopy":
                  this.request.WorkCopy = data['Data'][0]["FileName"];

                  break;
                case "WorkSanctionCopy":
                  this.request.WorkSanctionCopy = data['Data'][0]["FileName"];

                  break;
                case "WorkTradeCopy":
                  this.request.WorkTradeCopy = data['Data'][0]["FileName"];

                  break;


                case "WorkFSCopy":
                  this.request.WorkFSCopy = data['Data'][0]["FileName"];

                  break;

                case "LeaseOrderCopy":
                  this.request.LeaseOrderCopy = data['Data'][0]["FileName"];

                  break;
                case "PlanDocument":
                  this.request.PlanDocument = data['Data'][0]["FileName"];

                  break;

                case "PrincipalOrderCopy ":
                  this.request.PrincipalOrderCopy = data['Data'][0]["FileName"];

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
  async SaveData() {


    /*    this.nonItiValidator()*/

    if (this.request.IsNewCollege == 0 && this.request.CollegeID == 0 || this.request.CollegeID == null && this.request.IsNewCollege == 0) {
      this.toastr.warning("Please Select Iti")
      return
    }


    if (this.request.IsNewCollege == 0) {
      this.request.IsDistrictHq = false
      this.request.CollegePlace = ''
    }

    if (this.request.IsDistrictHq == true) {
      this.request.CollegePlace=''
    }

    if (this.request.IsNewCollege == 1 && this.request.CollegePlace == '' && this.request.IsDistrictHq == false) {
      this.toastr.warning("Please Enter Iti Place")
      return
    }




    if (this.request.IsNewCollege == 1 && this.request.CollegeName == '') {
      this.toastr.warning("Please Enter Iti Name")
      return
    }

    if (this.request.IsSolarPanel == 'No') {
      this.request.PanelCapacity = ''
    }
    if (this.request.IsBuildingTaken == 'No') {

      this.request.TakenOverDate = ''
    }

    try {
      debugger
      this.isSubmitted = true;
      //if (this.ReportForm.invalid) {
      //  return
      //}

      //if (this.request.IsNewCollege == 1) {
      //  if (this.NewReportFormGroup.invalid) {

      //    return
      //  }

      //}



      if (this.request.IsNewCollege == 0) {
        this.resetConstructionDetails()
      }
      /*    this.request.OrderDetailsList=[]*/
      /*    this.request.OrderDetailsList.push(...this.TradeSanctionList, ...this.PostSanctionList, ...this.MetpSanctionList)*/


      console.log(this.request)


      this.isLoading = true;

      this.loaderService.requestStarted();

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;

      this.request.RoleID = this.sSOLoginDataModel.RoleID

      if (this.request.CollegeID == null) {
        this.request.CollegeID=0
      }

      //save
      await this.ApplicationService.SaveDataReport(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)


            this.routers.navigate(['/ItiEstablishmentList']);

          }
          else {
            this.toastr.error(this.ErrorMessage)
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




  nonItiValidator() {


    //if (this.request.IsSolarPanel == 'No' || this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin) {

    //  this.ReportForm.controls['PanelCapacity'].clearValidators();
    //}
    //else {
    //  this.ReportForm.controls['PanelCapacity'].setValidators(Validators.required);
    //}

    //this.ReportForm.controls['PanelCapacity'].updateValueAndValidity();

    if (this.sSOLoginDataModel.RoleID != EnumRole.ITIBuildingAdmin && this.sSOLoginDataModel.RoleID != 260) {

    }

    if (this.sSOLoginDataModel.RoleID != EnumRole.ITIBuildingAdmin && this.sSOLoginDataModel.RoleID != 260 && this.sSOLoginDataModel.RoleID != 20) {

      const controlsToClear = [
        //'TradeOrderNo',
        //'TradeOrderDate',
        'ApproachRoad',
        'InternalRoad',
        'Harvesting',
        'ElectPhase',
        'IsSolarPanel',
        'IsBoundaryWall',
        'WaterSupply',
        'ElectConnection',

        'HostelUtilized',
        'NoOfTree',
        'ElectPhaserequired',
        'ContractLoad',

        'IsHostel',
        'PrincipleName',
        'PrincipleMobile',
        'PrincipleEmailID',
        'LandTypeID',
        'LandAvailable',
        'LandAddress',
        'Pincode',
        'PanchayatDis',
        'KhasraKhataNo',
        'Ward',
        'NodalIti',
        'NodalItiCode',
        'NodalPostAddresss',

        'NodalOrderNo',
        'NodalOrderDate',
        //'Ownership',
        //'UrbanRural',
        //'GramPanchayatSamiti',
        //'VillageID',
        //'CityID',
        //'AdministrativeBodyId',
        'PlotHouseBuildingNo',
        'SubDivOffice',

        'ContractDemand',
        'SanctionLoad',
        'ConsumerName',
        'ConnectionType',
        'ConstructionAgency',
        'FinancialSanction'


      ];

      controlsToClear.forEach(controlName => {
        const control = this.ReportForm.get(controlName);
        if (control) {
          control.clearValidators();
          control.updateValueAndValidity();
        }
      });

    } else {
      // If the user IS ITIBuildingAdmin — reapply required validators
      const requiredControls = [
        'ApproachRoad',
        'InternalRoad',
        'Harvesting',
        'ElectPhase',
        'IsSolarPanel',
        'IsBoundaryWall',
        'WaterSupply',
        'ElectConnection',

        'HostelUtilized',
        'NoOfTree',
        'ElectPhaserequired',
        'ContractLoad',

        'IsHostel',
         'PrincipleName',
        'PrincipleMobile',
        'PrincipleEmailID',
        'LandTypeID',
        'LandAvailable',
        /*   'LandAddress',*/
        'Pincode',
        'PanchayatDis',
        'Ward',
        'KhasraKhataNo',
        'NodalIti'
        , 'NodalItiCode',
        'NodalPostAddresss',
        'NodalOrderNo',
        'NodalOrderDate',
        //'Ownership',
        //'UrbanRural',
        //'GramPanchayatSamiti',
        //'VillageID',
        //'CityID',
        ,
        'PlotHouseBuildingNo',
        'SubDivOffice',

        'ContractDemand',
        'SanctionLoad',
        'ConsumerName',
          'ConstructionAgency',
        'FinancialSanction'



      ];

      requiredControls.forEach((controlName: any) => {
        const control = this.ReportForm.get(controlName);
        if (control) {
          control.setValidators(Validators.required);
          control.updateValueAndValidity();
        }
      });
    }

    if (this.sSOLoginDataModel.RoleID != EnumRole.ITIBuildingAdmin && this.sSOLoginDataModel.RoleID != 260 && this.sSOLoginDataModel.RoleID != 20) {

      const controlsToClear = [
        //'TradeOrderNo',
        //'TradeOrderDate',


        'Ownership',
        'UrbanRural',
        'GramPanchayatSamiti',
        'VillageID',
        'CityID',
        'AdministrativeBodyId',
        'ConnectionType',
        'DISCOM'


      ];

      controlsToClear.forEach(controlName => {
        const control = this.ReportForm.get(controlName);
        if (control) {
          control.clearValidators();
          control.updateValueAndValidity();
        }
      });

    } else {
      // If the user IS ITIBuildingAdmin — reapply required validators
      const requiredControls = [


        'Ownership',
        'UrbanRural',
        'GramPanchayatSamiti',
        'VillageID',
        'CityID',
        'AdministrativeBodyId',

        'ConnectionType',
        'DISCOM'

      ];

      requiredControls.forEach(controlName => {
        const control = this.ReportForm.get(controlName);
        if (control) {
          control.setValidators([DropdownValidators]);
          control.updateValueAndValidity();
        }
      });
    }




    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin || this.request.IsNewCollege == 0) {

      const controlsToClear = [
        'ShilanyasDate',
        'LokarpanDate',
        'LokarpanName',
        'LokarpanPost',
        'ShilanyasPost',
        'ShilanyasName',
        'IsOperatingOwn',
        /*   'ConstructionAgency',*/
        'PDName',
        'ContractorName',
        'PDMobile',
        'ContractorMobile',
        'IsDispute',
        'PercentCivilWork',
        'PercentCivilDate',
        'IsPurposeHall',
        'IsMainITI',
        'IsBuildingTaken',
        'TakenOverDate',
        'CompleteDate',
        'StartDate'

      ];



      controlsToClear.forEach(controlName => {
        const control = this.ReportForm.get(controlName);
        if (control) {
          control.clearValidators();
          control.updateValueAndValidity();
        }
      });

    } else {

      const requiredControls = [
        'ShilanyasDate',
        'LokarpanDate',
        'LokarpanName',
        'LokarpanPost',
        'ShilanyasPost',
        'ShilanyasName',
        'IsOperatingOwn',
        /*  'ConstructionAgency',*/
        'PDName',
        'ContractorName',
        'PDMobile',
        'ContractorMobile',
        'IsDispute',
        'PercentCivilWork',
        'PercentCivilDate',
        'IsPurposeHall',
        'IsMainITI',
        'IsBuildingTaken',
        'TakenOverDate',
        'CompleteDate',
        'StartDate'
      ];

      requiredControls.forEach(controlName => {
        const control = this.ReportForm.get(controlName);
        if (control) {
          control.setValidators(Validators.required);
          control.updateValueAndValidity();
        }
      });
    }

    if (this.request.UrbanRural == 76) {
      this.ReportForm.controls['CityID'].clearValidators();
      this.ReportForm.controls['AdministrativeBodyId'].clearValidators();
      this.ReportForm.controls['VillageID'].setValidators([DropdownValidators]);
      this.ReportForm.controls['GramPanchayatSamiti'].setValidators([DropdownValidators]);
      this.ReportForm.controls['PanchayatId'].setValidators([DropdownValidators]);

    } else {
      this.ReportForm.controls['CityID'].setValidators([DropdownValidators]);
      this.ReportForm.controls['AdministrativeBodyId'].setValidators([DropdownValidators]);
      this.ReportForm.controls['VillageID'].clearValidators();
      this.ReportForm.controls['GramPanchayatSamiti'].clearValidators();
      this.ReportForm.controls['PanchayatId'].clearValidators();

    }

    if (this.request.UrbanRural == 0 || this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin) {
      this.ReportForm.controls['VillageID'].clearValidators();
      this.ReportForm.controls['GramPanchayatSamiti'].clearValidators();
      this.ReportForm.controls['PanchayatId'].clearValidators();
      this.ReportForm.controls['CityID'].clearValidators();
      this.ReportForm.controls['AdministrativeBodyId'].clearValidators();
    }


    this.ReportForm.controls['CityID'].updateValueAndValidity();
    this.ReportForm.controls['AdministrativeBodyId'].updateValueAndValidity();
    this.ReportForm.controls['VillageID'].updateValueAndValidity();
    this.ReportForm.controls['GramPanchayatSamiti'].updateValueAndValidity();
    this.ReportForm.controls['PanchayatId'].updateValueAndValidity();


    this.onIslandDetailChange()

  }
  normalizeDate(value: any): string {
    if (!value) return '';

    const str = String(value).split('T')[0];

    if (str === '1900-01-01' || str === '0001-01-01') {
      return '';
    }

    return str;
  }


  async GetById(ID: number) {
    try {
      this.loaderService.requestStarted();

      const response: any = await this.ApplicationService.Get_ITIsReportData_ByID(ID);
      const parsedData = JSON.parse(JSON.stringify(response));

      if (parsedData?.Data) {
        this.request = parsedData.Data;
      } else {
        return;
      }

      const dateFields: (keyof ItiReportDataModel)[] = [
        'SanctionOrderDate',
        'TradeOrderDate',
        'AdministrativeOrderDate',
        'PercentCivilDate',
        'TakenOverDate',
        'ShilanyasDate',
        'LokarpanDate',
        'StartDate',
        'CompleteDate'
      ];

      dateFields.forEach((field) => {
        (this.request as any)[field] = this.normalizeDate((this.request as any)[field]);
      });

      console.log(this.request.WorkCopy);

      await this.ddlDivision_Change();
      await this.ddlDistrict_Change();
      await this.GetAssemblyITI();
      await this.GetGramPanchayatSamiti();
      await this.villageMaster();
     
      this.ReportForm.get('GramPanchayatSamiti')?.setValue(parsedData.Data['GramPanchayatSamiti']);
      this.ReportForm.get('DivisionID')?.setValue(parsedData.Data['DivisionID']);
      this.ReportForm.get('DistrictID')?.setValue(parsedData.Data['DistrictID']);
      this.ReportForm.get('SubDivisionID')?.setValue(parsedData.Data['SubDivisionID']);
      this.ReportForm.get('Loksabha')?.setValue(parsedData.Data['Loksabha']);
      this.ReportForm.get('Vidhansabha')?.setValue(parsedData.Data['Vidhansabha']);
      this.ReportForm.get('TehsilID')?.setValue(parsedData.Data['TehsilID']);
      this.ReportForm.get('CityID')?.setValue(parsedData.Data['CityID']);
      this.ReportForm.get('VillageID')?.setValue(parsedData.Data['VillageID']);
      this.ReportForm.get('AdministrativeBodyId')?.setValue(parsedData.Data['AdministrativeBodyId']);
      this.ReportForm.get('UrbanRural')?.setValue(parsedData.Data['UrbanRural']);
      this.ReportForm.get('Pincode')?.setValue(parsedData.Data['Pincode']);

      setTimeout(() => {
        this.ReportForm.get('PanchayatId')?.setValue(parsedData.Data['PanchayatId']);
        this.request.PanchayatId = parsedData.Data['PanchayatId'];
      }, 300);

      this.filterplanorderList = this.request.OrderDetailsList?.filter((e: any) => e.TypeID == 1) || [];
      this.filterbuildorderList = this.request.OrderDetailsList?.filter((e: any) => e.TypeID == 2) || [];

      console.log(parsedData);
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 4000);
    }
  }

  //normalizeDate(value: any): string {
  //  if (value === null || value === undefined || value === '') {
  //    return '';
  //  }

  //  const str = String(value).split('T')[0];

  //  if (str === '1900-01-01' || str === '0001-01-01') {
  //    return '';
  //  }

  //  const rawDate = new Date(str);
  //  if (isNaN(rawDate.getTime())) {
  //    return '';
  //  }

  //  const year = rawDate.getFullYear();
  //  const month = String(rawDate.getMonth() + 1).padStart(2, '0');
  //  const day = String(rawDate.getDate()).padStart(2, '0');

  //  return `${year}-${month}-${day}`;
  //}


  //async GetById(ID: number) {
  //  try {
  //    this.loaderService.requestStarted();
  //    const data: any = await this.ApplicationService.Get_ITIsReportData_ByID(ID);
  //    const parsedData = JSON.parse(JSON.stringify(data));
  //    debugger
  //    if (parsedData['Data'] != null) {
  //      this.request = parsedData['Data'];
  //    }
  //    const defaultModel = new ItiReportDataModel();

  //    if (this.request.StartDate == '1900-01-01' || this.request.StartDate == null || this.request.StartDate == undefined) {
  //      this.request.StartDate = this.fixDate(data.StartDate);
  //    }

    
  //    this.request.CompleteDate = this.fixDate(data.CompleteDate);
  //    this.request.ShilanyasDate = this.fixDate(data.ShilanyasDate);
  //    this.request.LokarpanDate = this.fixDate(data.LokarpanDate);
  //    this.request.PercentCivilDate = this.fixDate(data.PercentCivilDate);
  //    this.request.TakenOverDate = this.fixDate(data.TakenOverDate);

  //    //Object.keys(defaultModel).forEach((key) => {
  //    //  const value = this.request[key as keyof ItiReportDataModel];

  //    //  if (value == null || value == undefined) {
  //    //    if (typeof (defaultModel as any)[key] === 'number') {
  //    //      (this.request as any)[key] = 0;
  //    //    } else {
  //    //      (this.request as any)[key] = '';
  //    //    }
  //    //  }
  //    //});
  //    console.log(this.request.WorkCopy)
  //    //});
  //    //if (data['Data']['CollegeName'] == null) {
  //    //  this.request.CollegeName=''
  //    //}
  //    // Optional: override with login data
  //    /*     this.request.CollegeName = this.sSOLoginDataModel.InstituteName;*/

  //    // Format specific date fields
  //    const dateFields: (keyof ItiReportDataModel)[] = [
  //      'SanctionOrderDate', 'TradeOrderDate', 'AdministrativeOrderDate',
  //      'PercentCivilDate', 'TakenOverDate', 'ShilanyasDate', 'LokarpanDate',
  //      'StartDate', 'CompleteDate'
  //    ];

  //    dateFields.forEach((field) => {
  //      const value = this.request[field];

  //      // ✅ Skip null / empty / invalid
  //      if (!value) {
  //        (this.request as any)[field] = '';
  //        return;
  //      }

  //      const rawDate = new Date(value as string);

  //      // ✅ Check invalid date
  //      if (isNaN(rawDate.getTime())) {
  //        (this.request as any)[field] = '';
  //        return;
  //      }

  //      const year = rawDate.getFullYear();
  //      const month = String(rawDate.getMonth() + 1).padStart(2, '0');
  //      const day = String(rawDate.getDate()).padStart(2, '0');

  //      (this.request as any)[field] = `${year}-${month}-${day}`;
  //    });


  //    await this.ddlDivision_Change()
  //    await this.ddlDistrict_Change()
  //    await this.GetAssemblyITI()
  //    await this.GetGramPanchayatSamiti()
  //    await this.villageMaster()


  //    this.ReportForm.get('GramPanchayatSamiti')?.setValue(parsedData['Data']["GramPanchayatSamiti"]);
  //    this.ReportForm.get('DivisionID')?.setValue(parsedData['Data']["DivisionID"]);
  //    this.ReportForm.get('DistrictID')?.setValue(parsedData['Data']["DistrictID"]);
  //    this.ReportForm.get('SubDivisionID')?.setValue(parsedData['Data']["SubDivisionID"]);
  //    this.ReportForm.get('Loksabha')?.setValue(parsedData['Data']["Loksabha"]);
  //    this.ReportForm.get('Vidhansabha')?.setValue(parsedData['Data']["Vidhansabha"]);
  //    this.ReportForm.get('TehsilID')?.setValue(parsedData['Data']["TehsilID"]);
  //    this.ReportForm.get('CityID')?.setValue(parsedData['Data']["CityID"]);

  //    this.ReportForm.get('VillageID')?.setValue(parsedData['Data']["VillageID"]);
  //    this.ReportForm.get('AdministrativeBodyId')?.setValue(parsedData['Data']["AdministrativeBodyId"]);
  //    this.ReportForm.get('UrbanRural')?.setValue(parsedData['Data']["UrbanRural"]);
  //    this.ReportForm.get('Pincode')?.setValue(parsedData['Data']["Pincode"]);
  //    /*  this.TradeSanctionList = this.request.OrderDetailsList.filter((e: any) => e.OrderType == 2)*/
  //    /*  this.PostSanctionList = this.request.OrderDetailsList*/
  //    setTimeout(() => {
  //      this.ReportForm.get('PanchayatId')?.setValue(parsedData['Data']["PanchayatId"]);
  //      this.request.PanchayatId = parsedData['Data']['PanchayatId'];
  //    }, 300);

  //    this.filterplanorderList = this.request.OrderDetailsList.filter((e: any) => e.TypeID == 1)||[]
  //    this.filterbuildorderList = this.request.OrderDetailsList.filter((e: any) => e.TypeID == 2)||[]
  //    /*      this.MetpSanctionList = this.request.OrderDetailsList.filter((e: any) => e.OrderType == 3)*/
  //    console.log(parsedData);
  //  } catch (ex) {
  //    console.log(ex);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 4000);
  //  }
  //}

  async resetrow() {
    this.isSubmitted = false
    this.request = new ItiReportDataModel()
    this.request.CollegeID = this.sSOLoginDataModel.InstituteID
    this.request.CollegeName = this.sSOLoginDataModel.InstituteName
  }


  numberOnly(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    const inputChar = String.fromCharCode(charCode);

    // Allow control keys (like backspace)
    if (charCode <= 31) return true;

    // Allow digits (0–9)
    if (charCode >= 48 && charCode <= 57) return true;

    // Allow one dot (.)
    if (inputChar === '.') {
      const input = (event.target as HTMLInputElement).value;
      // Only allow one dot
      if (input.indexOf('.') === -1) return true;
    }

    // Disallow everything else
    return false;
  }


  AddChoice() {

    this.isAddrequest = true;

    debugger
    if (this.request.IsBuildingTaken != 'Yes') {
      this.AddReportFormGroup1.controls['TakenOverDate'].clearValidators();
    } else {
      this.AddReportFormGroup1.controls['TakenOverDate'].setValidators(Validators.required);
    }

    this.AddReportFormGroup1.controls['TakenOverDate'].updateValueAndValidity();



    if (this.AddReportFormGroup1.invalid) {
      /*this.OptionsFormGroup.markAllAsTouched();*/
      return;
    }


    // Get the selected values





    if (!this.request.FinancialSanctionList) {
      this.request.FinancialSanctionList = [];
    }

    if (this.request.FinancialCopy == '') {
      this.toastr.error("Please Upload File")
      return
    }

    //if (this.request.PostID != 7 && this.request.PostID != 8) {
    //  const Exist = this.request.ItirequestsModel.find((e) => e.PostID == this.request.PostID)
    //  if (Exist) {
    //    this.toastr.warning("Already Have request with selected Post ID")
    //    return
    //  }
    //}
    if (Number(this.request.PercentCivilWork) > 100) {
      this.toastr.warning("Percentage of Work cannot be more than 100 %")
      return
    }

    this.request.FinancialSanctionList.push({
      FinancialSanction: this.request.FinancialSanction,
      FinancialCopy: this.request.FinancialCopy,
      PercentCivilWork: this.request.PercentCivilWork,
      IsPurposeHall: this.request.IsPurposeHall,
      IsMainITI: this.request.IsMainITI,
      IsBuildingTaken: this.request.IsBuildingTaken,
      TakenOverDate: this.request.TakenOverDate,
      CollegeID: this.request.CollegeID || 0,
      IsOperatingOwn: ''
    });


    this.request.FinancialSanction = '';
    this.request.FinancialCopy = '';
    this.request.PercentCivilWork = '';
    this.request.IsPurposeHall = '';
    this.request.IsMainITI = '';
    this.request.IsBuildingTaken = '';
    this.request.TakenOverDate = '';



    // Reset other unrelated fields (if required)


    this.isAddrequest = false

  }


  deleteRow(index: number): void {
    this.request.FinancialSanctionList.splice(index, 1);
  }


  async openOTP() {
    debugger

    this.nonItiValidator()

    if (this.request.IsSolarPanel == 'No' || this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin) {

      this.ReportForm.controls['PanelCapacity'].clearValidators();
    }
    else {
      this.ReportForm.controls['PanelCapacity'].setValidators(Validators.required);
    }

    this.ReportForm.controls['PanelCapacity'].updateValueAndValidity();


    if (this.request.ElectPhase == 'No' || this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin) {

      this.ReportForm.controls['ElectPhaserequired'].clearValidators();
    }
    else {
      this.ReportForm.controls['ElectPhaserequired'].setValidators(Validators.required);
    }

    this.ReportForm.controls['ElectPhaserequired'].updateValueAndValidity();


    if (this.request.IsHostel == 'No' || this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin) {

      this.ReportForm.controls['HostelUtilized'].clearValidators();
    }
    else {
      this.ReportForm.controls['HostelUtilized'].setValidators(Validators.required);
    }

    this.ReportForm.controls['HostelUtilized'].updateValueAndValidity();




    if (this.request.IsBuildingTaken != 'Yes' || this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin) {
      this.ReportForm.controls['TakenOverDate'].clearValidators();
    } else {
      this.ReportForm.controls['TakenOverDate'].setValidators(Validators.required);
    }

    this.ReportForm.controls['TakenOverDate'].updateValueAndValidity();

 
    this.ReportForm.controls['AdministrativeBodyId'].clearValidators();
    this.ReportForm.controls['AdministrativeBodyId'].updateValueAndValidity();
    this.isSubmitted = true;

    this.onConstructDetailChange()


    this.onElectricDetailChange()
    this.onIslandDetailChange()

    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin || this.request.IsNewCollege == 0 || this.request.IsConstructdetail == false) {

      const controlsToClear = [
        'ShilanyasDate',
        'LokarpanDate',
        'LokarpanName',
        'LokarpanPost',
        'ShilanyasPost',
        'ShilanyasName',
        'IsOperatingOwn',
        /*   'ConstructionAgency',*/
        'PDName',
        'ContractorName',
        'PDMobile',
        'ContractorMobile',
        'IsDispute',
        'PercentCivilWork',
        'PercentCivilDate',
        'IsPurposeHall',
        'IsMainITI',
        'IsBuildingTaken',
        'TakenOverDate',
        'CompleteDate',
        'StartDate'

      ];



      controlsToClear.forEach(controlName => {
        const control = this.ReportForm.get(controlName);
        if (control) {
          control.clearValidators();
          control.updateValueAndValidity();
        }
      });

    } else {

      const requiredControls = [
        'ShilanyasDate',
        'LokarpanDate',
        'LokarpanName',
        'LokarpanPost',
        'ShilanyasPost',
        'ShilanyasName',
        'IsOperatingOwn',
        /*  'ConstructionAgency',*/
        'PDName',
        'ContractorName',
        'PDMobile',
        'ContractorMobile',
        'IsDispute',
        'PercentCivilWork',
        'PercentCivilDate',
        'IsPurposeHall',
        'IsMainITI',
        'IsBuildingTaken',
        'TakenOverDate',
        'CompleteDate',
        'StartDate'
      ];

      requiredControls.forEach(controlName => {
        const control = this.ReportForm.get(controlName);
        if (control) {
          control.setValidators(Validators.required);
          control.updateValueAndValidity();
        }
      });
    }

    this.applyRoleBasedValidation()





    Object.keys(this.ReportForm.controls).forEach(key => {
      const control = this.ReportForm.get(key);

      if (control && control.invalid) {
        this.toastr.error(`Control ${key} is invalid`);
        Object.keys(control.errors!).forEach(errorKey => {
          this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
        });
      }
    });



  

    if (this.ReportForm.invalid) {
      return
    }

    //if (this.request.IsNewCollege == 1) {
    //  if (this.NewReportFormGroup.invalid) {

    //    return
    //  }

    //}

    //if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin) {
    //  if (this.request.SanctionOrderCopy == '') {
    //    this.toastr.warning("Please Upload Sanction Copy")
    //    return
    //  }
    //  if (this.request.IsNewCollege == 1 && this.request.AdministrativeCopy == '') {
    //    this.toastr.warning("Please Upload Administrative Copy")
    //  }

    //}





    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIBuildingAdmin && this.request.PrincipalOrderCopy == ''
      || this.sSOLoginDataModel.RoleID == 260 && this.request.PrincipalOrderCopy == '') {

      this.toastr.warning("Please Add Nodal Officer Order Copy")
      return
    }
    if (this.sSOLoginDataModel.RoleID == 260 && this.request.IsConstructdetail==true) {
      if (this.request.InteriorPhoto == '') {
        this.toastr.warning("Please Upload Photo of Interior View of Main Campus")
        return
      }

      if (this.request.SidePhoto == '') {
        this.toastr.warning("Please Upload Photo of Side View of Main Campus")
        return
      }
      if (this.request.FrontPhoto == '') {
        this.toastr.warning("Please Upload Photo of Front View of Main Campus")
        return
      }

      //if (this.request.TradeCopy == '') {
      //  this.toastr.warning("Please Upload A.s Of Trade Santion Order Copy")
      //  return
      //}


      //if (this.request.IsNewCollege == 1 && this.request.AllotmentLetter == '' && this.request.IsOperatingOwn == 'Yes') {
      //  this.toastr.warning("Please Upload Allotment Letter Copy")
      //  return
      //}

      if (this.request.IsNewCollege == 1 && this.request.BuildingPlanCopy == '' && this.request.IsOperatingOwn == 'Yes') {
        this.toastr.warning("Please Upload Building Plan Copy")
        return
      }

      //if (this.request.IsNewCollege == 1 && this.request.DomeViewCopy == '') {
      //  this.toastr.warning("Please Upload  Front Dome View Copy")
      //}

    }

    if (this.request.IsNewCollege == 0 && this.request.CollegeID == 0) {
      this.toastr.warning("Please Select Iti")
      return
    }


    if (this.request.IsNewCollege == 1 && this.request.CollegeName == '') {
      this.toastr.warning("Please Enter Iti Name")
      return
    }

    if (this.request.IsSolarPanel == 'No') {
      this.request.PanelCapacity = ''
    }
    if (this.request.IsBuildingTaken == 'No') {

      this.request.TakenOverDate = ''
    }




    //  if (this.request.IsNewCollege == 1) {
    //    if (this.NewReportFormGroup.invalid) {

    //      return
    //    }

    //}



    //if (this.request.FinancialCopy == '') {
    //  this.toastr.warning("Please Add Financial Sanction Order Copy")
    //  return
    //}
    //if (this.request.AdministrativeCopy == '') {
    //  this.toastr.warning("Please Add Administrative Order Copy")
    //  return
    //}

    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin && this.filterplanorderList.length < 1
      || this.sSOLoginDataModel.RoleID == 20 && this.filterplanorderList.length < 1
    ) {
      this.toastr.warning("Please Add ITI Planning sanction Details")
      return
    }


    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIBuildingAdmin && this.filterbuildorderList.length < 1
      || this.sSOLoginDataModel.RoleID == 20 && this.filterbuildorderList.length < 1
    ) {
      this.toastr.warning("Please Add ITI Building sanction Details")
      return
    }

    this.request.OrderDetailsList = []
    this.request.OrderDetailsList = [...this.filterbuildorderList, ...this.filterplanorderList]


    //if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin && this.TradeSanctionList.length < 1 ) {
    //    this.toastr.warning("Please Add Trade sanction Details")
    //    return
    //}
    //if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin && this.MetpSanctionList.length < 1) {
    //  this.toastr.warning("Please Add METP sanction Details")
    //  return
    //}

    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    // await for open model
    await this.childComponent.OpenOTPPopup();
    // await OTP verification
    await this.childComponent.waitForVerification();

    // do work
    await this.SaveData();



    //this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    //this.childComponent.OpenOTPPopup();

    //this.childComponent.onVerified.subscribe(() => {
    //  //this.PublishTimeTable();
    //  this.SaveData();
    //})
  }

  onYearInput(event: any) {
    if (event.target.value.length > 4) {
      event.target.value = event.target.value.slice(0, 4);
      this.request.Esttablishment_Year = event.target.value;
    }
  }


  resetConstructionDetails() {
    ///this.request.ConstructionAgency = '';
    this.request.PDName = '';
    this.request.ContractorName = '';
    this.request.PDMobile = '';
    this.request.ContractorMobile = '';
    this.request.IsDispute = '';
    //this.request.FinancialSanction = '';
    //this.request.FinancialCopy = '';
    this.request.PercentCivilWork = '';
    this.request.PercentCivilDate = '';
    this.request.IsPurposeHall = '';
    this.request.IsMainITI = '';
    this.request.IsBuildingTaken = '';
    this.request.TakenOverDate = '';
    this.request.IsOperatingOwn = '';
    this.request.ShilanyasDate = '';
    this.request.LokarpanDate = '';
    this.request.LokarpanName = '';
    this.request.LokarpanPost = '';
    this.request.AllotmentLetter = '';
    this.request.BuildingPlanCopy = '';
    this.request.DomeViewCopy = '';
    this.request.ShilanyasName = '';
    this.request.CollegeName = ''
    this.request.FinancialSanctionList = []
  }

  AddChoice1() {

    this.isAddrequest1 = true;

    debugger
    //if (this.request.IsBuildingTaken != 'Yes') {
    //  this.AddReportFormGroup1.controls['TakenOverDate'].clearValidators();
    //} else {
    //  this.AddReportFormGroup1.controls['TakenOverDate'].setValidators(Validators.required);
    //}

    //this.AddReportFormGroup1.controls['TakenOverDate'].updateValueAndValidity();

    if (this.request.IsSolarPanel == 'No' || this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin) {

      this.BasicReportForm.controls['PanelCapacity'].clearValidators();
    }
    else {
      this.BasicReportForm.controls['PanelCapacity'].setValidators(Validators.required);
    }

    this.BasicReportForm.controls['PanelCapacity'].updateValueAndValidity();


    if (this.request.ElectPhase == 'No' || this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin) {

      this.BasicReportForm.controls['ElectPhaserequired'].clearValidators();
    }
    else {
      this.BasicReportForm.controls['ElectPhaserequired'].setValidators(Validators.required);
    }

    this.BasicReportForm.controls['ElectPhaserequired'].updateValueAndValidity();


    if (this.request.IsHostel == 'No' || this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin) {

      this.BasicReportForm.controls['HostelUtilized'].clearValidators();
    }
    else {
      this.BasicReportForm.controls['HostelUtilized'].setValidators(Validators.required);
    }

    this.BasicReportForm.controls['HostelUtilized'].updateValueAndValidity();


    if (this.BasicReportForm.invalid) {
      /*this.OptionsFormGroup.markAllAsTouched();*/
      return;
    }


    // Get the selected values


    if (this.request.IsHostel == 'No') {
      this.request.HostelUtilized = 'No'
    }


    if (!this.request.BasicDetailsList) {
      this.request.BasicDetailsList = [];
    }


    //if (this.request.PostID != 7 && this.request.PostID != 8) {
    //  const Exist = this.request.ItirequestsModel.find((e) => e.PostID == this.request.PostID)
    //  if (Exist) {
    //    this.toastr.warning("Already Have request with selected Post ID")
    //    return
    //  }
    //}


    this.request.BasicDetailsList.push({

      ApproachRoad: this.request.ApproachRoad,
      InternalRoad: this.request.InternalRoad,
      Harvesting: this.request.Harvesting,
      ElectPhase: this.request.ElectPhase,
      IsSolarPanel: this.request.IsSolarPanel,
      IsBoundaryWall: this.request.IsBoundaryWall,

      ElectConnection: this.request.ElectConnection,
      PanelCapacity: this.request.PanelCapacity,
      HostelUtilized: this.request.HostelUtilized,
      NoOfTree: this.request.NoOfTree,
      ElectPhaserequired: this.request.ElectPhaserequired,

      ContractLoad: this.request.ContractLoad,
      BuildShortage: this.request.BuildShortage,
      IsHostel: this.request.IsHostel,

      Remarks: this.request.Remarks

    });


    this.request.ApproachRoad = '';
    this.request.InternalRoad = '';
    this.request.Harvesting = '';
    this.request.ElectPhase = '';
    this.request.IsSolarPanel = '';
    this.request.IsBoundaryWall = '';
    this.request.ElectConnection = '';
    this.request.PanelCapacity = '';
    this.request.HostelUtilized = '';
    this.request.NoOfTree = '';
    this.request.ElectPhaserequired = '';
    this.request.ContractLoad = '';
    this.request.BuildShortage = '';
    this.request.IsHostel = '';
    this.request.Remarks = '';



    // Reset other unrelated fields (if required)


    this.isAddrequest1 = false

  }


  deleteRow1(index: number): void {
    this.request.BasicDetailsList.splice(index, 1);
  }



  async GetDivisionMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDivisionMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DivisionMasterList = data['Data'];
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


  async ddlDistrict_Change() {

    try {
      this.loaderService.requestStarted();

      let InstituteDistrictID: number = this.request?.DistrictID ?? 0;


      await this.GetParliamentITI()

      await this.GetAssemblyITI(this.request.DistrictID)

      await this.commonMasterService.TehsilMaster_DistrictIDWise(InstituteDistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterList = data['Data'];

        }, error => console.error(error));
      await this.commonMasterService.SubDivisionMaster_DistrictIDWise(InstituteDistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubDivisionMasterList = data['Data'];
          console.log(this.SubDivisionMasterList, "SubDivisionMasterList")
        }, error => console.error(error));

      //await this.commonMasterService.AssemblyMaster_DistrictIDWise(this.request.DistrictId)
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    this.AssemblyMasterList = data['Data'];
      //    console.log(this.AssemblyMasterList, "AssemblyMasterList")
      //  }, error => console.error(error));

      await this.commonMasterService.CityMasterDistrictWise(InstituteDistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CityMasterDDLList = data['Data'];
          console.log(this.CityMasterDDLList, "CityMasterDDLList")
        }, error => console.error(error));

      //await this.commonMasterService.PanchayatSamiti(InstituteDistrictID)
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    this.State = data['State'];
      //    this.Message = data['Message'];
      //    this.ErrorMessage = data['ErrorMessage'];
      //    this.PanchayatSamitiList = data['Data'];

      //  }, error => console.error(error));



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

  fixDate(value: any) {
    if (!value) return '';
    const str = String(value).substring(0, 10);
    return str === '1900-01-01' ? '' : str;
  }
  async GetDocumentPlan() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('DocumentPlan')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ggg');
          this.DocumentPlanList = data['Data'];

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
  async ddlDivision_Change() {
    try {
      debugger
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_DivisionIDWise(this.request.DivisionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList1 = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 2000);
    }
  }

  async changeUrbanRural() {
    this.GetGramPanchayatSamiti()
  }
  async GetGramPanchayatSamiti() {
    try {
      if (this.request.UrbanRural == 75) {
        this.request.GramPanchayatSamiti = 0
        return
      }

      this.loaderService.requestStarted();
      await this.commonMasterService.GramPanchayat(this.request.TehsilID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.GramPanchayatList = data['Data'];

          // console.log(this.DivisionMasterList)
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

  async villageMaster() {
    try {
      if (this.request.UrbanRural == 75) {
        this.request.VillageID = 0
        return
      }

      this.loaderService.requestStarted();
      await this.commonMasterService.villageMaster(this.request.GramPanchayatSamiti)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.VillageList = data['Data'];
          /*     console.log(this.ParliamentMasterList)*/
          // console.log(this.DivisionMasterList)
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


  AddPost() {
    this.isAddrequest1 = true;

    const IsSelect = this.PostSanctionList.filter((e: any) => e.Marked == true);

    if (IsSelect.length == 0) {
      this.toastr.warning("Please Select Any Order First");
      return;
    }

    if (!this.filterplanorderList) {
      this.filterplanorderList = [];
    }

    IsSelect.forEach((item: any) => {
      const exists = this.filterplanorderList.some(
        (x: any) => x.SanctionID === item.SanctionID
      );

      if (!exists) {
        item.TypeID = 1;
        this.filterplanorderList.push(item);
      }
    });
  }


  AddPost2() {
    this.isAddrequest1 = true;

    const IsSelect = this.PostSanctionList.filter((e: any) => e.Marked == true);

    if (IsSelect.length == 0) {
      this.toastr.warning("Please Select Any Order First");
      return;
    }

    if (!this.filterbuildorderList) {
      this.filterbuildorderList = [];
    }

    IsSelect.forEach((item: any) => {
      const exists = this.filterbuildorderList.some(
        (x: any) => x.SanctionID === item.SanctionID
      );

      if (!exists) {
        item.TypeID = 2;
        this.filterbuildorderList.push(item);
      }
    });
  }



  AddTrade() {

    this.isAddrequest1 = true;

    debugger
    //if (this.request.IsBuildingTaken != 'Yes') {
    //  this.AddReportFormGroup1.controls['TakenOverDate'].clearValidators();
    //} else {
    //  this.AddReportFormGroup1.controls['TakenOverDate'].setValidators(Validators.required);
    //}

    //this.AddReportFormGroup1.controls['TakenOverDate'].updateValueAndValidity();




    // Get the selected values


    if (this.request.TradeOrderDate == '') {
      this.toastr.warning("Please Add Order Date")
      return
    }
    if (this.request.TradeOrderNo == '') {
      this.toastr.warning("Please Enter Order No")
      return
    }
    if (this.request.TradeCopy == '') {
      this.toastr.warning("Please Add Order Copy")
      return
    }

    if (!this.TradeSanctionList) {
      this.TradeSanctionList = [];
    }


    //if (this.request.PostID != 7 && this.request.PostID != 8) {
    //  const Exist = this.request.ItirequestsModel.find((e) => e.PostID == this.request.PostID)
    //  if (Exist) {
    //    this.toastr.warning("Already Have request with selected Post ID")
    //    return
    //  }
    //}


    this.TradeSanctionList.push({

      OrderCopy: this.request.TradeCopy,
      OrderDate: this.request.TradeOrderDate,
      OrderNo: this.request.TradeOrderNo,
      OrderType: 2



    });
    /*    this.TradeSanctionList = this.request.OrderDetailsList.filter((e: any) => e.OrderType == 2)*/


    this.request.TradeCopy = '';
    this.request.TradeOrderDate = '';

    this.request.TradeOrderNo = '';
    this.request.OrderType = 0;



    // Reset other unrelated fields (if required)




  }

  AddMetp() {

    this.isAddrequest1 = true;

    debugger
    //if (this.request.IsBuildingTaken != 'Yes') {
    //  this.AddReportFormGroup1.controls['TakenOverDate'].clearValidators();
    //} else {
    //  this.AddReportFormGroup1.controls['TakenOverDate'].setValidators(Validators.required);
    //}

    //this.AddReportFormGroup1.controls['TakenOverDate'].updateValueAndValidity();




    // Get the selected values


    if (this.request.MetpOrderDate == '') {
      this.toastr.warning("Please Add Order Date")
      return
    }
    if (this.request.MetpOrderNo == '') {
      this.toastr.warning("Please Enter Order No")
      return
    }
    if (this.request.MetpCopy == '') {
      this.toastr.warning("Please Add Order Copy")
      return
    }

    if (!this.MetpSanctionList) {
      this.MetpSanctionList = [];
    }


    //if (this.request.PostID != 7 && this.request.PostID != 8) {
    //  const Exist = this.request.ItirequestsModel.find((e) => e.PostID == this.request.PostID)
    //  if (Exist) {
    //    this.toastr.warning("Already Have request with selected Post ID")
    //    return
    //  }
    //}


    this.MetpSanctionList.push({

      OrderCopy: this.request.MetpCopy,
      OrderDate: this.request.MetpOrderDate,
      OrderNo: this.request.MetpOrderNo,
      OrderType: 3


    });
    /*    this.TradeSanctionList = this.request.OrderDetailsList.filter((e: any) => e.OrderType == 2)*/


    this.request.MetpCopy = '';
    this.request.MetpOrderDate = '';

    this.request.MetpOrderNo = '';
    this.request.OrderType = 0;



    // Reset other unrelated fields (if required)




  }



  deletePost(index: any): void {
    debugger
    this.filterplanorderList.splice(index, 1);

  }


  deletePost2(index: any): void {
    debugger
    this.filterbuildorderList.splice(index, 1);

  }

  deleteTrade(index: number): void {
    this.TradeSanctionList.splice(index, 1);

  }
  deleteMetp(index: number): void {
    this.MetpSanctionList.splice(index, 1);

  }

  deleteUpdateWork(index: number): void {
    this.request.UpdateWorkList.splice(index, 1);

  }

  deleteUpdatePlan(index: number): void {
    this.request.OtherDocument.splice(index, 1);

  }

  async GetCollegeDetails(ID: number) {
    try {
      debugger;

      if (this.request.Eid != 0) {
        return
      }

      this.loaderService.requestStarted();
      const data: any = await this.ApplicationService1.GetByID(ID);
      const parsedData = JSON.parse(JSON.stringify(data));



      if (parsedData['Data'] != null) {

        this.request.DivisionID = parsedData['Data']["DivisionId"]
        await this.ddlDivision_Change()
        this.request.DistrictID = parsedData['Data']["DistrictId"]
        await this.ddlDistrict_Change()
        this.request.SubDivisionID = parsedData['Data']["SubDivisionId"]
        this.request.Loksabha = parsedData['Data']["ParliamentId"]
        //await this.GetAssemblyITI(this.request.Loksabha)
        debugger
        this.request.Vidhansabha = parsedData['Data']["AssemblyId"]
        this.request.TehsilID = parsedData['Data']["TehsilId"]
        this.request.CityID = parsedData['Data']["CityID"]
        this.request.PanchayatId = parsedData['Data']["PanchayatsamityId"]
        this.request.VillageID = parsedData['Data']["VillageId"]
        this.request.AdministrativeBodyId = parsedData['Data']["AdministrativeId"]

        this.request.UrbanRural = parsedData['Data']["UrbanRural"]
        this.request.Pincode = parsedData['Data']["Pincode"]
        this.request.Pincode = parsedData['Data']["Pincode"]
        this.request.ItiCode = parsedData['Data']["Code"]
        //this.request.MISCode = parsedData['Data']["DgetCode"]

        this.ReportForm.get('DivisionID')?.setValue(parsedData['Data']["DivisionId"]);
        this.ReportForm.get('DistrictID')?.setValue(parsedData['Data']["DistrictId"]);
        this.ReportForm.get('SubDivisionID')?.setValue(parsedData['Data']["SubDivisionId"]);
        this.ReportForm.get('Loksabha')?.setValue(parsedData['Data']["ParliamentId"]);
        this.ReportForm.get('Vidhansabha')?.setValue(parsedData['Data']["AssemblyId"]);
        this.ReportForm.get('TehsilID')?.setValue(parsedData['Data']["TehsilId"]);
        this.ReportForm.get('CityID')?.setValue(parsedData['Data']["CityID"]);
        this.ReportForm.get('PanchayatId')?.setValue(parsedData['Data']["PanchayatsamityId"]);
        this.ReportForm.get('VillageID')?.setValue(parsedData['Data']["VillageId"]);
        this.ReportForm.get('AdministrativeBodyId')?.setValue(parsedData['Data']["AdministrativeId"]);
        this.ReportForm.get('UrbanRural')?.setValue(parsedData['Data']["UrbanRural"]);
        this.ReportForm.get('Pincode')?.setValue(parsedData['Data']["Pincode"]);

        if (this.request.UrbanRural == 76) {
          await this.GetGramPanchayatSamiti();
        }
        this.request.GramPanchayatSamiti = parsedData['Data']["GrampanchayatId"]
        this.ReportForm.get('GramPanchayatSamiti')?.setValue(parsedData['Data']["GrampanchayatId"]);
      }
      //// Assign default values for null or undefined fields


      //if (this.request.ItiMembersModel.length > 0) {
      //  this.ItiMemberPost()
      //  this.request.ItiMembersModel.forEach((member) => {
      //    

      //       this.member.PostName = this.ItiMemberPostList.filter((x: any) => x.ID == this.member.PostID)[0]['Name'];
      //  });

      //}
      if (this.request.UrbanRural == 76) {


        /*        this.GetGramPanchayatSamiti()*/
        this.villageMaster()
      }

      //});
      //if (data['Data']['CollegeName'] == null) {
      //  this.request.CollegeName=''
      //}
      // Optional: override with login data
      /*     this.request.CollegeName = this.sSOLoginDataModel.InstituteName;*/

      /*    Format specific date fields*/


      console.log(parsedData, "dsw");
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 4000);
    }
  }


  AddUpdateWork() {

    this.isAddrequest1 = true;

    debugger
    //if (this.request.IsBuildingTaken != 'Yes') {
    //  this.AddReportFormGroup1.controls['TakenOverDate'].clearValidators();
    //} else {
    //  this.AddReportFormGroup1.controls['TakenOverDate'].setValidators(Validators.required);
    //}

    //this.AddReportFormGroup1.controls['TakenOverDate'].updateValueAndValidity();




    // Get the selected values


    if (this.request.WorkName == '' || this.request.WorkTradeCopy == '' || this.request.WorkFSCopy == '' || this.request.WorkConstructor == ''
      || this.request.WorkCopy == '' || this.request.UpdateWorkStarted == '' || this.request.UpdateExpectedDate == '' || this.request.WorkSanctionCopy == ''
      || this.request.UpdatePercentWork == ''
    ) {
      this.toastr.warning("Please Fill Required Fields And Upload Valid Documents")
      return
    }


    if (!this.request.UpdateWorkList) {
      this.request.UpdateWorkList = [];
    }


    //if (this.request.PostID != 7 && this.request.PostID != 8) {
    //  const Exist = this.request.ItirequestsModel.find((e) => e.PostID == this.request.PostID)
    //  if (Exist) {
    //    this.toastr.warning("Already Have request with selected Post ID")
    //    return
    //  }
    //}


    this.request.UpdateWorkList.push({

      WorkName: this.request.WorkName,
      WorkTradeCopy: this.request.WorkTradeCopy,
      WorkFSCopy: this.request.WorkFSCopy,
      WorkConstructor: this.request.WorkConstructor,
      WorkCopy: this.request.WorkCopy,
      UpdateWorkStarted: this.request.UpdateWorkStarted,
      UpdateExpectedDate: this.request.UpdateExpectedDate,
      WorkSanctionCopy: this.request.WorkSanctionCopy,
      UpdatePercentWork: this.request.UpdatePercentWork,
      UpdateRemarks: this.request.UpdateRemarks

    });
    /*    this.TradeSanctionList = this.request.OrderDetailsList.filter((e: any) => e.OrderType == 2)*/


    this.request.WorkName = '',
      this.request.WorkTradeCopy = '',
      this.request.WorkFSCopy = ''
    this.request.WorkConstructor = '',
      this.request.WorkCopy = ''
    this.request.UpdateWorkStarted = ''
    this.request.UpdateExpectedDate = ''
    this.request.WorkSanctionCopy = ''
    this.request.UpdatePercentWork = ''
    this.request.UpdateRemarks = ''
  }




  async getExaminerData() {
    this.searchRequest.OrderType = this.request.OrderType
    this.searchRequest.OrderDate = this.request.OrderDate
    this.PostSanctionList = []
    try {
      await this.ScholarshipService.GetsanctionOrderNotAssign(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.PostSanctionList = data.Data;
        console.log("this.PostSanctionList", this.PostSanctionList)
        debugger
        this.PostSanctionList = this.PostSanctionList.filter((item: any) =>

          !this.request.OrderDetailsList.some((order: any) => order.SanctionID === item.SanctionID)
        );
      })
    } catch (error) {
      console.error(error);
    }
  }

  async GetcOmmonData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('DISCOM')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DISCOM = data['Data'];
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

  async resetValidatoresIPA() {
    this.ReportForm.controls['AdministrativeBodyId'].clearValidators();
    this.ReportForm.controls['AdministrativeBodyId'].updateValueAndValidity();
  }



  AddUpdateWork1() {



    debugger
    //if (this.request.IsBuildingTaken != 'Yes') {
    //  this.AddReportFormGroup1.controls['TakenOverDate'].clearValidators();
    //} else {
    //  this.AddReportFormGroup1.controls['TakenOverDate'].setValidators(Validators.required);
    //}

    //this.AddReportFormGroup1.controls['TakenOverDate'].updateValueAndValidity();




    // Get the selected values


    if (this.request.PlanDocID == 0 || this.request.PlanDocument == ''
    ) {
      this.toastr.warning("Please Fill Required Fields And Upload Valid Documents")
      return
    }


    if (!this.request.OtherDocument) {
      this.request.OtherDocument = [];
    }


    //if (this.request.PostID != 7 && this.request.PostID != 8) {
    //  const Exist = this.request.ItirequestsModel.find((e) => e.PostID == this.request.PostID)
    //  if (Exist) {
    //    this.toastr.warning("Already Have request with selected Post ID")
    //    return
    //  }
    //}
    const Name = this.DocumentPlanList.find((e: any) => e.ID == this.request.PlanDocID).Name ?? ''

    this.request.OtherDocument.push({

      OrderCopy: this.request.PlanDocument,
      OrderType: this.request.PlanDocID,
      OrderTypeName: Name


    });
    /*    this.TradeSanctionList = this.request.OrderDetailsList.filter((e: any) => e.OrderType == 2)*/


    this.request.PlanDocument = '',
      this.request.PlanDocID = 0

  }
  async GetPrincipal(event: any) {
    try {
      const code = event.target.value;

      if (!code || code.length < 4) return; // optional debounce condition

      let obj = {
        MasterCode: 'Getprincipalinfo',
        FilterBy: code
      };

      this.loaderService.requestStarted();

      await this.commonMasterService.CommonMasterDataByAction(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.NodalIti = data['Data'][0]['Name'];
          this.request.PrincipleName = data['Data'][0]['Principalname'];
          this.request.PrincipleMobile = data['Data'][0]['MobileNo'];
          this.request.PrincipleEmailID = data['Data'][0]['Email'];
          this.request.PrincipleUserID = data['Data'][0]['UserID'];
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  applyRoleBasedValidation() {
    if (this.sSOLoginDataModel.RoleID == 232) {

      // remove all validators from all controls
      Object.keys(this.ReportForm.controls).forEach(key => {
        const control = this.ReportForm.get(key);
        control?.clearValidators();
        control?.setErrors(null);
        control?.updateValueAndValidity();
      });

      // only these fields remain required
      this.ReportForm.get('NodalIti')?.setValidators([Validators.required]);
      this.ReportForm.get('NodalItiCode')?.setValidators([Validators.required]);
      this.ReportForm.get('PrincipleName')?.setValidators([Validators.required]);
      this.ReportForm.get('PrincipleMobile')?.setValidators([Validators.required]);
      this.ReportForm.get('PrincipleEmailID')?.setValidators([Validators.required]);
      this.ReportForm.get('NodalPostAddresss')?.setValidators([Validators.required]);
      this.ReportForm.get('NodalOrderNo')?.setValidators([Validators.required]);
      this.ReportForm.get('NodalOrderDate')?.setValidators([Validators.required]);

      // update validity again
      [
        'NodalIti',
        'NodalItiCode',
        'PrincipleName',
        'PrincipleMobile',
        'PrincipleEmailID',
        'NodalPostAddresss',
        'NodalOrderNo',
        'NodalOrderDate'
      ].forEach(key => {
        this.ReportForm.get(key)?.updateValueAndValidity();
      });
    }
  }
 async onIslandDetailChange() {

   if (this.request.Islanddetail === false || this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin) {
      this.clearLandValidators();
    } else {
      this.setLandValidators();
    }
  }
  clearLandValidators() {
    const controls = [
      'Ownership',
      'UrbanRural',
      'PanchayatId',
      'GramPanchayatSamiti',
      'VillageID',
      'CityID',
      'AdministrativeBodyId',
      'Ward',
      'KhasraKhataNo',
      'PanchayatDis',
      'PlotHouseBuildingNo',
      'LandTypeID',
      'LandAvailable',
      'Pincode'
    ];

    controls.forEach(control => {
      this.ReportForm.get(control)?.clearValidators();
      this.ReportForm.get(control)?.updateValueAndValidity();
    });
  }

  setLandValidators() {
    this.ReportForm.get('Ownership')?.setValidators([DropdownValidators]);
    this.ReportForm.get('UrbanRural')?.setValidators([DropdownValidators]);
    this.ReportForm.get('Ward')?.setValidators([Validators.required]);
    this.ReportForm.get('KhasraKhataNo')?.setValidators([Validators.required]);
    this.ReportForm.get('PanchayatDis')?.setValidators([Validators.required]);
    this.ReportForm.get('PlotHouseBuildingNo')?.setValidators([Validators.required]);
    this.ReportForm.get('LandTypeID')?.setValidators([Validators.required]);
    this.ReportForm.get('LandAvailable')?.setValidators([Validators.required]);
    this.ReportForm.get('Pincode')?.setValidators([Validators.required]);

    // Add conditional ones if needed (Urban/Rural based)

    this.ReportForm.updateValueAndValidity();
  }


  //resetConstructionFields() {
  //  const controls = [
  //    'IsOperatingOwn',
  //    'PDName',
  //    'PDMobile',
  //    'ContractorName',
  //    'ContractorMobile',
  //    'StartDate',
  //    'CompleteDate',
  //    'PercentCivilWork',
  //    'ApproachRoad',
  //    'InternalRoad',
  //    'IsBoundaryWall',
  //    'BuildShortage',
  //    'WaterSupply',
  //    'Harvesting',
  //    'IsSolarPanel',
  //    'PanelCapacity',
  //    'IsHostel',
  //    'HostelUtilized',
  //    'NoOfTree',
  //    'IsDispute',
  //    'IsPurposeHall',
  //    'IsMainITI',
  //    'IsBuildingTaken',
  //    'LokarpanPost',
  //    'ShilanyasDate',
  //    'ShilanyasName',
  //    'ShilanyasPost',
  //    'LokarpanDate',
  //    'LokarpanName',
  //    'PercentCivilDate',
  //    'TakenOverDate',
  //    'Remarks'
  //  ];

  //  controls.forEach(control => {
  //    this.ReportForm.get(control)?.setValue('');
  //  });
/*  }*/


  onConstructDetailChange() {
    

    if (this.request.IsConstructdetail === false || this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin) {
      this.clearConstructionValidators();
    } else {
      this.setConstructionValidators();
    }
  }
  clearConstructionValidators() {
    const controls = [
      'IsOperatingOwn',
      'PDName',
      'PDMobile',
      'ContractorName',
      'ContractorMobile',
      'StartDate',
      'CompleteDate',
      'PercentCivilWork',
      'ApproachRoad',
      'InternalRoad',
      'IsBoundaryWall',
      'WaterSupply',
      'Harvesting',
      'IsSolarPanel',
      'PanelCapacity',
      'IsHostel',
      'HostelUtilized',
      'NoOfTree',
      'IsDispute',
      'IsPurposeHall',
      'IsMainITI',
      'IsBuildingTaken',
      'LokarpanPost',
      'ShilanyasDate',
      'ShilanyasName',
      'ShilanyasPost',
      'LokarpanDate',
      'LokarpanName',
      'PercentCivilDate',
      'TakenOverDate',
      'Remarks',
      'ConstructionAgency',
      'FinancialSanction'
    ];

    controls.forEach(control => {
      this.ReportForm.get(control)?.clearValidators();
      this.ReportForm.get(control)?.updateValueAndValidity();
    });
  }
  setConstructionValidators() {
    this.ReportForm.get('IsOperatingOwn')?.setValidators([Validators.required]);
    this.ReportForm.get('PDName')?.setValidators([Validators.required]);
    this.ReportForm.get('PDMobile')?.setValidators([Validators.required]);
    this.ReportForm.get('ContractorName')?.setValidators([Validators.required]);
    this.ReportForm.get('ContractorMobile')?.setValidators([Validators.required]);
    this.ReportForm.get('StartDate')?.setValidators([Validators.required]);
    this.ReportForm.get('CompleteDate')?.setValidators([Validators.required]);
    this.ReportForm.get('PercentCivilWork')?.setValidators([Validators.required]);
    this.ReportForm.get('ApproachRoad')?.setValidators([Validators.required]);
    this.ReportForm.get('InternalRoad')?.setValidators([Validators.required]);
    this.ReportForm.get('IsBoundaryWall')?.setValidators([Validators.required]);
    this.ReportForm.get('WaterSupply')?.setValidators([Validators.required]);
    this.ReportForm.get('Harvesting')?.setValidators([Validators.required]);
    this.ReportForm.get('IsSolarPanel')?.setValidators([Validators.required]);
    this.ReportForm.get('IsHostel')?.setValidators([Validators.required]);
    this.ReportForm.get('HostelUtilized')?.setValidators([Validators.required]);
    this.ReportForm.get('NoOfTree')?.setValidators([Validators.required]);
    this.ReportForm.get('IsDispute')?.setValidators([Validators.required]);
    this.ReportForm.get('IsPurposeHall')?.setValidators([Validators.required]);
    this.ReportForm.get('IsMainITI')?.setValidators([Validators.required]);
    this.ReportForm.get('IsBuildingTaken')?.setValidators([Validators.required]);
    this.ReportForm.get('LokarpanPost')?.setValidators([Validators.required]);
    this.ReportForm.get('ShilanyasDate')?.setValidators([Validators.required]);
    this.ReportForm.get('ShilanyasName')?.setValidators([Validators.required]);
    this.ReportForm.get('ShilanyasPost')?.setValidators([Validators.required]);
    this.ReportForm.get('LokarpanDate')?.setValidators([Validators.required]);
    this.ReportForm.get('LokarpanName')?.setValidators([Validators.required]);
    this.ReportForm.get('PercentCivilDate')?.setValidators([Validators.required]);
    this.ReportForm.get('TakenOverDate')?.setValidators([Validators.required]);
    this.ReportForm.get('ConstructionAgency')?.setValidators([Validators.required]);
    this.ReportForm.get('FinancialSanction')?.setValidators([Validators.required]);

    // conditional validator
    if (this.request.IsSolarPanel === 'Yes') {
      this.ReportForm.get('PanelCapacity')?.setValidators([Validators.required]);
    } else {
      this.ReportForm.get('PanelCapacity')?.clearValidators();
    }

    this.ReportForm.get('PanelCapacity')?.updateValueAndValidity();

    Object.keys(this.ReportForm.controls).forEach(key => {
      this.ReportForm.get(key)?.updateValueAndValidity();
    });
  }


  onElectricDetailChange() {
     

    if (this.request.IsElectricdetail === false || this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin) {
      this.clearElectricValidators();
  /*    this.resetElectricFields(); // optional*/
    } else {
      this.setElectricValidators();
    }
  }
  clearElectricValidators() {
    const controls = [
      'ElectPhase',
      'ElectPhaserequired',
      'ContractLoad',
      'ElectConnection',
      'ConsumerName',
      'ConnectionType',
      'SanctionLoad',
      'ContractDemand',
      'DISCOM',
      'SubDivOffice'
    ];

    controls.forEach(control => {
      this.ReportForm.get(control)?.clearValidators();
      this.ReportForm.get(control)?.updateValueAndValidity();
    });
  }
  setElectricValidators() {
    this.ReportForm.get('ElectPhase')?.setValidators([Validators.required]);
    this.ReportForm.get('ElectPhaserequired')?.setValidators([Validators.required]);
    this.ReportForm.get('ContractLoad')?.setValidators([Validators.required]);
    this.ReportForm.get('ElectConnection')?.setValidators([Validators.required]);
    this.ReportForm.get('ConsumerName')?.setValidators([Validators.required]);
    this.ReportForm.get('ConnectionType')?.setValidators([DropdownValidators]);
    this.ReportForm.get('SanctionLoad')?.setValidators([Validators.required]);
    this.ReportForm.get('DISCOM')?.setValidators([DropdownValidators]);
    this.ReportForm.get('SubDivOffice')?.setValidators([Validators.required]);

    // ContractDemand is optional in your HTML, so no required validator

    [
      'ElectPhase',
      'ElectPhaserequired',
      'ContractLoad',
      'ElectConnection',
      'ConsumerName',
      'ConnectionType',
      'SanctionLoad',
      'ContractDemand',
      'DISCOM',
      'SubDivOffice'
    ].forEach(control => {
      this.ReportForm.get(control)?.updateValueAndValidity();
    });
  }

  //resetElectricFields() {
  //  this._ReportForm.get('ElectPhase')?.setValue('');
  //  this._ReportForm.get('ElectPhaserequired')?.setValue('');
  //  this._ReportForm.get('ContractLoad')?.setValue('');
  //  this._ReportForm.get('ElectConnection')?.setValue('');
  //  this._ReportForm.get('ConsumerName')?.setValue('');
  //  this._ReportForm.get('ConnectionType')?.setValue(0);
  //  this._ReportForm.get('SanctionLoad')?.setValue('');
  //  this._ReportForm.get('ContractDemand')?.setValue('');
  //  this._ReportForm.get('DISCOM')?.setValue(0);
  //  this._ReportForm.get('SubDivOffice')?.setValue('');
  //}




  async GetDetails() {
    try {
      let code = this.request.CollegePlace



    


      if (this.request.IsDistrictHq == true) {
        code=''
      }

      let obj = {
        MasterCode: 'Generatecollege',
        FilterBy: code,
        DistrictID: this.request.DistrictID,
        CategoryID: this.request.InstitutionCategoryId
      };

      this.loaderService.requestStarted();

      await this.commonMasterService.CommonMasterDataByAction(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.CollegeName = data['Data'][0]['CollegeName'];
          this.request.ItiCode = data['Data'][0]['NextCode'];
    
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }




  }





