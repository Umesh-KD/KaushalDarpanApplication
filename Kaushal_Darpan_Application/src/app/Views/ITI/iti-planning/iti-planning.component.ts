import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { ITI_PlanningCollegesModel, ItiAffiliationList, ItiMembersModel, ItiVerificationModel } from '../../../Models/ItiPlanningDataModel';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { DeferBlockBehavior } from '@angular/core/testing';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-iti-planning',
  standalone: false,
  templateUrl: './iti-planning.component.html',
  styleUrl: './iti-planning.component.css'
})
export class ItiPlanningComponent {
  public ReportForm!: FormGroup
  public AffFormGroup !: FormGroup
  formAction!: FormGroup;
  public NewReportFormGroup!: FormGroup
  public AddressFormGroup!: FormGroup
  public ResidenceList: any = []
  public CompanyMasterDDLList: any[] = [];
  public DistrictMasterList: any[] = [];
  public StateMasterList: any[] = [];
  public DistrictMasterList3: any[] = [];
  public BoardList: any = []
  closeResult: string | undefined;
  public request = new ITI_PlanningCollegesModel()
  requestAction = new ItiVerificationModel();
  public member = new ItiMembersModel()
  public addmore = new ItiAffiliationList()
  public isAddrequest: boolean=false
  public isAddrequest2: boolean=false
  /*  public addrequest = new SupplementaryDataModel()*/
  public _enumrole = EnumRole
  public minDate: string = '';
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
  public SubDivisionMasterList: any = [];
  public CityMasterDDLList: any = [];
  public PanchayatSamitiList: any = [];
  public GramPanchayatList: any = [];
  public ItiMemberPostList: any = [];
  public DISCOM: any = [];
  public VillageList: any = [];
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public Collegeid: number = 0
  public Type: number = 0
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
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
    private modalService: NgbModal,
    private router: Router,
    private http: HttpClient,
  ) { }





  async ngOnInit() {

    this.ReportForm = this.formBuilder.group(
      {
        txtName: [{ value: '', disabled: true }, Validators.required],
        CollegeCode: [{ value: '', disabled: true }, Validators.required],
        MISC: [{ value: '', disabled: true }],
        TrustSocietyName: ['', Validators.required],
        RegNo: ['', Validators.required],
        RegDate: ['', Validators.required],
        ManageRegOffice: ['', Validators.required],
    
        ddlInstituteCategoryId: ['', [DropdownValidators]],
        ddlManagementType: [{ value: '', disabled: true }],
        Remarks: [''],
        ddlState: ['', [DropdownValidators]],
        ddlDistrict: ['', [DropdownValidators]],
        TrustSociety: ['', [DropdownValidators]],
        //FrontPhoto: [''],
        //SidePhoto: [''],
        //InteriorPhoto: [''],
        //SanctionOrderCopy: [''],
        //TradeCopy: [''],

      }); 

    this.NewReportFormGroup = this.formBuilder.group({
 
      MemberName: ['', Validators.required],
      ContactNo: ['', [Validators.required, Validators.pattern(GlobalConstants.MobileNumberPattern)]],
      LastElectionValidUpTo: [''],
      LastElectionDate: [''],
      PostID: ['', [DropdownValidators]],

    })



    this.AddressFormGroup = this.formBuilder.group({

      //MemberName: ['', Validators.required],
      AgreementLeaseDate: ['', Validators.required],
      ValidUpToLeaseDate: ['', Validators.required],
      InstituteRegOffice: ['', Validators.required],
      PlotHouseBuildingNo: ['', Validators.required],
      AreaLocalitySector: [''],
      StreetRoadLane: [''],
      Latitude: ['', Validators.required],
      Longitude: ['', Validators.required],
      InstituteSubDivisionID: ['', Validators.required],
      LandMark: [''],
      Ward: ['', Validators.required],
      KhasraKhataNo: ['', Validators.required],
      BighaYard: ['', Validators.required],
      ContactNo: ['', [Validators.required, Validators.pattern(GlobalConstants.MobileNumberPattern)]],
      Email: ['', [Validators.required, Validators.pattern(GlobalConstants.EmailPattern)]],
      Website: ['', [Validators.required]],
      KNo: ['', Validators.required],
      ConsumerName: ['', Validators.required],
      ContractDemand: [''],
      SubDivOffice: ['', Validators.required],
      DISCOM: ['', [DropdownValidators]],
      SanctionLoad: ['', Validators.required],
      AlternateEmail: ['', Validators.pattern(GlobalConstants.EmailPattern)],
      //LastElectionValidUpTo: [''],
      //LastElectionDate: [''],
      OwnerShipID: ['', [DropdownValidators]],  
      InstituteDivisionID: ['', [DropdownValidators]],
      InstituteDistrictID: ['', [DropdownValidators]],
      PropUrbanRural: ['', [DropdownValidators]],
      PropTehsilID: ['', [DropdownValidators]],
      ddlState: ['', [DropdownValidators]],
      ddlDistrict: ['', [DropdownValidators]],
      AdministrativeBodyId: ['', [DropdownValidators]],
      village: ['', [DropdownValidators]],
      CityID: ['', [DropdownValidators]],
      ConnectionType: ['', [DropdownValidators]],
      GramPanchayatSamiti: ['', [DropdownValidators]],
      PanchayatSamiti: ['', [DropdownValidators]],

    })

    this.AffFormGroup = this.formBuilder.group({

      OrderNo: ['', Validators.required],
      OrderDate: ['', Validators.required],
      EffectFrom: ['', Validators.required],
      SerialNo: ['', Validators.required],
      PageNo: ['', Validators.required],



    })


    this.formAction = this.formBuilder.group(
      {
        ddlAction: ['', [DropdownValidators]],
        txtActionRemarks: ['', Validators.required],
      })



    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.searchrequest.SSOID = this.sSOLoginDataModel.SSOID
    //this.searchrequest.DepartmentID = EnumDepartment.BTER;
    //this.request.DepartmentID = EnumDepartment.BTER;
    /*    this.HRManagerID = Number(this.activatedRoute.snapshot.queryParamMap.get('HRManagerID')?.toString());*/

    //await this.loadDropdownData('Board')
    //await this.GetStateMatserDDL()
    //await this.GetPassingYearDDL()

    //this.request.CollegeName = this.sSOLoginDataModel.InstituteName


    const idParam = this.activatedRoute.snapshot.queryParamMap.get('id');
    const Type = this.activatedRoute.snapshot.queryParamMap.get('Type');
    this.Collegeid = Number(idParam);
    if (!idParam || isNaN(this.Collegeid)) {
      this.Collegeid = 0;


    }
    this.Type = Number(Type);
    if (!idParam || isNaN(this.Type)) {
      this.Type = 0;


    }

   
    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || this.sSOLoginDataModel.RoleID == EnumRole.Principal_NCVT) {
      this.request.CollegeId = this.sSOLoginDataModel.InstituteID
    } else {
      this.request.CollegeId = this.Collegeid

    }

    //this.request.InstituteManagementId = 5
    //this.ReportForm.controls['ddlManagementType'].disable()
    /*   this.request.CollegeId = 2227*/

    if (
      this.sSOLoginDataModel.RoleID != EnumRole.ITIPrincipal &&
      this.sSOLoginDataModel.RoleID != EnumRole.Principal_NCVT
      || this.Type==1
    ) {
      this.ReportForm.disable(); // Disables all form controls
      this.AddressFormGroup.disable(); // Disables all form controls
      this.NewReportFormGroup.controls['LastElectionDate'].disable()
      this.NewReportFormGroup.controls['LastElectionValidUpTo'].disable()
    }

    

    if (this.request.CollegeId > 0) {
      await this.GetById(this.request.CollegeId)
      if (this.Type != 1) {
        if (this.request.Status == 2 && this.sSOLoginDataModel.RoleID != EnumRole.DTETraing || this.request.Status == 3 && this.sSOLoginDataModel.RoleID != EnumRole.DTETraing) {
          window.open("/ItiPlanningList?id=" + this.sSOLoginDataModel.InstituteID, "_Self")
        }
      }
      
    }
    //this.request.IsNewCollege = 1
    this.GetInstituteCategoryList();
    this.GetManagmentType();
    this.GetStateMaterData()
    this.GetDivisionMasterList()
    this.GetLateralCourse()
    this.GetcOmmonData()
    this.ItiMemberPost()
    this.setMinDate();
  }

  get _ReportForm() { return this.ReportForm.controls; }
  get _NewReportForm() { return this.NewReportFormGroup.controls; }
  get _AddressFormGroup() { return this.AddressFormGroup.controls; }
  get _AffFormGroup() { return this.AffFormGroup.controls; }

  get minValidUpToDate(): string | null {
    if (this.request.AgreementLeaseDate) {
      const agreementDate = new Date(this.request.AgreementLeaseDate);
      agreementDate.setFullYear(agreementDate.getFullYear() + 5);
      return agreementDate.toISOString().split('T')[0]; // Format: yyyy-MM-dd
    }
    return null;
  }


  setMinDate(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }


  async GetGramPanchayatSamiti() {
    try {
      if (this.request.PropUrbanRural == 75) {
        this.request.GramPanchayatSamiti = 0
        return
      }

      this.loaderService.requestStarted();
      await this.commonMasterService.GramPanchayat(this.request.PropTehsilID)
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


 


  async GetPanchayatSamiti() {
    try {
      if (this.request.PropUrbanRural == 75) {
        return
      }
      this.loaderService.requestStarted();
      await this.commonMasterService.PanchayatSamiti(this.request.PropDistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.PanchayatSamitiList = data['Data'];

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
      if (this.request.PropUrbanRural == 75) {
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

  //async GetVillageData() {
  //  try {
  //    if (this.request.PropUrbanRural == 75) {
  //      return
  //    }
  //    this.request.VillageID=0
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetCommonMasterData('VillageMaster', this.sSOLoginDataModel.DepartmentID, this.request.PropTehsilID)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.VillageList = data['Data'];
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

      let InstituteDistrictID: number = this.request?.InstituteDistrictID ?? 0;

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

      await this.commonMasterService.PanchayatSamiti(InstituteDistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PanchayatSamitiList = data['Data'];
   
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


  async ItiMemberPost() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('ItiMemberPost')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ggg');
          this.ItiMemberPostList = data['Data'];

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
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_DivisionIDWise(this.request.InstituteDivisionID)
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
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_StateIDWise(this.request.RegOfficeStateID)
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
      await this.commonMasterService.DistrictMaster_StateIDWise(this.request.InstituteStateID)
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
                case "RegFileName":

                  this.request.RegFileName = data['Data'][0]["FileName"];
                  this.request.RegDisFileName = data['Data'][0]["Dis_FileName"];

                  break;
                case "IDFileName":

                  this.member.IDFileName = data['Data'][0]["FileName"];
                  this.member.IDdis_Filename = data['Data'][0]["Dis_FileName"];
                  break;
                case "MemberIdProofName":

                  this.request.MemberIdProofName = data['Data'][0]["FileName"];
                  this.request.MemberIdDisProofName = data['Data'][0]["Dis_FileName"];

                  break;
                case "AgreementFileName":
                  this.request.AgreementFileName = data['Data'][0]["FileName"];
                  this.request.AgreementDisFileName = data['Data'][0]["Dis_FileName"];

                  break;
                case "LatLongFileName":
                  this.request.LatLongFileName = data['Data'][0]["FileName"];
                  this.request.LatLongDisFileName = data['Data'][0]["Dis_FileName"];


                  break;
                case "Bill_Filename":
                  this.request.Bill_Filename = data['Data'][0]["FileName"];
                  this.request.Bill_DisFilename = data['Data'][0]["FileName"];


                  break;
                case "FileName":
                  this.addmore.FileName = data['Data'][0]["FileName"];
                  this.addmore.Dis_Filename = data['Data'][0]["FileName"];


                 

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
  async SaveData(Status:number=0) {
   

    this.nonItiValidator()

   
/*    this.request.CollegeId=2227*/
    try {
      this.isSubmitted = true;

      if (this.request.InstituteManagementId == 5) {
        if (this.ReportForm.invalid) {
          return
        }
      }
  
        //if (this.NewReportFormGroup.invalid) {

        //  return
      //}

      if (this.request.InstituteManagementId == 5 && this.request.RegFileName == '') {
        this.toastr.error("Please Upload Registration Document")
        return
      }



      if (this.request.Bill_Filename == '') {
        this.toastr.error("Please Upload Last Month Electricity")
        return
      }


      if (this.request.LatLongFileName == '') {
        this.toastr.error("Please Upload Lat/Long* (along with college gate photo)")
        return
      }

      if (this.request.OwnerShipID == 1 && this.request.AgreementFileName =='') {
        this.toastr.error("Please Upload Rent Agreement Document")
        return
      }
      if (this.request.OwnerShipID == 2 && this.request.AgreementFileName == '') {
        this.toastr.error("Please Upload Owned Property  Document")
        return
      }

      if (this.request.InstituteManagementId == 0) {
        this.toastr.warning("Please Select Management Type")
        return
      }
     
        if (this.AddressFormGroup.invalid) {
          return
        }


      if (this.request.InstituteManagementId == 5 && this.request.LastElectionDate == '') {
        this.toastr.error("Please Enter Date of Last Election")
        return
      }

      if (this.request.InstituteManagementId == 5 && this.request.LastElectionValidUpTo == '') {
        this.toastr.error("Please Add Date of Last Election Vaid Upto")
        return
      }


      if (this.request.ItiAffiliationList.length < 1) {
        this.toastr.error("Please Add Affiliation Details")
        return
      }


      if (this.request.ItiMembersModel.length < 1 && this.request.InstituteManagementId==5) {
        this.toastr.error("Please Add Members Details")
        return
      }

      if (this.request.InstituteManagementId == 5 && this.request.MemberIdProofName == '') {
        this.toastr.error("Please Upload Member Document")
        return
      }



      if (this.request.OwnerShipID == 2) {
        this.request.AgreementLeaseDate = ''
        this.request.ValidUpToLeaseDate = ''
        this.request.InstituteRegOffice = ''
        this.request.InstituteDistrictID = 0
        //this.request.AgreementFileName = ''
        //this.request.AgreementDisFileName = ''
      }

      if (this.request.PropUrbanRural == 75) {
        this.request.PanchayatSamiti = 0
        this.request.GramPanchayatSamiti = 0
        this.request.VillageID = 0
      } else {
        this.request.CityID = 0
        this.request.AdministrativeBodyId = 0
      }


      if (!this.validateLeaseDates()) {
        return; // prevent form submission or save
      }


      if (this.request.InstituteManagementId == 1) {
        this.request.ItiMembersModel = []
        this.request.TrustSociety = 0
        this.request.TrustSocietyName = ''
        this.request.RegNo = ''
        this.request.RegDate = ''
        this.request.RegFileName = ''
        this.request.RegDisFileName = ''
        this.request.RegOfficeDistrictID = 0
        this.request.RegOfficeStateID = 0
   /*     this.request.InstituteRegOffice = ''*/
/*        this.request.InstituteRegOffice = ''*/
      }
      console.log(this.request) 
      this.isLoading = true;
      this.loaderService.requestStarted();

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.request.CollegeId = this.sSOLoginDataModel.InstituteID
      this.request.Status=Status
      //save
      await this.ApplicationService.SaveDataPlanning(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.router.navigate(['/ItiPlanning']);
            // this.GetById(this.request.CollegeId)
            
            if (this.request.Status == 2) {
               window.open("/ItiPlanningList?id=" + this.sSOLoginDataModel.InstituteID, "_Self")
            }
            /* this.routers.navigate(['/Hrmaster']);*/

          }
          else {
            this.toastr.error(data.ErrorMessage)
          }

        }, (error: any) => console.error(error)
        );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 2000);
    }
  }


  nonApproveValidator()
  {
    if (this.requestAction.Status != 4)//required when reject
    {
      this.formAction.controls['txtActionRemarks'].clearValidators();
    }
    else
    {
      this.formAction.controls['txtActionRemarks'].setValidators(Validators.required)
    }
    this.formAction.controls['txtActionRemarks'].updateValueAndValidity();

  }



  nonItiValidator() {

    if (this.request.OwnerShipID == 2) {

      this.AddressFormGroup.controls['AgreementLeaseDate'].clearValidators();
      this.AddressFormGroup.controls['ValidUpToLeaseDate'].clearValidators();
      this.AddressFormGroup.controls['InstituteRegOffice'].clearValidators();
      this.AddressFormGroup.controls['ddlDistrict'].clearValidators();
      this.AddressFormGroup.controls['ddlState'].clearValidators();
   
    }
    else {
      this.AddressFormGroup.controls['AgreementLeaseDate'].setValidators(Validators.required)
      this.AddressFormGroup.controls['ValidUpToLeaseDate'].setValidators(Validators.required);
      this.AddressFormGroup.controls['InstituteRegOffice'].setValidators(Validators.required);
      this.AddressFormGroup.controls['ddlDistrict'].setValidators([DropdownValidators]);
      this.AddressFormGroup.controls['ddlState'].setValidators([DropdownValidators]);
    }

    this.AddressFormGroup.controls['AgreementLeaseDate'].updateValueAndValidity();
    this.AddressFormGroup.controls['ValidUpToLeaseDate'].updateValueAndValidity();
    this.AddressFormGroup.controls['InstituteRegOffice'].updateValueAndValidity();
    this.AddressFormGroup.controls['ddlDistrict'].updateValueAndValidity();
    this.AddressFormGroup.controls['ddlState'].updateValueAndValidity();

    if (this.request.PropUrbanRural == 76) {
      this.AddressFormGroup.controls['CityID'].clearValidators();
      this.AddressFormGroup.controls['AdministrativeBodyId'].clearValidators();
      this.AddressFormGroup.controls['village'].setValidators([DropdownValidators]);
      this.AddressFormGroup.controls['GramPanchayatSamiti'].setValidators([DropdownValidators]);
      this.AddressFormGroup.controls['PanchayatSamiti'].setValidators([DropdownValidators]);
    } else {
      this.AddressFormGroup.controls['CityID'].setValidators([DropdownValidators]);
      this.AddressFormGroup.controls['AdministrativeBodyId'].setValidators([DropdownValidators]);
      this.AddressFormGroup.controls['village'].clearValidators();
      this.AddressFormGroup.controls['GramPanchayatSamiti'].clearValidators();
      this.AddressFormGroup.controls['PanchayatSamiti'].clearValidators();
    }
    this.AddressFormGroup.controls['CityID'].updateValueAndValidity();
    this.AddressFormGroup.controls['AdministrativeBodyId'].updateValueAndValidity();
    this.AddressFormGroup.controls['village'].updateValueAndValidity();
    this.AddressFormGroup.controls['GramPanchayatSamiti'].updateValueAndValidity();
    this.AddressFormGroup.controls['PanchayatSamiti'].updateValueAndValidity();


    if (this.request.InstituteManagementId == 5) {
      this.ReportForm.controls['TrustSocietyName'].setValidators(Validators.required);
      this.ReportForm.controls['RegNo'].setValidators(Validators.required);
      this.ReportForm.controls['RegDate'].setValidators(Validators.required);
      this.ReportForm.controls['ManageRegOffice'].setValidators(Validators.required);
      this.ReportForm.controls['TrustSociety'].setValidators([DropdownValidators]);
      this.ReportForm.controls['ddlState'].setValidators([DropdownValidators]);
      this.ReportForm.controls['ddlDistrict'].setValidators([DropdownValidators]);
    }
    else {
      this.ReportForm.controls['TrustSocietyName'].clearValidators();
      this.ReportForm.controls['RegNo'].clearValidators();
      this.ReportForm.controls['RegDate'].clearValidators();
      this.ReportForm.controls['ManageRegOffice'].clearValidators();
      this.ReportForm.controls['TrustSociety'].clearValidators();
      this.ReportForm.controls['ddlDistrict'].clearValidators();
    }
    this.ReportForm.controls['TrustSocietyName'].updateValueAndValidity();
    this.ReportForm.controls['RegNo'].updateValueAndValidity();
    this.ReportForm.controls['RegDate'].updateValueAndValidity();
    this.ReportForm.controls['ManageRegOffice'].updateValueAndValidity();
    this.ReportForm.controls['TrustSociety'].updateValueAndValidity()
    this.ReportForm.controls['ddlState'].updateValueAndValidity()
    this.ReportForm.controls['ddlDistrict'].updateValueAndValidity()

  }


  async GetById(ID: number) {
    try {
      debugger;
      this.request.ItiAffiliationList = []
      this.request.ItiMembersModel=[]
      this.loaderService.requestStarted();
      const data: any = await this.ApplicationService.Get_ITIsPlanningData_ByID(ID);
      const parsedData = JSON.parse(JSON.stringify(data));

      

      if (parsedData['Data'] != null) {
        this.request = parsedData['Data'];
        await this.ddlState_Change2()
        this.request.InstituteDivisionID = parsedData['Data']["InstituteDivisionID"]
        await this.ddlDivision_Change()
        this.request.PropDistrictID = parsedData['Data']["PropDistrictID"]
        await this.ddlDistrict_Change()
        this.request.InstituteSubDivisionID = parsedData['Data']["InstituteSubDivisionID"]
        this.request.PropTehsilID = parsedData['Data']["PropTehsilID"]
        this.request.CityID = parsedData['Data']["CityID"]
        await this.ddlState_Change()
        if (this.request.PropUrbanRural == 76) {
          await this.GetGramPanchayatSamiti();
        }
        
      }
      //// Assign default values for null or undefined fields
      Object.keys(this.request).forEach((key) => {
        const value = this.request[key as keyof ITI_PlanningCollegesModel];

        if (value === null || value === undefined) {
          // Default to '' if string, 0 if number
          if (typeof this.request[key as keyof ITI_PlanningCollegesModel] === 'number') {
            (this.request as any)[key] = 0;
          } else {
            (this.request as any)[key] = '';
          }
        }
      })
      if (this.request.ItiAffiliationList == null || this.request.ItiAffiliationList == undefined) {
        this.request.ItiAffiliationList=[]
      }

      if (this.request.ItiMembersModel == null || this.request.ItiMembersModel == undefined) {
        this.request.ItiMembersModel = [];
      }
      //if (this.request.ItiMembersModel.length > 0) {
      //  this.ItiMemberPost()
      //  this.request.ItiMembersModel.forEach((member) => {
      //    

      //       this.member.PostName = this.ItiMemberPostList.filter((x: any) => x.ID == this.member.PostID)[0]['Name'];
      //  });

      //}
      if (this.request.PropUrbanRural == 76) {

      
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
      const dateFields: (keyof ITI_PlanningCollegesModel)[] = [
        'AgreementLeaseDate', 'LastElectionDate', 'ValidUpToLeaseDate',
        'RegDate', 'LastElectionValidUpTo'
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
/*      this.request.InstituteManagementId=5*/

      console.log(parsedData,"dsw");
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 2000);
    }
  }


  async Get_ITIsPlanningData_ByIDReport() {

    try {

      this.loaderService.requestStarted();


      await this.ApplicationService.Get_ITIsPlanningData_ByIDReport(this.request.CollegeId)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          data = JSON.parse(JSON.stringify(data));
          debugger
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'ITIPlanningReport.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  //async resetrow() {
  //  this.isSubmitted = false
  //  this.request = new ItiReportDataModel()
  //  this.request.CollegeID = this.sSOLoginDataModel.InstituteID
  //  this.request.CollegeName = this.sSOLoginDataModel.InstituteName
  //}

  async changeUrbanRural() {
    this.GetGramPanchayatSamiti()
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
    if (this.NewReportFormGroup.invalid) {
      /*this.OptionsFormGroup.markAllAsTouched();*/
      return;
    }


    // Get the selected values



    this.member.PostName = this.ItiMemberPostList.filter((x: any) => x.ID == this.member.PostID)[0]['Name'];

    if (!this.request.ItiMembersModel) {
      this.request.ItiMembersModel = [];
    }

    if (this.member.IDFileName == '') {
      this.toastr.error("Please Upload File")
      return
    }
    
    if (this.member.PostID != 7 && this.member.PostID != 8) {
      const Exist = this.request.ItiMembersModel.find((e) => e.PostID == this.member.PostID)
      if (Exist) {
        this.toastr.warning("Already Have member with selected Post ID")
        return
      }
    }
  

    this.request.ItiMembersModel.push({
      ContactNo: this.member.ContactNo,
      IDdis_Filename: this.member.IDdis_Filename,
      IDFileName: this.member.IDFileName,
      MemberId: this.member.MemberId,
      MemberName: this.member.MemberName,
      PostID: this.member.PostID,
      PostName: this.member.PostName,
      CollegeID: this.member.CollegeID
    });


    this.member.CollegeID = 0
    this.member.PostID = 0
    this.member.MemberId = 0

    this.member.ContactNo = ''
    this.member.IDdis_Filename = ''
    this.member.IDFileName = ''
    this.member.MemberName = ''
    this.member.PostName = ''

    this.isAddrequest = false

  }



  deleteRow(index: number): void {
    this.request.ItiMembersModel.splice(index, 1);
  }



  AddChoice2() {

    this.isAddrequest2 = true;
    if (this.AffFormGroup.invalid) {
      /*this.OptionsFormGroup.markAllAsTouched();*/
      return;
    }


    // Get the selected values

    //if (this.addmore.FileName == '') {
    //  this.toastr.error("Please Upload File")
    //  return
    //}



    if (!this.request.ItiAffiliationList) {
      this.request.ItiAffiliationList = [];
    }


   
    this.request.ItiAffiliationList.push({
      AffiliationID: this.addmore.AffiliationID,
      CollegeID: this.addmore.CollegeID,
      Dis_Filename: this.addmore.Dis_Filename,
      FileName: this.addmore.FileName,
      OrderNo: this.addmore.OrderNo,
      OrderDate: this.addmore.OrderDate,
      PageNo: this.addmore.PageNo,
      SerialNo: this.addmore.SerialNo,
      EffectFrom: this.addmore.EffectFrom
    });


    this.addmore.CollegeID = 0
    this.addmore.AffiliationID = 0
    this.addmore.Dis_Filename = ''

    this.addmore.FileName = ''
    this.addmore.EffectFrom = ''
    this.addmore.OrderDate = ''
    this.addmore.OrderNo = ''
    this.addmore.PageNo = ''
    this.addmore.SerialNo = ''

    this.isAddrequest2 = false

  }



  deleteRow2(index: number): void {
    this.request.ItiAffiliationList.splice(index, 1);
  }



  //@ViewChild('content') content: ElementRef | any;

  //open(content: any, BookingId: string) {
  //  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  //    this.closeResult = `Closed with: ${result}`;
  //  }, (reason) => {
  //    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //  });

  //}
  //private getDismissReason(reason: any): string {
  //  if (reason === ModalDismissReasons.ESC) {
  //    return 'by pressing ESC';
  //  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //    return 'by clicking on a backdrop';
  //  } else {
  //    return `with: ${reason}`;
  //  }
  //}

  openOTP() {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      //this.PublishTimeTable();
      this.SaveData(2);
    })
  }



  validateLeaseDates() {
    if (this.request.AgreementLeaseDate && this.request.ValidUpToLeaseDate) {
      const agreementDate = new Date(this.request.AgreementLeaseDate);
      const validUptoDate = new Date(this.request.ValidUpToLeaseDate);

      const minRequiredDate = new Date(agreementDate);
      minRequiredDate.setFullYear(minRequiredDate.getFullYear() + 5);

      if (validUptoDate < minRequiredDate) {
        this.toastr.error('Valid Agreement Up To date should be at least 5 years from Agreement Date.', 'Validation Error');
        return false;
      }

      if (validUptoDate < agreementDate) {
        this.toastr.error('Valid Agreement Up To date cannot be earlier than Agreement Date.', 'Validation Error');
        return false;
      }
    }
    return true;
  }

  public downloadPDF(): void {
    const element = this.pdfTable.nativeElement;

    // Backup + replace inputs with spans
    const inputs = element.querySelectorAll('input, textarea, select');
    const replacements: { input: HTMLElement; span: HTMLElement }[] = [];

    inputs.forEach((input: any) => {
      const span = document.createElement('span');
      if (input.tagName === 'SELECT') {
        const selectedOption = input.options[input.selectedIndex];
        span.innerText = selectedOption ? selectedOption.text : '';
      } else {
        span.innerText = input.value || input.innerText || '';
      }
      span.style.border = '1px solid #ccc';
      span.style.padding = '6px 8px';
      span.style.display = 'inline-block';
      span.style.minWidth = input.offsetWidth + 'px';
      span.style.font = window.getComputedStyle(input).font;

      input.style.display = 'none';
      input.parentNode.insertBefore(span, input);
      replacements.push({ input, span });
    });

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('Report.pdf');

      // Restore original input visibility
      replacements.forEach(({ input, span }) => {
        input.style.display = '';
        span.remove();
      });
    });
  }


  async DownloadApplicationForm() {
    try {   
      console.log("searchrequest", this.searchrequest)
      await this.ApplicationService.DownloadITIPlanning(this.request.CollegeId)
      //await this.reportService.GetITIApplicationForm(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile1(data.Data, 'file download');
          }
          else {
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

  DownloadFile1(FileName: string, DownloadfileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${FileName}`;


    const base64 = 'data:application/pdf;base64,' + FileName;
    const a = document.createElement('a');
    a.href = base64;
    a.download = 'GeneratedFile.pdf';
    a.click();


    //this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
    //  const downloadLink = document.createElement('a');
    //  const url = window.URL.createObjectURL(blob);
    //  downloadLink.href = url;
    //  downloadLink.download = this.generateFileName(DownloadfileName); // Use DownloadfileName
    //  downloadLink.click();
    //  window.URL.revokeObjectURL(url);
    //});
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  async ViewandUpdate(content: any, PostID: number=0) {
    this.requestAction.Status = 0
    this.requestAction.Remarks = ''
    this.requestAction.InstituteID = this.request.CollegeId
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    //this.modalReference.shown(CampusPostComponent, { initialState });
    //this.modalReference.show(CampusPostComponent, { initialState });
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
  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  get FormAction() { return this.formAction.controls; }

  async SaveData_ApprovedCampus()
  {
    this.nonApproveValidator();

    this.isSubmitted = true;

    if (this.formAction.invalid) {
      return
    }

    this.requestAction.UserID = this.sSOLoginDataModel.UserID;

    //Show Loading
   


    this.loaderService.requestStarted();
    try {
      await this.ApplicationService.SaveItiworkflow(this.requestAction)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message);
            await this.CloseModalPopup();
            this.router.navigate(['/ItiPlanningList'])
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
      }, 200);
    }
  }




}
