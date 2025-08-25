import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus, GlobalConstants } from './../../Common/GlobalConstants';
import { CollegeMasterDataModels } from './../../Models/CollegeMasterDataModels';
import { SSOLoginDataModel } from './../../Models/SSOLoginDataModel';
import { CollegeMasterService } from './../../Services/CollegeMaster/college-master.service';
import { CommonFunctionService } from './../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from './../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from './../../Services/Loader/loader.service';
import { ITICollegeProfileService } from './../../Services/ITI-College-Profile/iticollege-profile.service';
import { ITICollegeProfileDataModels } from './../../Models/ITI/ITICollegeProfileDataModel';
import { AppsettingService } from './../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ReportService } from './../../Services/Report/report.service';

@Component({
  selector: 'app-iti-college-update',
  standalone: false,
  templateUrl: './iti-college-update.component.html',
  styleUrl: './iti-college-update.component.css'
})
export class ItiCollegeUpdateComponent {
  instituteForm!: FormGroup;
  public isUpdate: boolean = false;
  public InstituteId: number = 0;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public TehsilMasterList: any = [];
  public TehsilMasterList1: any = [];
  public TehsilMasterList2: any = [];
  public DivisionMasterList: any = [];
  public State: number = -1;
  public LevelMasterList: any = [];
  public UserID: number = 0;
  public searchText: string = '';
  public tbl_txtSearch: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  public isSubmittedItemDetails: boolean = false;
  public DistrictMasterList: any = []
  public SubDivisionMasterList: any = []
  public AssemblyMasterList: any = []
  public CityMasterDDLList: any = []
  public ParliamentMasterList: any = []
  public PanchayatSamitiList: any = []
  public GramPanchayatList: any = []
  public VillageMasterList: any = []
  public isLoadingExport: boolean = false;
  public closeResult: string | undefined;
  public modalReference: NgbModalRef | undefined;
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new ITICollegeProfileDataModels();
  public filteredDistricts: any[] = [];
  public filteredTehsils: any[] = [];
  public categoryList: any = []
  public ManagmentTypeList: any = []
  public CollegeTypeList: any = []
  public CourseTypeList: any = []
  public ResidenceList: any = []
  public IsCollegeType: boolean = false
  public CollegeId: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private instituteService: CollegeMasterService,
    private collegeprofileService: ITICollegeProfileService,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private http: HttpClient,
    private reportService: ReportService
  ) { }

  async ngOnInit() {
    this.instituteForm = this.formBuilder.group({
      Name: [{ value: ''}, Validators.required],
      website: ['', Validators.required],
      SecretaryName: ['', Validators.required],
      SecretaryMobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      Altemail: [''],
      ssoid: [''],

      PrincipalName: ['', Validators.required],
      PrincipalMobile: ['', Validators.required],
      Principalphoto: [''],
      InstitutionCategoryId: ['', [DropdownValidators]],
      DivisionId: ['', [DropdownValidators]],
      DistrictId: ['', [DropdownValidators]],
      SubDivisionId: ['', [DropdownValidators]],
      TehsilId: ['', [DropdownValidators]],
      UrbanRural: ['', [DropdownValidators]],
      ParliamentId: ['', [DropdownValidators]],
      AssemblyId: ['', [DropdownValidators]],

      Administrative: ['', [DropdownValidators]],
      CantonmentBoard: ['', Validators.required],
      NagarNigam: ['', Validators.required],
      NagarPalika: ['', Validators.required],
      NagarParishad: ['', Validators.required],
      CityID: ['', [DropdownValidators]],
      Ward: ['', [DropdownValidators]],
      PanchayatSamiti: ['', [DropdownValidators]],
      GramPanchayatSamiti: ['', [DropdownValidators]],
      village: ['', [DropdownValidators]],


      PlotNo: ['', Validators.required],
      /*address: ['', Validators.required],*/
      Street: ['', Validators.required],
      Area: ['', Validators.required],
      Landmark: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.pattern(GlobalConstants.PincodePattern)]],

    });
