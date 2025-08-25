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
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { ItiReportDataModel } from '../../../../Models/ITI/ItiReportDataModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ITIsService } from '../../../../Services/ITIs/itis.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2'

import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { DeferBlockBehavior } from '@angular/core/testing';
import html2canvas from 'html2canvas';
import { ITI_InstructorDataModel, ITI_InstructorGridDataSearchModel } from '../../../../Models/ITI/ItiInstructorDataModel';
import { ITI_InstructorService } from '../../../../Services/ITI/ITI_Instructor/ITI_Instructor.Service';

@Component({
  selector: 'app-main-iti-instructor',
  standalone: false,
  templateUrl: './main-iti-instructor-form.component.html',
  styleUrl: './main-iti-instructor-form.component.css'
})
export class MainItiInstructorFormComponent {

  public urlId:number=0;
  public InstructorForm!: FormGroup
  public ResidenceList: any = []
  public CompanyMasterDDLList: any[] = [];
  public DistrictMasterList: any[] = [];
  public StateMasterList: any[] = [];
  public DistrictMasterList3: any[] = [];
  public BoardList: any = []
  closeResult: string | undefined;
  public request = new ITI_InstructorGridDataSearchModel();
  public isShowGrid: boolean = false;
  public InstructorDetailsModelList: any = [];
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
  public TehsilMasterList2: any = [];
  public SubDivisionMasterList: any = [];
  public CityMasterDDLList: any = [];
  public PanchayatSamitiList: any = [];
  public GramPanchayatList: any = [];
  public ItiMemberPostList: any = [];
  public DISCOM: any = [];
  public VillageList: any = [];
  public searchModel: ITI_InstructorGridDataSearchModel = new ITI_InstructorGridDataSearchModel();

