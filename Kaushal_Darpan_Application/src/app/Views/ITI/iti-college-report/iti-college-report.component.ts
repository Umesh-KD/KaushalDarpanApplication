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
import { ItiReportDataModel } from '../../../Models/ITI/ItiReportDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ITIsService } from '../../../Services/ITIs/itis.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
@Component({
  selector: 'app-iti-college-report',
  standalone: false,
  templateUrl: './iti-college-report.component.html',
  styleUrl: './iti-college-report.component.css'
})
export class ItiCollegeReportComponent {
  public isAddrequest: boolean=false
  public isAddrequest1: boolean=false
  public ReportForm!: FormGroup
  public BasicReportForm!: FormGroup
  public NewReportFormGroup!: FormGroup
  public AddReportFormGroup1!: FormGroup
  public _enumRole = EnumRole
  public CompanyMasterDDLList: any[] = [];
  public DivisionMasterList: any[] = [];
  public ItiDDLlist: any[] = [];
  public ParliamentMaster: any[] = [];
  public AssemblyMaster: any[] = [];
  public PanchayatSamitiList: any[] = [];
  public SubDivisionMasterList: any[] = [];
  public ResidenceList: any[] = [];
  public TehsilMasterList: any[] = [];
  public BoardList: any = []
  public request = new ItiReportDataModel()
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
  @ViewChild('otpModal') childComponent!: OTPModalComponent;


  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private ApplicationService: ITIsService,
    private toastr: ToastrService,
    private dataService: DataServiceService,
    private activatedRoute: ActivatedRoute,
    private appsettingConfig: AppsettingService,
    private swat: SweetAlert2,
    private routers: Router
  ) { }





  async ngOnInit() {
    // form group
    this.ReportForm = this.formBuilder.group(
      {
        txtName: [{ value: ''}, Validators.required],
        Loksabha: ['', Validators.required],
        LandAvailable: ['', Validators.required],
        Vidhansabha: ['', Validators.required],
        PanchayatDis: ['', Validators.required],
        SanctionOrderNo: ['', Validators.required],
        SanctionOrderDate: ['', Validators.required],
        TradeOrderNo: ['', Validators.required],
        TradeOrderDate: ['', Validators.required],
        //ApproachRoad: ['', Validators.required],
        //InternalRoad: ['', Validators.required],
        //Harvesting: ['', Validators.required],
        //ElectPhase: ['', Validators.required],
        //IsSolarPanel: ['', Validators.required],
        //IsBoundaryWall: ['', Validators.required],
        WaterSupply: ['', Validators.required],
        //ElectConnection: ['', Validators.required],
        //PanelCapacity: ['', Validators.required],
        //HostelUtilized: ['', Validators.required],
        //NoOfTree: ['', Validators.required],
        //ElectPhaserequired: ['', Validators.required],
        LandTypeID: ['', Validators.required],
        //ContractLoad: [''],
        //BuildShortage: [''],
        //IsHostel: ['', Validators.required],
        txtYear: ['', [DropdownValidators]],
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
        CollegeID: ['',],
      /*  Remarks: [''],*/
     
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
      ConstructionAgency: ['', Validators.required],
      PDName: ['', Validators.required],
      ContractorName: ['', Validators.required],
      PDMobile: ['', Validators.required],
      ContractorMobile: ['', Validators.required],
      IsDispute: ['', Validators.required],
      AdministrativeeOrderNo: ['', Validators.required],
      AdministrativeOrderDate: ['', Validators.required],
      //FinancialSanction: ['', Validators.required],
      //PercentCivilWork: ['', Validators.required],
      //PercentCivilDate: ['', Validators.required],
      //IsPurposeHall: ['', Validators.required],
      //IsMainITI: ['', Validators.required],
      //IsBuildingTaken: ['', Validators.required],
      //TakenOverDate: ['', Validators.required],
      IsOperatingOwn: ['', Validators.required],
      ShilanyasDate: ['', Validators.required],
      LokarpanDate: ['', Validators.required],
      LokarpanName: ['', Validators.required],
      LokarpanPost: ['', Validators.required],
      ShilanyasPost: ['', Validators.required],
      ShilanyasName: ['', Validators.required]
   

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



    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.searchrequest.SSOID = this.sSOLoginDataModel.SSOID
    //this.searchrequest.DepartmentID = EnumDepartment.BTER;
    //this.request.DepartmentID = EnumDepartment.BTER;
    this.ApplicationID = Number(this.activatedRoute.snapshot.queryParamMap.get('ID')?.toString());

    //await this.loadDropdownData('Board')
    //await this.GetStateMatserDDL()
    //await this.GetPassingYearDDL()

    //this.request.CollegeName = this.sSOLoginDataModel.InstituteName
    //this.request.CollegeID = this.sSOLoginDataModel.InstituteID

    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIBuildingAdmin) {
      const controlsToFreeze = [
        'txtName',
        'Loksabha',
        'LandAvailable',
        'Vidhansabha',
        'PanchayatDis',
        'SanctionOrderNo',
        'SanctionOrderDate',
        'LandTypeID',
        'PanchayatId',
        'CollegeID',
        'txtYear'
        
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
        'LandAvailable',
        'Vidhansabha',
        'PanchayatDis',
        'SanctionOrderNo',
        'SanctionOrderDate',
   
        'CollegeID',
        'txtYear'
      ];

      controlsToUnfreeze.forEach(controlName => {
        const control = this.NewReportFormGroup.get(controlName);
        if (control) {
          control.enable();  // 🔓 Allow editing
        }
      });
    }

    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIBuildingAdmin) {
      const controlsToFreeze = [
        // Existing fields

        // Newly added fields
        'ConstructionAgency',
        'PDName',
        'ContractorName',
        'PDMobile',
        'ContractorMobile',
        'IsDispute',
        'AdministrativeeOrderNo',
        'AdministrativeOrderDate'
      ];

      controlsToFreeze.forEach(controlName => {
        const control = this.NewReportFormGroup.get(controlName);
        if (control) {
          control.disable(); // ❄️ Freeze input
        }
      });

    } else {
      const controlsToUnfreeze = [

        'ConstructionAgency',
        'PDName',
        'ContractorName',
        'PDMobile',
        'ContractorMobile',
        'IsDispute',
        'AdministrativeeOrderNo',
        'AdministrativeOrderDate'
      ];

      controlsToUnfreeze.forEach(controlName => {
        const control = this.NewReportFormGroup.get(controlName);
        if (control) {
          control.enable(); // 🔓 Allow editing
        }
      });
    }



   
    if (this.ApplicationID > 0) {
      await this.GetById(this.ApplicationID)
    }
    /*    this.request.IsNewCollege=1*/
    await this.GetGovtITI()
    await this.GetParliamentITI()
    
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




  async GetAssemblyITI(ID:number=0) {
    try {
      

      this.loaderService.requestStarted();
       this.commonMasterService.AssemblyMaster_DistrictIDWise(ID)
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
        // Type validation
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


    this.nonItiValidator()

    if (this.request.IsNewCollege == 0 && this.request.CollegeID == 0) {
      this.toastr.warning("Please Select Iti")
      return
    }


    if (this.request.IsNewCollege == 1 && this.request.CollegeName == '') {
      this.toastr.warning("Please Enter Iti Name")
      return
    }

    if (this.request.IsSolarPanel == 'No')
    {
      this.request.PanelCapacity = ''
    }
    if (this.request.IsBuildingTaken == 'No') {

      this.request.TakenOverDate = ''
    }

    try {
      debugger
      this.isSubmitted = true;
      if (this.ReportForm.invalid) {
        return
      }

      if (this.request.IsNewCollege == 1) {
        if (this.NewReportFormGroup.invalid) {

          return
        }

      }

      if (this.sSOLoginDataModel.RoleID == EnumRole.ITIBuildingAdmin && this.request.FinancialSanctionList.length < 1 && this.request.IsNewCollege == 1) {
        this.toastr.warning("Please Add Financials sanction Details")
        return
      }


      if (this.request.IsNewCollege == 0) {
        this.resetConstructionDetails()
      }

      console.log(this.request)


      this.isLoading = true;

      this.loaderService.requestStarted();

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;

      this.request.RoleID = this.sSOLoginDataModel.RoleID
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

    if (this.sSOLoginDataModel.RoleID != EnumRole.ITIBuildingAdmin) {

    }

    if (this.sSOLoginDataModel.RoleID != EnumRole.ITIBuildingAdmin) {

      const controlsToClear = [
        'TradeOrderNo',
        'TradeOrderDate',
 /*       'ApproachRoad',*/
        //'InternalRoad',
        //'Harvesting',
        //'ElectPhase',
        //'IsSolarPanel',
        //'IsBoundaryWall',
        'WaterSupply',
        //'ElectConnection',
     
        //'HostelUtilized',
        //'NoOfTree',
        //'ElectPhaserequired',
        //'ContractLoad',
        //'BuildShortage',
        //'IsHostel',
    
     
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
        'TradeOrderNo',
        'TradeOrderDate',
        //'ApproachRoad',
        //'InternalRoad',
        //'Harvesting',
        //'ElectPhase',
        //'IsSolarPanel',
        //'IsBoundaryWall',
        'WaterSupply',
        //'ElectConnection',
       
        //'HostelUtilized',
        //'NoOfTree',
        //'ElectPhaserequired',
        //'IsHostel',
     
 
      ];

      requiredControls.forEach(controlName => {
        const control = this.ReportForm.get(controlName);
        if (control) {
          control.setValidators(Validators.required);
          control.updateValueAndValidity();
        }
      });
    }
    if (this.sSOLoginDataModel.RoleID != EnumRole.ITIBuildingAdmin) {

      const controlsToClear = [
        'ShilanyasDate',
        'LokarpanDate',
        'LokarpanName',
        'LokarpanPost',
        'ShilanyasPost',
        'ShilanyasName',
        'IsOperatingOwn'
     
      ];

      controlsToClear.forEach(controlName => {
        const control = this.NewReportFormGroup.get(controlName);
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
    '[IsOperatingOwn'
      ];

      requiredControls.forEach(controlName => {
        const control = this.NewReportFormGroup.get(controlName);
        if (control) {
          control.setValidators(Validators.required);
          control.updateValueAndValidity();
        }
      });
    }


  }


  async GetById(ID: number) {
    try {
      this.loaderService.requestStarted();
      const data: any = await this.ApplicationService.Get_ITIsReportData_ByID(ID);
      const parsedData = JSON.parse(JSON.stringify(data));
      debugger
      if (parsedData['Data'] != null) {
          this.request = parsedData['Data'];
      }
      //// Assign default values for null or undefined fields
      Object.keys(this.request).forEach((key) => {
        const value = this.request[key as keyof ItiReportDataModel];

        if (value === null || value === undefined) {
          // Default to '' if string, 0 if number
          if (typeof this.request[key as keyof ItiReportDataModel] === 'number') {
            (this.request as any)[key] = 0;
          } else {
            (this.request as any)[key] = '';
          }
        }
      })
      //});
      //if (data['Data']['CollegeName'] == null) {
      //  this.request.CollegeName=''
      //}
      // Optional: override with login data
 /*     this.request.CollegeName = this.sSOLoginDataModel.InstituteName;*/

      // Format specific date fields
      const dateFields: (keyof ItiReportDataModel)[] = [
        'SanctionOrderDate', 'TradeOrderDate', 'AdministrativeOrderDate',
        'PercentCivilDate', 'TakenOverDate', 'ShilanyasDate', 'LokarpanDate'
      ];

      dateFields.forEach((field) => {
        const value = this.request[field];
        if (value) {
          const rawDate = new Date(value as string);
          const year = rawDate.getFullYear();
          const month = String(rawDate.getMonth() + 1).padStart(2, '0');
          const day = String(rawDate.getDate()).padStart(2, '0');
          (this.request as any)[field] = `${year}-${month}-${day}`;
        }
      });

      this.GetAssemblyITI()

      console.log(parsedData);
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async resetrow()
  {
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
      CollegeID: this.request.CollegeID,
      IsOperatingOwn: ''
    });


    this.request.FinancialSanction = '';
    this.request.FinancialCopy = '';
    this.request.PercentCivilWork = '';
    this.request.IsPurposeHall = '';
    this.request.IsMainITI = '';
    this.request.IsBuildingTaken = '';
    this.request.TakenOverDate = '';
    this.request.CollegeID = 0;


    // Reset other unrelated fields (if required)
    

    this.isAddrequest = false

  }


  deleteRow(index: number): void {
    this.request.FinancialSanctionList.splice(index, 1);
  }


  openOTP() {


    this.nonItiValidator()

    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPlanningAdmin) {
      if (this.request.SanctionOrderCopy == '') {
        this.toastr.warning("Please Upload Sanction Copy")
        return
      }
      if (this.request.IsNewCollege == 1 && this.request.AdministrativeCopy == '') {
        this.toastr.warning("Please Upload Administrative Copy")
      }

    }


    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIBuildingAdmin) {
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

      if (this.request.TradeCopy == '') {
        this.toastr.warning("Please Upload A.s Of Trade Santion Order Copy")
        return
      }


      if (this.request.IsNewCollege == 1 && this.request.AllotmentLetter == '' && this.request.IsOperatingOwn=='Yes') {
        this.toastr.warning("Please Upload Allotment Letter Copy")
      }

      if (this.request.IsNewCollege == 1 && this.request.BuildingPlanCopy == '' && this.request.IsOperatingOwn == 'Yes') {
        this.toastr.warning("Please Upload Building Plan Copy")
      }

      if (this.request.IsNewCollege == 1 && this.request.DomeViewCopy == '' ) {
        this.toastr.warning("Please Upload  Front Dome View Copy")
      }

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

 
   
      this.isSubmitted = true;
      if (this.ReportForm.invalid) {
        return
      }

      if (this.request.IsNewCollege == 1) {
        if (this.NewReportFormGroup.invalid) {

          return
        }

      }


    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIBuildingAdmin && this.request.BasicDetailsList.length < 1 ) {
      this.toastr.warning("Please Add ITI Basic Details")
      return
    }

      if (this.sSOLoginDataModel.RoleID == EnumRole.ITIBuildingAdmin && this.request.FinancialSanctionList.length < 1 && this.request.IsNewCollege == 1) {
        this.toastr.warning("Please Add Financials sanction Details")
        return
      }


    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      //this.PublishTimeTable();
      this.SaveData();
    })
  }

  onYearInput(event: any) {
    if (event.target.value.length > 4) {
      event.target.value = event.target.value.slice(0, 4);
      this.request.Esttablishment_Year = event.target.value;
    }
  }


  resetConstructionDetails() {
    this.request.ConstructionAgency = '';
    this.request.PDName = '';
    this.request.ContractorName = '';
    this.request.PDMobile = '';
    this.request.ContractorMobile = '';
    this.request.IsDispute = '';
    this.request.FinancialSanction = '';
    this.request.FinancialCopy = '';
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
      this.request.HostelUtilized='No'
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

      ApproachRoad:      this.request.ApproachRoad,
      InternalRoad:    this.request.InternalRoad,
      Harvesting: this.request.Harvesting,
      ElectPhase: this.request.ElectPhase,
      IsSolarPanel: this.request.IsSolarPanel,
      IsBoundaryWall: this.request.IsBoundaryWall    ,
                
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


}