/*    this.instituteForm.get('ssoid')?.disable();*/
    this.request.Id = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));


    this.request.UserID = this.sSOLoginDataModel.UserID;


    //this.request.Id = this.sSOLoginDataModel.InstituteID;

    await this.GetDivisionMasterList();
    // await this.GetTehsilMasterList()
    // await this.GetDistrictMasterList()
    await this.GetParliamentMasterList();
    /*    await this.GetGramPanchayatSamiti();*/
    /*  await this.villageMaster();*/
    await this.GetCategory();
    await this.GetLateralCourse();
    await this.GetPanchayatSamiti('')
    if (this.request.Id > 0) {
      await this.GetByID(this.request.Id);
    }
    /*    await this.nonItiValidator();*/
  }

  nonItiValidator() {

    if (this.request.AdministrativeId == 1) {

      this.instituteForm.controls['NagarNigam'].clearValidators();
      this.instituteForm.controls['NagarPalika'].clearValidators();
      this.instituteForm.controls['NagarParishad'].clearValidators();
    }


    if (this.request.AdministrativeId == 2) {

      this.instituteForm.controls['CantonmentBoard'].clearValidators();
      this.instituteForm.controls['NagarPalika'].clearValidators();
      this.instituteForm.controls['NagarParishad'].clearValidators();
    }

    if (this.request.AdministrativeId == 3) {

      this.instituteForm.controls['CantonmentBoard'].clearValidators();
      this.instituteForm.controls['NagarNigam'].clearValidators();
      this.instituteForm.controls['NagarParishad'].clearValidators();
    }


    if (this.request.AdministrativeId == 4) {

      this.instituteForm.controls['CantonmentBoard'].clearValidators();
      this.instituteForm.controls['NagarNigam'].clearValidators();
      this.instituteForm.controls['NagarPalika'].clearValidators();
    }




    this.instituteForm.controls['CantonmentBoard'].updateValueAndValidity();
    this.instituteForm.controls['NagarNigam'].updateValueAndValidity();
    this.instituteForm.controls['NagarPalika'].updateValueAndValidity();
    this.instituteForm.controls['NagarParishad'].updateValueAndValidity();
  }


  async RefereshValidators() {


    
    if (this.request.UrbanRural == 76) {
      this.instituteForm.controls['Administrative'].clearValidators();
      this.instituteForm.controls['CantonmentBoard'].clearValidators();
      this.instituteForm.controls['CityID'].clearValidators();
      this.instituteForm.controls['Ward'].clearValidators();
      this.instituteForm.controls['NagarNigam'].clearValidators();
      this.instituteForm.controls['NagarPalika'].clearValidators();
      this.instituteForm.controls['NagarParishad'].clearValidators();
    } else {

      this.instituteForm.controls['Administrative'].setValidators([DropdownValidators]);
      this.instituteForm.controls['CantonmentBoard'].setValidators(Validators.required);
      this.instituteForm.controls['CityID'].setValidators([DropdownValidators]);
      this.instituteForm.controls['Ward'].setValidators(Validators.required);
      this.instituteForm.controls['NagarNigam'].setValidators(Validators.required);
      this.instituteForm.controls['NagarPalika'].setValidators(Validators.required);
      this.instituteForm.controls['NagarParishad'].setValidators(Validators.required);
    }

    this.instituteForm.controls['Administrative'].updateValueAndValidity();
    this.instituteForm.controls['CantonmentBoard'].updateValueAndValidity();
    this.instituteForm.controls['CityID'].updateValueAndValidity();
    this.instituteForm.controls['Ward'].updateValueAndValidity();

    this.instituteForm.controls['CantonmentBoard'].updateValueAndValidity();
    this.instituteForm.controls['NagarNigam'].updateValueAndValidity();
    this.instituteForm.controls['NagarPalika'].updateValueAndValidity();
    this.instituteForm.controls['NagarParishad'].updateValueAndValidity();


    if (this.request.UrbanRural == 75) {
      this.instituteForm.controls['PanchayatSamiti'].clearValidators();
      this.instituteForm.controls['GramPanchayatSamiti'].clearValidators();
      this.instituteForm.controls['village'].clearValidators();

    } else {

      this.instituteForm.controls['PanchayatSamiti'].setValidators([DropdownValidators]);
      this.instituteForm.controls['GramPanchayatSamiti'].setValidators([DropdownValidators]);
      this.instituteForm.controls['village'].setValidators([DropdownValidators]);

    }

    this.instituteForm.controls['PanchayatSamiti'].updateValueAndValidity();
    this.instituteForm.controls['GramPanchayatSamiti'].updateValueAndValidity();
    this.instituteForm.controls['village'].updateValueAndValidity();


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


  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {

      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
          //if (this.file.size < 100000) {
          //  this.toastr.error('Select more then 100kb File')
          //  return
          //}
        }
        else {// type validation
          this.toastr.error('Select Only jpeg/jpg/png file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.request.Dis_Name = data['Data'][0]["Dis_FileName"];
                this.request.Logo = data['Data'][0]["FileName"];

              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
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

  async GetCategory() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeCategory()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.categoryList = data['Data'];
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


  // async GetTehsilMasterList() {
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.commonMasterService.GetTehsilMaster()
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         this.TehsilMasterList = data['Data'];
  //         console.log(this.TehsilMasterList)
  //       }, error => console.error(error));
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  //}

  //async GetTehsilAssemblyMasterList() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetTehsilMaster()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.TehsilMasterList2 = data['Data'];
  //        console.log(this.TehsilMasterList2)
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async GetParliamentMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetParliamentMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.ParliamentMasterList = data['Data'];
          console.log(this.ParliamentMasterList)
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


  async GetGramPanchayatSamiti() {
    try {
      this.request.GrampanchayatId = 0
      this.loaderService.requestStarted();
      await this.commonMasterService.GramPanchayat(this.request.TehsilId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.GramPanchayatList = data['Data'];
          console.log(this.ParliamentMasterList)
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


  async GetPanchayatSamiti(id:any) {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.PanchayatSamiti(this.request.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.PanchayatSamitiList = data['Data'];

          if (id) {
            this.request.PanchayatsamityId = id;
          }
          console.log(this.ParliamentMasterList)
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
      this.request.VillageId = 0
      this.loaderService.requestStarted();
      await this.commonMasterService.villageMaster(this.request.GrampanchayatId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.VillageMasterList = data['Data'];
          console.log(this.ParliamentMasterList)
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



  async GetByID(id: number) {
    try {
      
      this.loaderService.requestStarted();
      await this.collegeprofileService.GetByID(id)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.request.Name = data['Data']["Name"];
          this.request.website = data['Data']["website"];

          this.request.SecretaryName = data['Data']["SecretaryName"];
          this.request.SecretaryMobile = data['Data']["SecretaryMobile"];
          this.request.ItiEmail = data['Data']["ItiEmail"];
          this.request.Ssoid = data['Data']["Ssoid"];
          this.request.PrincipalName = data['Data']["PrincipalName"];
          this.request.PrincipalMobile = data['Data']["PrincipalMobile"];
          this.request.Dis_Name = data['Data']["Dis_Name"];
          this.request.Logo = data['Data']["Logo"];
          this.request.InstitutionCategoryId = data['Data']["InstitutionCategoryId"];
          this.request.DivisionId = data['Data']["DivisionId"];
          this.ddlDivision_Change();
          this.request.DistrictId = data['Data']["DistrictId"];
          this.ddlDistrict_Change();

          this.request.SubDivisionId = data['Data']["SubDivisionId"];
          this.request.TehsilId = data['Data']["TehsilId"];


          this.request.UrbanRural = data['Data']["UrbanRural"];
          this.GetGramPanchayatSamiti()
          this.request.AdministrativeId = data['Data']["AdministrativeId"];
          this.request.NagarNigamName = data['Data']["NagarNigamName"];
          this.request.NagarPalikaName = data['Data']["NagarPalikaName"];
          this.request.NagarParishadName = data['Data']["NagarParishadName"];
          this.request.CantonmentBoardName = data['Data']["CantonmentBoardName"];
          this.request.CityID = data['Data']["CityID"];
          this.request.Ward = data['Data']["Ward"];

          if (this.request.UrbanRural == null || this.request.UrbanRural == undefined) {
            this.request.UrbanRural = 0
          }
          this.request.ParliamentId = data['Data']["ParliamentId"];
          this.request.AssemblyId = data['Data']["AssemblyId"];
          this.request.Pincode = data['Data']["Pincode"];
          this.request.PlotNo = data['Data']["PlotNo"];
          this.request.Address = data['Data']["Address"];
          this.request.Area = data['Data']["Area"];
          this.request.Street = data['Data']["Street"];
          this.request.Landmark = data['Data']["Landmark"];
          this.request.ActiveStatus = data['Data']["ActiveStatus"];
          this.request.Email = data['Data']["Email"];
          this.request.CreatedBy = data['Data']['CreatedBy'];
          this.GetPanchayatSamiti(data['Data']['PanchayatsamityId']);
          this.request.PanchayatsamityId = data['Data']['PanchayatsamityId'];
          this.request.GrampanchayatId = data['Data']['GrampanchayatId'];
          this.villageMaster()
          this.request.VillageId = data['Data']['VillageId'];
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

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
  async ddlDivision_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_DivisionIDWise(this.request.DivisionId)
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

  onDivisionChange() {

    const selectedDivisionID = this.request.DivisionId;

    this.filteredDistricts = this.DistrictMasterList.filter((district: any) => district.ID == selectedDivisionID);

  }

  async ddlDistrict_Change() {

    this.request.PanchayatsamityId = 0
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.request.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterList = data['Data'];

        }, error => console.error(error));
      await this.commonMasterService.SubDivisionMaster_DistrictIDWise(this.request.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubDivisionMasterList = data['Data'];
          console.log(this.SubDivisionMasterList, "SubDivisionMasterList")
        }, error => console.error(error));

      await this.commonMasterService.AssemblyMaster_DistrictIDWise(this.request.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AssemblyMasterList = data['Data'];
          console.log(this.AssemblyMasterList, "AssemblyMasterList")
        }, error => console.error(error));

      await this.commonMasterService.CityMasterDistrictWise(this.request.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CityMasterDDLList = data['Data'];
          console.log(this.CityMasterDDLList, "CityMasterDDLList")
        }, error => console.error(error));

      await this.commonMasterService.PanchayatSamiti(this.request.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PanchayatSamitiList = data['Data'];
          console.log(this.ParliamentMasterList)
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


  onDistrictChange() {
    const selectedDistrictID = this.request.DistrictId;
    this.filteredTehsils = this.TehsilMasterList.filter((tehsil: any) => tehsil.ID == selectedDistrictID);
  }

  get form() { return this.instituteForm.controls; }

  async saveData() {
    
    this.isSubmitted = true;
    //
    //this.refreshCourseTypeRefValidation();
    //
    await this.RefereshValidators()

    await this.nonItiValidator();

    //if (this.instituteForm.invalid) {
    //  this.toastr.error('Invalid form Details');
    //  Object.keys(this.instituteForm.controls).forEach(key => {
    //    const control = this.instituteForm.get(key);
    //     if (control && control.invalid) {
    //       this.toastr.error(`Control ${key} is invalid`);
    //       Object.keys(control.errors!).forEach(errorKey => {
    //         this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
    //       });
    //     }
    //   });
    //  return;
    //}


    if (this.instituteForm.invalid) {
      return console.log("error")
    }
    if (this.request.Logo == '') {
      this.toastr.warning("Please Add Principle's Seal and Sign Photo")
      return
    }

    if (this.request.UrbanRural == 75) {
      this.request.GrampanchayatId = 0
      this.request.PanchayatsamityId = 0
      this.request.VillageId = 0
    } else if (this.request.UrbanRural == 76) {
      this.request.AdministrativeId = 0
      this.request.CantonmentBoardName = ''
      this.request.NagarNigamName = ''
      this.request.NagarPalikaName = ''
      this.request.NagarParishadName = ''
      this.request.CityID = 0
      this.request.Ward = 0

    }





    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.InstituteId > 0) {
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.FinancialYearId = this.sSOLoginDataModel.FinancialYearID;
      this.request.EndTermId = this.sSOLoginDataModel.EndTermID

      //set mobile no. in session
      this.sSOLoginDataModel.Mobileno = this.request.PrincipalMobile;
      localStorage.setItem("SSOLoginUser", JSON.stringify(this.sSOLoginDataModel));
      this.request.UpdatedBy = "Admin";
      //call
      await this.collegeprofileService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.routers.navigate(['/ITICollegeMaster']);
            /*   String(localStorage.setItem('SSOLoginUser'). = this.request.PrincipalMobile;*/
            //this.sSOLoginDataModel =  JSON.parse(String(localStorage.getItem('SSOLoginUser')));
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
        this.isLoading = false;

      }, 200);
    }
  }


  async goBack() {
    window.location.href = '/ITICollegeMaster';
  }


  async ResetControl() {
    this.isSubmitted = false;



    this.request.website = '';
    this.request.SecretaryName = '';
    this.request.SecretaryMobile = '';
    this.request.ItiEmail = '';
    this.request.Email = '';

    this.request.PrincipalName = '';
    this.request.PrincipalMobile = '';
    this.request.Dis_Name = '';
    this.request.Logo = '';
    this.request.InstitutionCategoryId = 0;
    this.request.DivisionId = 0;
    this.request.DistrictId = 0;
    this.request.SubDivisionId = 0;
    this.request.TehsilId = 0;
    this.request.UrbanRural = 0;
    this.request.ParliamentId = 0;
    this.request.AssemblyId = 0;
    this.request.Pincode = '';
    this.request.PlotNo = '';
    this.request.Address = '';
    this.request.Street = '';
    this.request.Area = '';
    this.request.Landmark = '';
    this.request.GrampanchayatId = 0;
    this.request.PanchayatsamityId = 0;
    this.request.VillageId = 0;
    this.request.Ward = 0;
    this.request.CantonmentBoardName = '';
    this.request.CityID = 0;
    this.request.NagarNigamName = '';
    this.request.NagarPalikaName = '';
    this.request.NagarParishadName = '';

  }


  //onCancel(): void {
  //  this.routers.navigate(['/collegemaster']);
  //}

  //refreshCourseTypeRefValidation() {
  //  // clear
  //  this.instituteForm.get('CourseType')?.clearValidators();
  //  // set
  //  if (this.request.CollegeTypeID == 22) {
  //    this.instituteForm.get('CourseType')?.setValidators([DropdownValidators]);
  //  }
  //  // update
  //  this.instituteForm.get('CourseType')?.updateValueAndValidity();
  //}

  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }


  DownloadPDF(): void {
    try {
      this.loaderService.requestStarted();
      //this.searchRequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      //this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.CollegeId = this.sSOLoginDataModel.InstituteID
      this.reportService.GetITICollegeProfile(this.CollegeId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DownloadFile(data.Data, 'file download');
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

  DownloadFile(FileName: string, DownloadfileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${FileName}`;
    
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName(DownloadfileName); // Use DownloadfileName
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.pdf`;
  }

}