  // @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public Collegeid: number = 0
  public Type: number = 0
  public applicationNo: string = '';
  // @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
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
    private ItiInstructorService:ITI_InstructorService
  ) { }

  async ngOnInit() {

    this.InstructorForm = this.formBuilder.group(
    {
       // Personal Details
      Uid: ['', Validators.required],
      Name: ['', Validators.required],
      FatherOrHusbandName: [''],
      MotherName: [''],
      Dob: [''],
      Gender: [''],
      MaritalStatus: [''],
      Category: [''],
      Mobile: ['', Validators.pattern(GlobalConstants.MobileNumberPattern)],
      Email: ['',Validators.pattern(GlobalConstants.EmailPattern)],

      // Permanent Address
      PlotHouseBuildingNo: ['', Validators.required],
      StreetRoadLane: ['', Validators.required],
      AreaLocalitySector: ['', Validators.required],
      LandMark: ['',Validators.required],
      ddlState: [''],
      ddlDistrict: [''],
      PropTehsilID: [''],
      PropUrbanRural: [''],
      City: [''],
      villageID: [''],
      pincode: ['', [Validators.pattern('^[0-9]{6}$')]],
      //  pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],

      // Correspondence Address
      Correspondence_PlotHouseBuildingNo: ['', Validators.required],
      Correspondence_StreetRoadLane: ['', Validators.required],
      Correspondence_AreaLocalitySector: ['', Validators.required],
      Correspondence_LandMark: ['',Validators.required],
      Correspondence_ddlState: [''],
      Correspondence_ddlDistrict: [''],
      Correspondence_PropTehsilID: [''],
      Correspondence_PropUrbanRural: [''],
      Correspondence_City: [''],
      Correspondence_villageID: [''],
      Correspondence_pincode: ['', [Validators.pattern('^[0-9]{6}$')]],

      // Educational Qualification
      Education_Exam: [''],
      Education_Board: [''],
      Education_Year: ['', Validators.pattern('^[0-9]{4}$')],
      Education_Subjects: [''],
      Education_Percentage: ['', [Validators.min(0), Validators.max(100)]],

      // Technical Qualification
      Tech_Exam: [''],
      Tech_Board: [''],
      Tech_Subjects: [''],
      Tech_Year: ['', [ Validators.pattern('^[0-9]{4}$')]],
      Tech_Percentage: ['', [ Validators.min(0), Validators.max(100)]],

      // Employment Details
      Pan_No: [''],
      Employee_Type: [''],
      Employer_Name: [''],
      Employer_Address: [''],
      Tan_No: [''],
      Employment_From: [''],
      Employment_To: [''],
      Basic_Pay: ['', [Validators.min(0)]]
      });


    //await this.onSearchClickAllotListITI();

 
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.searchrequest.SSOID = this.sSOLoginDataModel.SSOID
    //this.searchrequest.DepartmentID = EnumDepartment.BTER;
    //this.request.DepartmentID = EnumDepartment.BTER;
    /*    this.HRManagerID = Number(this.activatedRoute.snapshot.queryParamMap.get('HRManagerID')?.toString());*/

    //await this.loadDropdownData('Board')
    //await this.GetStateMatserDDL()
    //await this.GetPassingYearDDL()

    //this.request.CollegeName = this.sSOLoginDataModel.InstituteName


    let idParam = Number(this.activatedRoute.snapshot.paramMap.get('id')?.toString());
    this.urlId=idParam;
    // const Type = this.activatedRoute.snapshot.queryParamMap.get('Type');
    // this.Collegeid = Number(idParam);
    // if (!idParam || isNaN(this.Collegeid)) {
    //   this.Collegeid = 0;


    // }
    // this.Type = Number(Type);
    // if (!idParam || isNaN(this.Type)) {
    //   this.Type = 0;
    // }

   
    // if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || this.sSOLoginDataModel.RoleID == EnumRole.Principal_NCVT) {
    //   this.request.CollegeId = this.sSOLoginDataModel.InstituteID
    // } else {
    //   this.request.CollegeId = this.Collegeid

    // }


    // if (this.request.CollegeId > 0) {
    //   await this.GetById(this.request.CollegeId)
    //   if (this.Type != 1) {
    //     if (this.request.Status == 2 && this.sSOLoginDataModel.RoleID != EnumRole.DTETraing || this.request.Status == 3 && this.sSOLoginDataModel.RoleID != EnumRole.DTETraing) {
    //       window.open("/ItiPlanningList?id=" + this.sSOLoginDataModel.InstituteID, "_Self")
    //     }
    //   }
      
    // }

    this.GetInstituteCategoryList();
    this.GetManagmentType();
    this.GetStateMaterData()

    this.GetLateralCourse()
    //console.log("meri id hai ye",idParam)
    //await this.GetById(idParam);



//     this.InstructorForm.patchValue(JSON.parse(`{
//     "Uid": "sdsd",
//     "Name": "sdsd",
//     "FatherOrHusbandName": "sdsd",
//     "MotherName": "sdsd",
//     "Dob": "2025-07-19",
//     "Gender": "Male",
//     "MaritalStatus": "Married",
//     "Category": "OBC",
//     "Mobile": 9876534564,
//     "Email": "1212121@gmail.com",
//     "PlotHouseBuildingNo": "ss",
//     "StreetRoadLane": "ssd",
//     "AreaLocalitySector": "sdsd",
//     "LandMark": "sdsd",
//     "ddlState": "6",
//     "ddlDistrict": "21",
//     "PropTehsilID": "190",
//     "PropUrbanRural": "",
//     "City": "dsds",
//     "villageID": "",
//     "pincode": 659856,
//     "Correspondence_PlotHouseBuildingNo": "sdsd",
//     "Correspondence_StreetRoadLane": "sdsd",
//     "Correspondence_AreaLocalitySector": "sdsd",
//     "Correspondence_LandMark": "ssd",
//     "Correspondence_ddlState": "6",
//     "Correspondence_ddlDistrict": "6",
//     "Correspondence_PropTehsilID": "46",
//     "Correspondence_PropUrbanRural": "",
//     "Correspondence_City": "sdsd",
//     "Correspondence_villageID": "",
//     "Correspondence_pincode": 987456,
//     "Education_Exam": "sdsd",
//     "Education_Board": "sdsd",
//     "Education_Year": 2020,
//     "Education_Subjects": "sdsd",
//     "Education_Percentage": 98,
//     "Tech_Exam": "sdsd",
//     "Tech_Board": "dsd",
//     "Tech_Subjects": "sdsds",
//     "Tech_Year": 2024,
//     "Tech_Percentage": 65,
//     "Pan_No": "sdsd",
//     "Employee_Type": "Regular",
//     "Employer_Name": "sdsd",
//     "Employer_Address": "sdsd",
//     "Tan_No": "sdsds",
//     "Employment_From": "2025-07-26",
//     "Employment_To": "2025-07-26",
//     "Basic_Pay": 98745632145,
//     "CreatedBy": "240",
//     "DepartmentID": "2"
// }`))
  }

  get _InstructorForm() { return this.InstructorForm.controls; }


  // get minValidUpToDate(): string | null {
  //   if (this.request.AgreementLeaseDate) {
  //     const agreementDate = new Date(this.request.AgreementLeaseDate);
  //     agreementDate.setFullYear(agreementDate.getFullYear() + 5);
  //     return agreementDate.toISOString().split('T')[0]; // Format: yyyy-MM-dd
  //   }
  //   return null;
  // }


  // setMinDate(): void {
  //   const today = new Date();
  //   this.minDate = today.toISOString().split('T')[0];
  // }


  // async GetGramPanchayatSamiti() {
  //   try {
  //     if (this.request.PropUrbanRural == 75) {
  //       this.request.GramPanchayatSamiti = 0
  //       return
  //     }

  //     this.loaderService.requestStarted();
  //     await this.commonMasterService.GramPanchayat(this.request.PropTehsilID)
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));

  //         this.GramPanchayatList = data['Data'];

  //         // console.log(this.DivisionMasterList)
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
  // }


  // async GetPanchayatSamiti() {
  //   try {
  //     if (this.request.PropUrbanRural == 75) {
  //       return
  //     }
  //     this.loaderService.requestStarted();
  //     await this.commonMasterService.PanchayatSamiti(this.request.PropDistrictID)
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));

  //         this.PanchayatSamitiList = data['Data'];

  //         // console.log(this.DivisionMasterList)
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
  // }


  // async villageMaster() {
  //   try {
  //     if (this.request.PropUrbanRural == 75) {
  //       this.request.villageID = '0';
  //       return
  //     }

  //     this.loaderService.requestStarted();
  //   //   await this.commonMasterService.villageMaster(this.request.GramPanchayatSamiti)
  //   //     .then((data: any) => {
  //   //       data = JSON.parse(JSON.stringify(data));

  //   //       this.VillageList = data['Data'];
  //   //  /*     console.log(this.ParliamentMasterList)*/
  //   //       // console.log(this.DivisionMasterList)
  //   //     }, error => console.error(error));
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  // async GetcOmmonData() {
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.commonMasterService.GetCommonMasterDDLByType('DISCOM')
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         this.DISCOM = data['Data'];
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
  // }

  // async GetVillageData() {
  //  try {
  //    if (this.request.PropUrbanRural == 75) {
  //      return
  //    }
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
  // }


  // async GetDivisionMasterList() {
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.commonMasterService.GetDivisionMaster()
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         this.DivisionMasterList = data['Data'];
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
  // }



  async onSearchClickAllotListITI() {

    if (!this.request.ApplicationID || this.request.ApplicationID == '') {
      this.toastr.warning('Please enter Application No.');
      return;
    }

    this.isShowGrid = true;

    try {
      this.loaderService.requestStarted();
      await this.ItiInstructorService.GetGridInstructorData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {


            if (data.Data[0]) {
              console.log("data", data.Data[0] );

              this.InstructorDetailsModelList = data['Data'];

              console.log("studentlist", this.InstructorDetailsModelList);

              if (this.InstructorDetailsModelList.length > 0) {
                this.isShowGrid = true;
              } else {
                this.isShowGrid = false;
              }

            } else {
              this.toastr.error(data.Data[0].MSG);
            }
          } else {
          }
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  onResetClick() {
    this.request = new ITI_InstructorGridDataSearchModel();
    this.InstructorDetailsModelList = [];
    this.isShowGrid = false;
  }


  onViewDetail(ID: any): void {
    console.log("item", ID);
    this.router.navigate(['/ItiInstructorForm', ID]);
  }


  async ddlDistrict_Change() {

    try {
      this.loaderService.requestStarted();

      // let InstituteDistrictID: number = Number(this.InstructorForm.value.ddlDistrict) ?? 0;

      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.InstructorForm.value.ddlDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterList = data['Data'];

        }, error => console.error(error));
      // await this.commonMasterService.SubDivisionMaster_DistrictIDWise(InstituteDistrictID)
      //   .then((data: any) => {
      //     data = JSON.parse(JSON.stringify(data));
      //     this.SubDivisionMasterList = data['Data'];
      //     console.log(this.SubDivisionMasterList, "SubDivisionMasterList")
      //   }, error => console.error(error));

      //await this.commonMasterService.AssemblyMaster_DistrictIDWise(this.request.DistrictId)
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    this.AssemblyMasterList = data['Data'];
      //    console.log(this.AssemblyMasterList, "AssemblyMasterList")
      //  }, error => console.error(error));

      await this.commonMasterService.CityMasterDistrictWise(this.InstructorForm.value.ddlDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CityMasterDDLList = data['Data'];
          console.log(this.CityMasterDDLList, "CityMasterDDLList")
        }, error => console.error(error));

      // await this.commonMasterService.PanchayatSamiti(InstituteDistrictID)
      //   .then((data: any) => {
      //     data = JSON.parse(JSON.stringify(data));
      //     this.State = data['State'];
      //     this.Message = data['Message'];
      //     this.ErrorMessage = data['ErrorMessage'];
      //     this.PanchayatSamitiList = data['Data'];
   
      //   }, error => console.error(error));

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

      // let InstituteDistrictID: number = Number(this.InstructorForm.value.ddlDistrict) ?? 0;

      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.InstructorForm.value.Correspondence_ddlDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterList2 = data['Data'];

        }, error => console.error(error));
      // await this.commonMasterService.SubDivisionMaster_DistrictIDWise(InstituteDistrictID)
      //   .then((data: any) => {
      //     data = JSON.parse(JSON.stringify(data));
      //     this.SubDivisionMasterList = data['Data'];
      //     console.log(this.SubDivisionMasterList, "SubDivisionMasterList")
      //   }, error => console.error(error));

      //await this.commonMasterService.AssemblyMaster_DistrictIDWise(this.request.DistrictId)
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    this.AssemblyMasterList = data['Data'];
      //    console.log(this.AssemblyMasterList, "AssemblyMasterList")
      //  }, error => console.error(error));

      await this.commonMasterService.CityMasterDistrictWise(this.InstructorForm.value.ddlDistrict)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CityMasterDDLList = data['Data'];
          console.log(this.CityMasterDDLList, "CityMasterDDLList")
        }, error => console.error(error));

      // await this.commonMasterService.PanchayatSamiti(InstituteDistrictID)
      //   .then((data: any) => {
      //     data = JSON.parse(JSON.stringify(data));
      //     this.State = data['State'];
      //     this.Message = data['Message'];
      //     this.ErrorMessage = data['ErrorMessage'];
      //     this.PanchayatSamitiList = data['Data'];
   
      //   }, error => console.error(error));

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


  // async ItiMemberPost() {
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.commonMasterService.GetCommonMasterData('ItiMemberPost')
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         console.log(data, 'ggg');
  //         this.ItiMemberPostList = data['Data'];

  //       }, (error: any) => console.error(error)
  //       );
  //   }
  //   catch (ex) {
  //     console.log(ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  // async ddlDivision_Change() {
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.commonMasterService.DistrictMaster_DivisionIDWise(this.request.InstituteDivisionID)
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.DistrictMasterList1 = data['Data'];
  //       }, error => console.error(error));
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 2000);
  //   }
  // }


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
    console.log("State changed - (", this.InstructorForm.value.ddlState , ")");
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

  onReset():void{
    this.InstructorForm.reset();
  }

   


  // public file!: File;

  // async onFilechange(event: any, Type: string) {
  //   try {

  //     this.file = event.target.files[0];
  //     if (this.file) {

  //       //if (!this.validateFileName(this.file.name))
  //       //{
  //       //  this.toastr.error('Invalid file name. Please remove special characters from file');
  //       //  return;
  //       //}
  //       // Type validation
  //       if (['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(this.file.type)) {
  //         // Size validation
  //         if (this.file.size > 2000000) {
  //           this.toastr.error('Select less than 2MB File');
  //           return;
  //         }
  //       }
  //       else {
  //         this.toastr.error('Select Only jpeg/jpg/png file');
  //         return;
  //       }

  //       //if (this.file.name.split('.').length > 2)
  //       //{
  //       //  this.toastr.error('Invalid file name. Please remove extra . from file');
  //       //  return ;
  //       //}



  //       // Upload to server folder
  //       this.loaderService.requestStarted();
  //       await this.commonMasterService.UploadDocument(this.file)
  //         .then((data: any) => {
  //           data = JSON.parse(JSON.stringify(data));
  //           console.log("photo data", data);
  //           if (data.State === EnumStatus.Success) {





  //             switch (Type) {
  //               case "RegFileName":

  //                 this.request.RegFileName = data['Data'][0]["FileName"];
  //                 this.request.RegDisFileName = data['Data'][0]["Dis_FileName"];

  //                 break;
  //               case "IDFileName":

  //                 this.member.IDFileName = data['Data'][0]["FileName"];
  //                 this.member.IDdis_Filename = data['Data'][0]["Dis_FileName"];
  //                 break;
  //               case "MemberIdProofName":

  //                 this.request.MemberIdProofName = data['Data'][0]["FileName"];
  //                 this.request.MemberIdDisProofName = data['Data'][0]["Dis_FileName"];

  //                 break;
  //               case "AgreementFileName":
  //                 this.request.AgreementFileName = data['Data'][0]["FileName"];
  //                 this.request.AgreementDisFileName = data['Data'][0]["Dis_FileName"];

  //                 break;
  //               case "LatLongFileName":
  //                 this.request.LatLongFileName = data['Data'][0]["FileName"];
  //                 this.request.LatLongDisFileName = data['Data'][0]["Dis_FileName"];


  //                 break;
  //               case "Bill_Filename":
  //                 this.request.Bill_Filename = data['Data'][0]["FileName"];
  //                 this.request.Bill_DisFilename = data['Data'][0]["FileName"];


  //                 break;
  //               case "FileName":
  //                 this.addmore.FileName = data['Data'][0]["FileName"];
  //                 this.addmore.Dis_Filename = data['Data'][0]["FileName"];


                 

  //                 break;
  //               default:
  //                 break;
  //             }
  //           }
  //           event.target.value = null;
  //           if (data.State === EnumStatus.Error) {
  //             this.toastr.error(data.ErrorMessage);

  //           } else if (data.State === EnumStatus.Warning) {
  //             this.toastr.warning(data.ErrorMessage);
  //           }
  //         });
  //     }
  //   } catch (Ex) {
  //     console.log(Ex);
  //   } finally {
  //     this.loaderService.requestEnded();
  //   }
  // }


