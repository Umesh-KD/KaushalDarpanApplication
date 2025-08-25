import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDatamodel, BterSearchmodel } from '../../../Models/ApplicationFormDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DataServiceService } from '../../../Services/DataService/data-service.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { BterApplicationForm } from '../../../Services/BterApplicationForm/bterApplication.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { TspAreasService } from '../../../Services/Tsp-Areas/Tsp-Areas.service';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ItiReportDataModel } from '../../../Models/ITI/ItiReportDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ITIsService } from '../../../Services/ITIs/itis.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
@Component({
  selector: 'app-iti-college-report',
  standalone: false,
  templateUrl: './iti-college-report.component.html',
  styleUrl: './iti-college-report.component.css'
})
export class ItiCollegeReportComponent {
  public ReportForm!: FormGroup
  public NewReportFormGroup!: FormGroup

  public CompanyMasterDDLList: any[] = [];
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
  public isSupplement: boolean = false
  public NationalityList: any = []
  public ReligionList: any = []
  public category_CList: any = []
  public category_PreList: any = []
  public ApplicationID: number = 0;
  public searchrequest = new BterSearchmodel()
  public GenderList: any = ''



  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private ApplicationService: ITIsService,
    private toastr: ToastrService,
    private dataService: DataServiceService,
    private activatedRoute: ActivatedRoute,
    private appsettingConfig: AppsettingService,
    private swat: SweetAlert2
  ) { }





  async ngOnInit() {
    // form group
    this.ReportForm = this.formBuilder.group(
      {
        txtName: [{ value: '', disabled: true }, Validators.required],
        Loksabha: ['', Validators.required],
        LandAvailable: ['', Validators.required],
        Vidhansabha: ['', Validators.required],
        PanchayatDis: ['', Validators.required],
        SanctionOrderNo: ['', Validators.required],
        SanctionOrderDate: ['', Validators.required],
        TradeOrderNo: ['', Validators.required],
        TradeOrderDate: ['', Validators.required],
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
        ContractLoad: [''],
        BuildShortage: [''],
        IsHostel: ['', Validators.required],
        txtYear: ['', [DropdownValidators]],
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
      FinancialSanction: ['', Validators.required],
      PercentCivilWork: ['', Validators.required],
      PercentCivilDate: ['', Validators.required],
      IsPurposeHall: ['', Validators.required],
      IsMainITI: ['', Validators.required],
      IsBuildingTaken: ['', Validators.required],
      TakenOverDate: ['', Validators.required],
      IsOperatingOwn: ['', Validators.required],
      ShilanyasDate: ['', Validators.required],
      LokarpanDate: ['', Validators.required],
      LokarpanName: ['', Validators.required],
      LokarpanPost: ['', Validators.required],
      ShilanyasPost: ['', Validators.required],
      ShilanyasName: ['', Validators.required],

    })


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.searchrequest.SSOID = this.sSOLoginDataModel.SSOID
    //this.searchrequest.DepartmentID = EnumDepartment.BTER;
    //this.request.DepartmentID = EnumDepartment.BTER;
    /*    this.HRManagerID = Number(this.activatedRoute.snapshot.queryParamMap.get('HRManagerID')?.toString());*/

    //await this.loadDropdownData('Board')
    //await this.GetStateMatserDDL()
    //await this.GetPassingYearDDL()

    this.request.CollegeName = this.sSOLoginDataModel.InstituteName
    this.request.CollegeID = this.sSOLoginDataModel.InstituteID

    if (this.request.CollegeID > 0) {
      this.GetById(this.request.CollegeID)
    }
    this.request.IsNewCollege=1
  }

  get _ReportForm() { return this.ReportForm.controls; }
  get _NewReportForm() { return this.NewReportFormGroup.controls; }


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

    if (this.request.IsSolarPanel == 'No')
    {
      this.request.PanelCapacity = ''
    }
    if (this.request.IsBuildingTaken == 'No') {

      this.request.TakenOverDate = ''
    }

    try {
      this.isSubmitted = true;
      if (this.ReportForm.invalid) {
        return
      }
      if (this.request.IsNewCollege == 1) {
        if (this.NewReportFormGroup.invalid) {

          return
        }

      }





      console.log(this.request)


      this.isLoading = true;

      this.loaderService.requestStarted();

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;

      this.request.CollegeID = this.sSOLoginDataModel.InstituteID
      //save
      await this.ApplicationService.SaveDataReport(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)


            /* this.routers.navigate(['/Hrmaster']);*/

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

    if (this.request.IsSolarPanel == 'No') {

      this.ReportForm.controls['PanelCapacity'].clearValidators();
    }
    else {
      this.ReportForm.controls['PanelCapacity'].setValidators(Validators.required);
    }

    this.ReportForm.controls['PanelCapacity'].updateValueAndValidity();


    if (this.request.IsBuildingTaken == 'Yes') {
      this.NewReportFormGroup.controls['TakenOverDate'].clearValidators();
    } else {
      this.NewReportFormGroup.controls['TakenOverDate'].setValidators(Validators.required);
    }

    this.NewReportFormGroup.controls['TakenOverDate'].updateValueAndValidity();
  }


  async GetById(ID: number) {
    try {
      this.loaderService.requestStarted();
      const data: any = await this.ApplicationService.Get_ITIsReportData_ByID(ID);
      const parsedData = JSON.parse(JSON.stringify(data));

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




}