// onSubmit(): void {
//     if (this.ReportForm.valid) {
//       console.log('Form Submitted', this.ReportForm.value);
//       // You can replace this with API call
//     } else {
//       console.log('Form is invalid');
//       this.ReportForm.markAllAsTouched();
//     }
//   }



  //  async onSubmit() {


  //  console.log('Form submitted:iinstructor', this.InstructorForm.value);
  //  this.isLoading = true;
  //  this.isSubmitted = true;
  //  //Show Loading
  //  this.loaderService.requestStarted();

  //  try {
  //    if (this.InstructorForm.valid) {
  //      // Handle form submission logic here

  //      // debugger;
  //      console.log('Form submitted successfully:', this.InstructorForm.value);
  //      // this.request.CopyPacket = this.RelievingPracticalForm.value.CopyPacket === 'Yes' ? true : false;
  //      // this.request.Uid = this.InstructorForm.value.Uid;

  //      this.request = this.InstructorForm.value as ITI_InstructorDataModel;
  //      this.request.id=this.urlId;
  //      console.log('Form Submitted:request', this.request);
  //      this.request.CreatedBy = this.sSOLoginDataModel.UserID.toString();
  //      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID.toString();
  //      // this.request.InstituteID=this.sSOLoginDataModel.InstituteID;
  //      this.request.InstituteID=1;

  //      await this.ItiInstructorService.SaveInstructorData(this.request)
  //        .then((response: any) => {
  //          this.State = response['State'];
  //          this.Message = response['Message'];
  //          this.ErrorMessage = response['ErrorMessage'];

  //          if (this.State == EnumStatus.Success)
  //          {
  //            this.toastr.success(this.Message);
  //            // setTimeout(() => {
  //              // this.router.navigate(['/PracticalExaminerRelieving']);
  //            // }, 300);
  //          }
  //          else {
  //            this.toastr.error(this.ErrorMessage)
  //          }
  //          console.log('Response from service:', response);
  //        });
  //      console.log('Request Data:', this.request);
  //    } else {
  //      console.log('Form is invalid');
  //      this.InstructorForm.markAllAsTouched();
  //    }
  //  }
  //  catch (ex) { console.log(ex) }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //      this.isLoading = false;

  //    }, 200);
  //  }

  //}


//   async SaveData(Status:number=0) {
   
//     this.nonItiValidator()

// /*    this.request.CollegeId=2227*/
//     try {
//       this.isSubmitted = true;

//       // if (this.request.InstituteManagementId == 5) {
//       //   if (this.InstructorForm.invalid) {
//       //     return
//       //   }
//       // }
  

//       // if (this.request.InstituteManagementId == 5 && this.request.RegFileName == '') {
//       //   this.toastr.error("Please Upload Registration Document")
//       //   return
//       // }



//       // if (this.request.Bill_Filename == '') {
//       //   this.toastr.error("Please Upload Last Month Electricity")
//       //   return
//       // }


//       // if (this.request.LatLongFileName == '') {
//       //   this.toastr.error("Please Upload Lat/Long* (along with college gate photo)")
//       //   return
//       // }

//       if (this.request.OwnerShipID == 1 && this.request.AgreementFileName =='') {
//         this.toastr.error("Please Upload Rent Agreement Document")
//         return
//       }
//       if (this.request.OwnerShipID == 2 && this.request.AgreementFileName == '') {
//         this.toastr.error("Please Upload Owned Property  Document")
//         return
//       }

//       if (this.request.InstituteManagementId == 0) {
//         this.toastr.warning("Please Select Management Type")
//         return
//       }
     
//         if (this.InstructorForm.invalid) {
//           return
//         }


//       if (this.request.InstituteManagementId == 5 && this.request.LastElectionDate == '') {
//         this.toastr.error("Please Enter Date of Last Election")
//         return
//       }

//       if (this.request.InstituteManagementId == 5 && this.request.LastElectionValidUpTo == '') {
//         this.toastr.error("Please Add Date of Last Election Vaid Upto")
//         return
//       }


//       if (this.request.ItiAffiliationList.length < 1) {
//         this.toastr.error("Please Add Affiliation Details")
//         return
//       }


//       if (this.request.ItiMembersModel.length < 1 && this.request.InstituteManagementId==5) {
//         this.toastr.error("Please Add Members Details")
//         return
//       }

//       if (this.request.InstituteManagementId == 5 && this.request.MemberIdProofName == '') {
//         this.toastr.error("Please Upload Member Document")
//         return
//       }



//       if (this.request.OwnerShipID == 2) {
//         this.request.AgreementLeaseDate = ''
//         this.request.ValidUpToLeaseDate = ''
//         this.request.InstituteRegOffice = ''
//         this.request.InstituteDistrictID = 0
//         //this.request.AgreementFileName = ''
//         //this.request.AgreementDisFileName = ''
//       }

//       if (this.request.PropUrbanRural == 75) {
//         this.request.PanchayatSamiti = 0
//         this.request.GramPanchayatSamiti = 0
//         this.request.VillageID = 0
//       } else {
//         this.request.CityID = 0
//         this.request.AdministrativeBodyId = 0
//       }


//       // if (!this.validateLeaseDates()) {
//       //   return; // prevent form submission or save
//       // }



//       if (this.request.InstituteManagementId == 1) {
//         this.request.ItiMembersModel = []
//         this.request.TrustSociety = 0
//         this.request.TrustSocietyName = ''
//         this.request.RegNo = ''
//         this.request.RegDate = ''
//         this.request.RegFileName = ''
//         this.request.RegDisFileName = ''
//         this.request.RegOfficeDistrictID = 0
//         this.request.RegOfficeStateID = 0
//    /*     this.request.InstituteRegOffice = ''*/
// /*        this.request.InstituteRegOffice = ''*/
//       }
//       console.log(this.request) 
//       this.isLoading = true;
//       this.loaderService.requestStarted();

//       this.request.ModifyBy = this.sSOLoginDataModel.UserID;
//       this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
//       this.request.CollegeId = this.sSOLoginDataModel.InstituteID
//       this.request.Status=Status
//       //save
//       await this.ApplicationService.SaveDataPlanning(this.request)
//         .then((data: any) => {
//           data = JSON.parse(JSON.stringify(data));

//           if (data.State == EnumStatus.Success) {
//             this.toastr.success(data.Message)
//             this.router.navigate(['/ItiPlanning']);
//             // this.GetById(this.request.CollegeId)
            
//             if (this.request.Status == 2) {
//                window.open("/ItiPlanningList?id=" + this.sSOLoginDataModel.InstituteID, "_Self")
//             }
//             /* this.routers.navigate(['/Hrmaster']);*/

//           }
//           else {
//             this.toastr.error(data.ErrorMessage)
//           }

//         }, (error: any) => console.error(error)
//         );
//     } catch (ex) {
//       console.log(ex);
//     } finally {
//       setTimeout(() => {
//         this.loaderService.requestEnded();
//       }, 2000);
//     }
//   }





  // nonItiValidator() {
  //   if (this.request.PropUrbanRural == 76) {
  //     this.InstructorForm.controls['CityID'].clearValidators();
  //     // this.AddressFormGroup.controls['AdministrativeBodyId'].clearValidators();
  //     this.InstructorForm.controls['village'].setValidators([DropdownValidators]);
  //     // this.AddressFormGroup.controls['GramPanchayatSamiti'].setValidators([DropdownValidators]);
  //     // this.AddressFormGroup.controls['PanchayatSamiti'].setValidators([DropdownValidators]);
  //   } else {
  //     this.InstructorForm.controls['CityID'].setValidators([DropdownValidators]);
  //     this.InstructorForm.controls['village'].clearValidators();
  //   }
  //   this.InstructorForm.controls['CityID'].updateValueAndValidity();
  //   // this.AddressFormGroup.controls['AdministrativeBodyId'].updateValueAndValidity();
  //   this.InstructorForm.controls['village'].updateValueAndValidity();
  // }


 //async GetById(ID: number) {
 //   try {
  
 //     // this.request.ItiAffiliationList = []
 //     // this.request.ItiMembersModel=[]
 //     this.loaderService.requestStarted();
 //     const data: any = await this.ItiInstructorService.GetInstructorDataByID(ID);
 //     const parsedData = JSON.parse(JSON.stringify(data));
 //     console.log("parseddata",parsedData);
 //     this.InstructorForm.patchValue(parsedData);


 //       await this.ItiInstructorService.GetInstructorDataByID(ID)
 //         .then(async (data: any) => {
 //                   data = JSON.parse(JSON.stringify(data));
 //                   this.request = data.Data[0];
 //                   const parsedData = JSON.parse(JSON.stringify(data));
 //                   data.Data[0].Employment_From=data.Data[0].Employment_From.slice(0,10);
 //                   data.Data[0].Employment_To=data.Data[0].Employment_To.slice(0,10);
 //                   data.Data[0].Dob=data.Data[0].Dob.slice(0,10);
 //                   data.Data[0].CreatedAt=data.Data[0].CreatedAt.slice(0,10);
 //                   this.InstructorForm.patchValue(data.Data[0]);
 //                   await this.ddlState_Change2();
 //                   await this.ddlState_Change();
 //                   await this.ddlDistrict_Change();
 //                   await this.ddlDistrict_Change2();

 //               }, (error: any) => console.error(error));
 //       console.log('Request Data:', this.request);

      // if (parsedData['Data'] != null) {
        // this.request = parsedData['Data'];
        // await this.ddlState_Change2()
        // this.request.InstituteDivisionID = parsedData['Data']["InstituteDivisionID"]
        // await this.ddlDivision_Change()
        // this.request.PropDistrictID = parsedData['Data']["PropDistrictID"]
        // await this.ddlDistrict_Change()
        // this.request.InstituteSubDivisionID = parsedData['Data']["InstituteSubDivisionID"]
        // this.request.PropTehsilID = parsedData['Data']["PropTehsilID"]
        // this.request.CityID = parsedData['Data']["CityID"]
        // await this.ddlState_Change()
        // if (this.request.PropUrbanRural == 76) {
        //   await this.GetGramPanchayatSamiti();
        // }
        
      // }
      //// Assign default values for null or undefined fields
      // Object.keys(this.request).forEach((key) => {
      //   const value = this.request[key as keyof ITI_PlanningCollegesModel];

      //   if (value === null || value === undefined) {
      //     // Default to '' if string, 0 if number
      //     if (typeof this.request[key as keyof ITI_PlanningCollegesModel] === 'number') {
      //       (this.request as any)[key] = 0;
      //     } else {
      //       (this.request as any)[key] = '';
      //     }
      //   }
      // })
      // if (this.request.ItiAffiliationList == null || this.request.ItiAffiliationList == undefined) {
      //   this.request.ItiAffiliationList=[]
      // }

      // if (this.request.ItiMembersModel == null || this.request.ItiMembersModel == undefined) {
      //   this.request.ItiMembersModel = [];
      // }
      //if (this.request.ItiMembersModel.length > 0) {
      //  this.ItiMemberPost()
      //  this.request.ItiMembersModel.forEach((member) => {
      //    

      //       this.member.PostName = this.ItiMemberPostList.filter((x: any) => x.ID == this.member.PostID)[0]['Name'];
      //  });

      //}
      // if (this.request.PropUrbanRural == 76) {

      
/*        this.GetGramPanchayatSamiti()*/
      //   this.villageMaster()
      // } 
      
      //});
      //if (data['Data']['CollegeName'] == null) {
      //  this.request.CollegeName=''
      //}
      // Optional: override with login data
      /*     this.request.CollegeName = this.sSOLoginDataModel.InstituteName;*/

      /*    Format specific date fields*/
      // const dateFields: (keyof ITI_PlanningCollegesModel)[] = [
      //   'AgreementLeaseDate', 'LastElectionDate', 'ValidUpToLeaseDate',
      //   'RegDate', 'LastElectionValidUpTo'
      // ];

      // dateFields.forEach((field) => {
      //   const value = this.request[field];
      //   if (value) {
      //     const rawDate = new Date(value as string);
      //     const year = rawDate.getFullYear();
      //     const month = String(rawDate.getMonth() + 1).padStart(2, '0');
      //     const day = String(rawDate.getDate()).padStart(2, '0');
      //     (this.request as any)[field] = `${year}-${month}-${day}`;
      //   }
      // });
/*      this.request.InstituteManagementId=5*/

      // console.log(parsedData,"dsw");
  //  } catch (ex) {
  //    console.log(ex);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 2000);
  //  }
  //}

  //async resetrow() {
  //  this.isSubmitted = false
  //  this.request = new ItiReportDataModel()
  //  this.request.CollegeID = this.sSOLoginDataModel.InstituteID
  //  this.request.CollegeName = this.sSOLoginDataModel.InstituteName
  //}

  async changeUrbanRural() {
    // this.GetGramPanchayatSamiti()
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


  // openOTP() {
  //   this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
  //   this.childComponent.OpenOTPPopup();

  //   this.childComponent.onVerified.subscribe(() => {
  //     //this.PublishTimeTable();
  //     this.SaveData(2);
  //   })
  // }


}
