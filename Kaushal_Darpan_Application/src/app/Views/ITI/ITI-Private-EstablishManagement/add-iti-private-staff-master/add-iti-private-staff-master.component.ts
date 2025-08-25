import { Component, OnInit, ViewChild } from '@angular/core';
import { ITIPrivateEstablish_AddStaffBasicDetailDataModel, ITIPrivateEstablish_StaffDetailsDataModel, ITIPrivateEstablish_StaffMasterSearchModel, ITIPrivateEstablish_StaffSubjectList, ITIPrivateEstablish_Staff_EduQualificationDetailsModel } from '../../../../Models/ITIPrivateEstablishDataModel';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ITIPrivateEstablishService } from '../../../../Services/ITI/ITIPrivateEstablish/ITI-Private-Establish.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDistrictMaster_StateIDWiseDataModel, IStateMasterDataModel, ItiTradeSearchModel, QualificationDDLDataModel, StreamDDL_InstituteWiseModel } from '../../../../Models/CommonMasterDataModel';
import { RoleMasterService } from '../../../../Services/RoleMaster/role-master.service';
import { DesignationMasterService } from '../../../../Services/DesignationMaster/Designation-master.service';
import { StreamMasterService } from '../../../../Services/BranchesMaster/branches-master.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { EnumDepartment, EnumRole, EnumStatus, EnumStatusOfStaff, GlobalConstants } from '../../../../Common/GlobalConstants';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import {  EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { AddStaffBasicDetailDataModel,  StaffMasterSearchModel } from '../../../../Models/StaffMasterDataModel';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';

@Component({
  selector: 'app-add-iti-private-staff-master',
  templateUrl: './add-iti-private-staff-master.component.html',
  styleUrls: ['./add-iti-private-staff-master.component.css'],
    standalone: false
})
export class AddItiPrivateStaffMasterComponent implements OnInit {

  public StaffMasterFormGroup!: FormGroup;
  public EduQualificationFormGroup!: FormGroup;
  public AddsubjectFormGroup!: FormGroup;
  EducationalQualificationFormData = new ITIPrivateEstablish_Staff_EduQualificationDetailsModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  staffDetailsFormData = new ITIPrivateEstablish_StaffDetailsDataModel();
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isAddrequest: boolean = false;
  public isEduFormSubmitted: boolean = false;
  public StateMasterList: IStateMasterDataModel[] = []
  public AddedChoices: ITIPrivateEstablish_StaffSubjectList[] = []
  public StreamTypeList: any = []
  public DistrictMasterList: IDistrictMaster_StateIDWiseDataModel[] = []
  public RoleMasterList: any = []
  public DesignationMasterList: any = []
  public filterDesignation: any = []
  public BranchesMasterList: any = []
  public SubjectMasterDDL: any = []
  public FinalcialList: any = []
  public State: number = 0;
  public ShowAllSemester: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public StaffID: number = 0
  public StaffType: any = []
  modalReference: NgbModalRef | undefined;
  isListVisible: boolean = false;
  public isModalOpen = false;
  public _GlobalConstants: any = GlobalConstants;
  
  _EnumRole = EnumRole;
  qualificationSearchReq = new QualificationDDLDataModel()
  public PGQualificationList: any =[]
  public UGQualificationList: any =[]
  _EnumStatusOfStaff = EnumStatusOfStaff
  public StreamSearch = new StreamDDL_InstituteWiseModel()
  tradeSearchRequest =new ItiTradeSearchModel();

  public CourseMasterDDL: any = [];
  public IsExaminer: boolean=false
  public IsOptional: boolean=false
  public Addrequest = new ITIPrivateEstablish_StaffSubjectList() 
  public InstituteMasterDDLList: any = []
  public DistrictMasterDDLList: any = []
  public DivisionMasterDDLList: any = []
  public TehsilMasterDDLList: any = []
  _enumDepartment = EnumDepartment
  public StaffLevelChildList: any = [];
  public ExamTypeList: any = [];
  public SemesterList: any = [];
  public ITITradeSchemeList: any = [];
  public TradeMasterList: any = [];


  public StaffParentID: number = 0;

  public formData = new ITIPrivateEstablish_AddStaffBasicDetailDataModel();
  public searchRequest = new ITIPrivateEstablish_StaffMasterSearchModel();
  public isReadOnly: boolean = false;
  public isDisabled: boolean = false;
  public todayDate: string = this.formatDate(new Date());
  public ExamTypeHeading = '';
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
 
  //modalReference: NgbModalRef | undefined;
  //public isModalOpen = false;
  //isListVisible: boolean = false;

  constructor(
    private ITIPrivateEstablishService: ITIPrivateEstablishService,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    public appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
    private encryptionService: EncryptionService,
   

  ) {
   

  }


  

  async ngOnInit()
  {
    this.StaffMasterFormGroup = this.formBuilder.group({
      txtName: ['', [Validators.required]],
      //txtEmail: ['', Validators.required],
      txtEmail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/),
          Validators.maxLength(40)
        ]
      ],

      txtMobileNumber: ['', [Validators.required]],
      txtDateOfBirth: ['', [Validators.required]],
      ddlHighestQualification: ['', [Validators.required]],
      ddlRoleID: ['', [DropdownValidators]],
      ddlDesignationID: ['', [DropdownValidators]],

    
      ddlStaffTypeID: [0, [DropdownValidators]],
      txtSSOID: ['', [Validators.required]],

      txtAdharCardNumber: ['', [Validators.required]],
      txtPanCardNumber: ['', [Validators.required]],


      txtJoiningDate: ['', [Validators.required]],
      txtAppointmentDate: ['', [Validators.required]],
      Experience: ['', [Validators.required]],
      IsExaminer: [''],
     // ddlSpecializationSubjectID: ['', [DropdownValidators]],
      AnnualSalary: ['', [Validators.required]],
      StaffStatus: ['', [Validators.required]],
      PFDeduction: ['', [Validators.required]],
      ResearchGuide: ['', [Validators.required]],

      ddlStateID: ['', [DropdownValidators]],
      ddlDistrictID: ['', [DropdownValidators]],
      txtPincode: ['', [Validators.required]],
      txtAddress: ['', [Validators.required]],
      UGQualificationID: ['',[DropdownValidators]],
      PGQualificationID: ['',],
      PHDQualification: ['',],

      InstituteDistrictID: [{value:'', disabled: true}],
      InstituteDivisionID: [{value:'', disabled: true}],
      InstituteTehsilID: [{value:'', disabled: true}],
      InstituteID: [{value:'', disabled: true}],

      txtBankName: ['', [Validators.required]],
      txtBankAccountName: ['', [Validators.required]],
      txtBankAccountNo: ['', [Validators.required, Validators.pattern(GlobalConstants.AccountNoPattern)]],
      txtIFSCCode: [
        '',
        [
          Validators.required,
          Validators.pattern(GlobalConstants.IFSCPattern),

        ]
      ],
    });

    this.EduQualificationFormGroup = this.formBuilder.group({
      ddlQualification: ['', [DropdownValidators]],
      txtStream: ['', [DropdownValidators]],
      txtUniversity: ['', [Validators.required]],
      ddlPassingYear: ['', [DropdownValidators]],
      txtPercentageGrade: ['', [Validators.required]],
    })

    this.AddsubjectFormGroup = this.formBuilder.group({
      ddlCourse: ['', [DropdownValidators]],
      ddlSubjectID: ['', [DropdownValidators]],
      ddlSemesterID: ['', [DropdownValidators]],
      ddlExamType: ['', [DropdownValidators]],
      ddlStreamType: ['', [DropdownValidators]],
      IsOptional: [''],

      // ITICourse: ['', [DropdownValidators]],
      // ITISubjectID: ['', [DropdownValidators]],
      // ITISemesterID: ['', [DropdownValidators]],
      // ITIExamType: ['', [DropdownValidators]],
      // ITIStreamType: ['', [DropdownValidators]],
    })


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.staffDetailsFormData.ModifyBy = this.sSOLoginDataModel.UserID
    this.GetDesignationMasterData();
    // this.staffDetailsFormData.EduQualificationDetailsModel = []
    if (this.activatedRoute.snapshot.queryParamMap.get('id') != null) {
      this.StaffID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
      await this.GetByID(this.StaffID);
    }
    //else {
    //  await this.GetByID(this.sSOLoginDataModel.StaffID);
    //}

    this.GetTehsilMaster()
    this.GetDivisionMaster()
    this.GetDistrictMaster()
    this.getInstituteMasterList()
    this.GetQualificationDDL()
    this.getStreamMasterData();
    this.GetMasterData();
    this.GetRoleMasterData();

    this.GetBranchesMasterData();

  //  this.GetSubjectMasterDDL();
    await this.GetFinancialMasterDDL()
    this.GetStaffTypeDDL()
    

  }





  get _StaffMasterFormGroup() { return this.StaffMasterFormGroup.controls; }
  get _EduQualificationFormGroup() { return this.EduQualificationFormGroup.controls; }
  get _AddsubjectFormGroup() { return this.AddsubjectFormGroup.controls; }


  onClickCheckbox() {
    this.staffDetailsFormData.IsExaminer = !this.staffDetailsFormData.IsExaminer;
    if (!this.staffDetailsFormData.IsExaminer) {
      this.staffDetailsFormData.IsExaminer = false
    }
  }

  allowOnlyAlphabets(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode);
    if (!/^[a-zA-Z\s]*$/.test(inputChar)) {
      event.preventDefault(); // Block the character
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.key.charCodeAt(0);
    // Allow only digits (0–9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  filterNumber(value: string): string {
    return value.replace(/\D/g, ''); // Removes anything that's not a digit
  }



  validateJoiningDate(formGroup: AbstractControl) {
    const appointmentDate = formGroup.get('txtAppointmentDate')?.value;
    const joiningDate = formGroup.get('txtJoiningDate')?.value;

    if (!appointmentDate || !joiningDate) {
      return null; // Skip validation if either date is empty
    }

    return new Date(joiningDate) >= new Date(appointmentDate)
      ? null
      : { joiningBeforeAppointment: true };
  }

  checkoptional() {
    this.Addrequest.IsOptional = !this.Addrequest.IsOptional;
    if (!this.Addrequest.IsOptional) {
      this.Addrequest.IsOptional = false
    }
  }


 async OnFilterDesignation() {
    if (this.staffDetailsFormData.StaffTypeID == 30) {
      this.DesignationMasterList = this.filterDesignation.filter((e: any) => e.TypeID == 30)
    } else {
      this.DesignationMasterList = this.filterDesignation.filter((e: any) => e.TypeID == 31)
    }
  }

  async ChangeSemester() {
    
    try {
      
      this.loaderService.requestStarted();
      this.ShowAllSemester = this.Addrequest.ExamTypeID
      await this.commonMasterService.ChangeSemester(this.ShowAllSemester)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.SemesterList = data['Data'];
          if (this.sSOLoginDataModel.DepartmentID === EnumDepartment.ITI) {
            this.SemesterList = this.SemesterList.filter((x: any) => x.SemesterID != 5 && x.SemesterID != 6);
          }
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

  async GetMasterData() {
    
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.StateMasterList = data['Data'];
          console.log(this.StateMasterList);
        }, error => console.error(error));

      await this.commonMasterService.GetStreamType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.StreamTypeList = data['Data'];
          console.log(this.StateMasterList);
        }, error => console.error(error));
      await this.commonMasterService.GetExamType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.ExamTypeList = data['Data'];
          console.log(this.ExamTypeList,"ExamTypeList");
        }, error => console.error(error));
      //await this.commonMasterService.SemesterMaster()
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    console.log(data['Data']);
      //    this.SemesterList= data['Data'];
      //    if(this.sSOLoginDataModel.DepartmentID === EnumDepartment.ITI) {
      //      this.SemesterList = this.SemesterList.filter((x: any) => x.SemesterID != 5 && x.SemesterID != 6);
      //    }
      //    console.log(this.StateMasterList);
      //  }, error => console.error(error));

      await this.commonMasterService.GetCommonMasterData("IITTradeScheme").then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ITITradeSchemeList = parsedData.Data;
        console.log(this.ITITradeSchemeList, "ITITradeSchemeList")
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

  async getInstituteMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetDistrictMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DistrictMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetDivisionMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDivisionMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DivisionMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetTehsilMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetTehsilMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TehsilMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ddlState_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_StateIDWise(this.staffDetailsFormData.StateID)
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

  async GetRoleMasterData() {
    try {
   
      this.loaderService.requestStarted();
      await this.commonMasterService.GetRoleMasterDDL(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.RoleMasterList = data.Data;
        console.log("RoleMasterList", this.RoleMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetStaffTypeDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffType = data.Data;
        console.log("RoleMasterList", this.RoleMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetDesignationMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignationMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.filterDesignation = data.Data;
        console.log("DesignationMasterList", this.filterDesignation);
      }, error => console.error(error))
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetBranchesMasterData() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) =>
      {

        data = JSON.parse(JSON.stringify(data));
        this.BranchesMasterList = data.Data;
        console.log("StreamMasterList", this.BranchesMasterList);
      });

    }
    catch (error)
    {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetSubjectMasterDDL() {
   
    var DepartmentID = this.sSOLoginDataModel.DepartmentID
    
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SubjectMaster_StreamIDWise(this.Addrequest.BranchID, this.sSOLoginDataModel.DepartmentID,this.Addrequest.SemesterID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        
        this.SubjectMasterDDL = data.Data;
        console.log("SubjectMasterList", this.SubjectMasterDDL);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async GetFinancialMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetFinancialYear().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.FinalcialList = data.Data;
        console.log("FinalcialList", this.FinalcialList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetQualificationDDL() {
    
    try {
      this.loaderService.requestStarted();
      this.qualificationSearchReq.QualificationLevel = "PG"
      await this.commonMasterService.QualificationDDL(this.qualificationSearchReq).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.PGQualificationList = data.Data;
        console.log("PGQualificationList", this.PGQualificationList);
      })

      this.qualificationSearchReq.QualificationLevel = "UG"
      await this.commonMasterService.QualificationDDL(this.qualificationSearchReq).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.UGQualificationList = data.Data;
        console.log("UGQualificationList", this.UGQualificationList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  public file!: File;

  async LockandSubmit() {
   
    this.openOTP(); 

  }
  
  dateSetter(date: any){
    const Dateformat = new Date(date);
    const year = Dateformat.getFullYear();
    const month = String(Dateformat.getMonth() + 1).padStart(2, '0');
    const day = String(Dateformat.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }

 


  async GetByID(id: number) {
    
    try {
      
      this.loaderService.requestStarted();

      
      if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {

      }
      else {
        this.StaffMasterFormGroup.get('txtName')?.disable();
        this.StaffMasterFormGroup.get('txtSSOID')?.disable();
        this.StaffMasterFormGroup.get('ddlRoleID')?.disable();
        this.StaffMasterFormGroup.get('ddlStaffTypeID')?.disable();
        //['', [Validators.required]],
        this.isReadOnly = true;
        this.isDisabled = true;
      }
     
      
      await this.ITIPrivateEstablishService.GetByID(id, this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'FFFFF');
         
          this.staffDetailsFormData = data['Data']  
          this.staffDetailsFormData.StaffID = data['Data']["StaffID"];
          this.staffDetailsFormData.StaffTypeID = data['Data']["StaffTypeID"];
          this.OnFilterDesignation()
          this.staffDetailsFormData.Name = data['Data']["Name"];
          this.staffDetailsFormData.SSOID = data['Data']["SSOID"];
          this.staffDetailsFormData.AdharCardNumber = data['Data']["AdharCardNumber"];
          this.staffDetailsFormData.RoleID = data['Data']["RoleID"];
          this.staffDetailsFormData.DesignationID = data['Data']["DesignationID"];
          this.staffDetailsFormData.StateID = data['Data']["StateID"];
          await this.ddlState_Change();
          this.staffDetailsFormData.DistrictID = data['Data']["DistrictID"];

          this.staffDetailsFormData.Address = data['Data']["Address"];

          this.staffDetailsFormData.CourseID = data['Data']["CourseID"];
          
/*          await this.ddlStream_Change();*/
          this.staffDetailsFormData.SubjectID = data['Data']["SubjectID"];
          this.staffDetailsFormData.Email = data['Data']["Email"];
          this.staffDetailsFormData.MobileNumber = data['Data']["MobileNumber"];
          this.staffDetailsFormData.HigherQualificationID = data['Data']["HigherQualificationID"];


          if (this.staffDetailsFormData.HigherQualificationID == "0")
          {
            this.staffDetailsFormData.HigherQualificationID = "";
          }
   
          if (data['Data']["AdharCardPhoto"] != null) {
            this.staffDetailsFormData.AdharCardPhoto = data['Data']["AdharCardPhoto"];
          } else {
            this.staffDetailsFormData.AdharCardPhoto=''
          }
          if (data['Data']["Dis_AdharCardNumber"] != null) {
            this.staffDetailsFormData.Dis_AdharCardNumber = data['Data']["Dis_AdharCardNumber"];
          } else {
            this.staffDetailsFormData.Dis_AdharCardNumber = ''
          }

          if (data['Data']["ProfilePhoto"] != null) {
            this.staffDetailsFormData.ProfilePhoto = data['Data']["ProfilePhoto"];
          } else {
            this.staffDetailsFormData.ProfilePhoto = ''
          }
          if (data['Data']["Dis_ProfileName"] != null) {
            this.staffDetailsFormData.Dis_ProfileName = data['Data']["Dis_ProfileName"];
          } else {
            this.staffDetailsFormData.Dis_ProfileName = ''
          }

          if (data['Data']["PanCardPhoto"] != null) {
            this.staffDetailsFormData.PanCardPhoto = data['Data']["PanCardPhoto"];
          } else {
            this.staffDetailsFormData.PanCardPhoto = ''
          }
          if (data['Data']["Dis_PanCardNumber"] != null) {
            this.staffDetailsFormData.Dis_PanCardNumber = data['Data']["Dis_PanCardNumber"];
          } else {
            this.staffDetailsFormData.Dis_PanCardNumber = ''
          }

          if (data['Data']["Certificate"] != null) {
            this.staffDetailsFormData.Certificate = data['Data']["Certificate"];
          } else {
            this.staffDetailsFormData.Certificate = ''
          }
          if (data['Data']["Dis_Certificate"] != null) {
            this.staffDetailsFormData.Dis_Certificate = data['Data']["Dis_Certificate"];
          } else {
            this.staffDetailsFormData.Dis_Certificate = ''
          }
    
          this.staffDetailsFormData.PanCardNumber = data['Data']["PanCardNumber"];
        
          this.staffDetailsFormData.DateOfBirth = this.dateSetter(data['Data']['DateOfBirth'])
          this.staffDetailsFormData.DateOfAppointment = this.dateSetter(data['Data']['DateOfAppointment'])
          this.staffDetailsFormData.DateOfJoining = this.dateSetter(data['Data']['DateOfJoining'])
          this.staffDetailsFormData.Experience = data['Data']["Experience"];
       
    
          this.staffDetailsFormData.SpecializationSubjectID = data['Data']["SpecializationSubjectID"];
          this.staffDetailsFormData.AnnualSalary = data['Data']["AnnualSalary"];
          this.staffDetailsFormData.PFDeduction = data['Data']["PFDeduction"];
          this.staffDetailsFormData.ResearchGuide = data['Data']["ResearchGuide"];
          this.staffDetailsFormData.StaffStatus = data['Data']["StaffStatus"];
          this.staffDetailsFormData.Pincode = data['Data']['Pincode']

          this.staffDetailsFormData.BankName = data['Data']['BankName']
          this.staffDetailsFormData.BankAccountNo = data['Data']['BankAccountNo']
          this.staffDetailsFormData.BankAccountName = data['Data']['BankAccountName']
          this.staffDetailsFormData.IFSCCode = data['Data']['IFSCCode']
          if (this.staffDetailsFormData.StaffSubjectListModel!=null)
            this.staffDetailsFormData.StaffSubjectListModel.forEach(e => {
              e.SubjectType = e.IsOptional ? 'Optional' :'Teaching'

              
              const examTypeItem = this.staffDetailsFormData.StaffSubjectListModel?.find(e => e.ExamType != null);
              if (examTypeItem) {
                this.ExamTypeHeading = examTypeItem.ExamType;
              }

          })


         

  
          console.log(this.staffDetailsFormData,"staff")
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
 
  onFromDateChange() {
    const fromDate = new Date(this.staffDetailsFormData.DateOfAppointment);
    this.minToDate = this.formatDate(new Date(fromDate));
  }

  // Helper function to format date as YYYY-MM-DD
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  //minToDate: string = this.staffDetailsFormData.DateOfAppointment; 
  minToDate: string = this.todayDate; 
  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  async onFilechange(event: any, Type: string)
  {
    try {
      this.staffDetailsFormData.FolderName=''
      this.file = event.target.files[0];
      if (this.file)
      {

        //if (!this.validateFileName(this.file.name))
        //{
        //  this.toastr.error('Invalid file name. Please remove special characters from file');
        //  return;
        //}
        // Type validation
        if (['image/jpeg', 'image/jpg', 'image/png'].includes(this.file.type))
        {
          // Size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less than 2MB File');
            return;
          }
        }
        else
        {
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
            console.log("photo data",data);
            if (data.State === EnumStatus.Success) {

              
              const fileName = data['Data'][0]["Dis_FileName"];
              const actualFile = data['Data'][0]["FileName"];
              const folder = data['Data'][0]["FolderName"];
              if (fileName) {
                // Prevent duplicate upload based on file name
                if (Type === 'PanCard' && this.staffDetailsFormData.Dis_AdharCardNumber &&
                  fileName === this.staffDetailsFormData.Dis_AdharCardNumber) {
                  this.toastr.error('PanCard file name already exists!');
                  return;
                }

                if (Type === 'Aadhar' && this.staffDetailsFormData.Dis_PanCardNumber &&
                  fileName === this.staffDetailsFormData.Dis_PanCardNumber) {
                  this.toastr.error('Aadhar file name already exists!');
                  return;
                }
              }
              //if (data['Data'][0]["Dis_FileName"] != null)
              //{
              //  if (this.staffDetailsFormData.Dis_AdharCardNumber != '' && Type == 'PanCard') {
              //    if (data['Data'][0]["Dis_FileName"] == this.staffDetailsFormData.Dis_AdharCardNumber) {
              //      this.toastr.error('This file name already exists!');
              //      return 
              //    }
              //  }

              //  if (this.staffDetailsFormData.Dis_PanCardNumber != '' && Type =='Aadhar') {
              //    if (data['Data'][0]["Dis_FileName"] == this.staffDetailsFormData.Dis_PanCardNumber) {
              //      this.toastr.error('This file name already exists!');
              //      return
              //    }
              //  }


              //}

              switch (Type) {
                case "Photo":
                  this.staffDetailsFormData.Dis_ProfileName = data['Data'][0]["Dis_FileName"];
                  this.staffDetailsFormData.ProfilePhoto = data['Data'][0]["FileName"];
                  this.staffDetailsFormData.FolderName = data['Data'][0]["FolderName"];
                  break;
                case "Aadhar":
                  this.staffDetailsFormData.Dis_AdharCardNumber = data['Data'][0]["Dis_FileName"];
                  this.staffDetailsFormData.AdharCardPhoto = data['Data'][0]["FileName"];
                  this.staffDetailsFormData.FolderName = data['Data'][0]["FolderName"];
                  break;
                case "PanCard":
                  this.staffDetailsFormData.Dis_PanCardNumber = data['Data'][0]["Dis_FileName"];
                  this.staffDetailsFormData.PanCardPhoto = data['Data'][0]["FileName"];
                  this.staffDetailsFormData.FolderName = data['Data'][0]["FolderName"];
                  break;
                case "Certificate":
                  this.staffDetailsFormData.Certificate = data['Data'][0]["FileName"];
                  this.staffDetailsFormData.Dis_Certificate = data['Data'][0]["Dis_FileName"];
                  this.staffDetailsFormData.FolderName = data['Data'][0]["FolderName"];
                  break;
                case "education":
                  this.EducationalQualificationFormData.MarksheetPhoto = data['Data'][0]["FileName"];
                  this.EducationalQualificationFormData.Dis_Marksheet = data['Data'][0]["Dis_FileName"];
                  this.staffDetailsFormData.FolderName = data['Data'][0]["FolderName"];
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

  async DeleteImage(FileName: any, Type: string) {
    try {
      console.log("DeleteImage",FileName);
      this.loaderService.requestStarted(); 
      await this.commonMasterService.DeleteDocument(FileName).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("DeleteImage", data)
        if (data.State != EnumStatus.Error) {
          switch (Type) {
            case "Photo":
              this.staffDetailsFormData.Dis_ProfileName = '';
              this.staffDetailsFormData.ProfilePhoto = '';
              break;
            case "Aadhar":
              this.staffDetailsFormData.Dis_AdharCardNumber = '';
              this.staffDetailsFormData.AdharCardPhoto = '';
              break;
            case "PanCard":
              this.staffDetailsFormData.Dis_PanCardNumber = '';
              this.staffDetailsFormData.PanCardPhoto = '';
              break;
            case "Certificate":
              this.staffDetailsFormData.Certificate = '';
              this.staffDetailsFormData.Dis_Certificate = '';
              break;
            case "education":
              this.EducationalQualificationFormData.MarksheetPhoto = '';
              this.EducationalQualificationFormData.Dis_Marksheet = '';
              break;
            // Add additional cases as needed
            default:
              break;
          }
          this.toastr.success(data.Message);
        }
        if (data.State === EnumStatus.Error) {
          this.toastr.error(data.ErrorMessage);
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.ErrorMessage);
        }
      });
    } catch (Ex) {
      console.log(Ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }


  async SaveData() {

    this.isSubmitted = true;

    if (this.StaffMasterFormGroup.invalid) {
      this.toastr.error("invalid form values");
      Object.keys(this.StaffMasterFormGroup.controls).forEach(key => {
          const control = this.StaffMasterFormGroup.get(key);
 
          if (control && control.invalid) {
            console.log(`Control ${key} is invalid`);
            Object.keys(control.errors!).forEach(errorKey => {
              console.log(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
            });
          }
        });
      return
    }
    console.log(this.staffDetailsFormData)
    // if (this.staffDetailsFormData.EduQualificationDetailsModel.length == 0) {
    //   this.toastr.error("Add Educational Qualification Details");
    //   return;
    // }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      
      this.staffDetailsFormData.DepartmentID = this.sSOLoginDataModel.DepartmentID
      if(this.sSOLoginDataModel.RoleID != EnumRole.Principal) {
        this.staffDetailsFormData.StatusOfStaff = EnumStatusOfStaff.Draft
      }
      this.staffDetailsFormData.InstituteID = this.sSOLoginDataModel.InstituteID
      this.staffDetailsFormData.ModifyBy = this.sSOLoginDataModel.UserID

      console.log("staffDetailsFormData.StatusOfStaff", this.staffDetailsFormData.StatusOfStaff)
      this.staffDetailsFormData.PanCardNumber = this.encryptionService.encryptData(this.staffDetailsFormData.PanCardNumber);
      this.staffDetailsFormData.AdharCardNumber = this.encryptionService.encryptData(this.staffDetailsFormData.AdharCardNumber);

      
      await this.ITIPrivateEstablishService.SaveStaffDetails(this.staffDetailsFormData)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success)
          {
             this.GetByID(this.StaffID);
            if ((this.sSOLoginDataModel.RoleID == EnumRole.Invigilator) || (this.sSOLoginDataModel.RoleID == EnumRole.Teacher))
            {
              this.toastr.success(this.Message);
              setTimeout(() =>
              {

                window.location.reload();
              }, 200);
            }
            else
            {
              this.toastr.success(this.Message);
            }


            //this.routers.navigate(['/dashboard']);
            //this.toastr.success(this.Message);
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
  ResetControls() {
    this.isSubmitted = false;
    this.staffDetailsFormData = new ITIPrivateEstablish_StaffDetailsDataModel();
    console.log("cancle clicked", this.StaffMasterFormGroup.value)
  }


  // async AddNewRole() {
  //   this.isEduFormSubmitted = true;
  //   if (this.EduQualificationFormGroup.invalid) {
  //     return console.log("error");
  //   }
  //   //Show Loading
  //   this.loaderService.requestStarted();
  //   try {
  //     this.EducationalQualificationFormData.StreamName = this.BranchesMasterList.filter((x: any) => x.StreamID == this.EducationalQualificationFormData.StreamID)[0]['StreamName'];
  //     this.EducationalQualificationFormData.PassingYear = this.FinalcialList.filter((x: any) => x.FinancialYearID == this.EducationalQualificationFormData.PassingYearID)[0]['FinancialYearName'];
  //     // this.staffDetailsFormData.EduQualificationDetailsModel.push(
  //     //   {

  //     //     QualificationID: this.EducationalQualificationFormData.QualificationID,
  //     //     StreamID: this.EducationalQualificationFormData.StreamID,
  //     //     StreamName: this.EducationalQualificationFormData.StreamName,
  //     //     University: this.EducationalQualificationFormData.University,
  //     //     PassingYearID: this.EducationalQualificationFormData.PassingYearID,
  //     //     PassingYear: this.EducationalQualificationFormData.PassingYear,
  //     //     PercentageGrade: this.EducationalQualificationFormData.PercentageGrade,
  //     //     MarksheetPhoto: this.EducationalQualificationFormData.MarksheetPhoto,
  //     //     Dis_Marksheet: this.EducationalQualificationFormData.Dis_Marksheet,
  //     //     QualificationName: this.EducationalQualificationFormData.QualificationName

  //     //   },

  //     // );
  //     // console.log(this.EducationalQualificationFormData)
  //     // console.log(this.staffDetailsFormData.EduQualificationDetailsModel)

  //   }
  //   catch (ex) { console.log(ex) }
  //   finally {
  //     setTimeout(async () => {
  //       await this.ResetRow();
  //       this.loaderService.requestEnded();
  //       this.isLoading = false;
  //     }, 200);
  //   }
  // }

  async CancelData() {
    this.staffDetailsFormData = new ITIPrivateEstablish_StaffDetailsDataModel();
  }

  // async ResetRow() {
  //   this.loaderService.requestStarted();

  //   this.EducationalQualificationFormData.QualificationID = 0;
  //   this.EducationalQualificationFormData.StreamID = 0;
  //   this.EducationalQualificationFormData.StreamName = '';
  //   this.EducationalQualificationFormData.University = '';
  //   this.EducationalQualificationFormData.PassingYear = '';
  //   this.EducationalQualificationFormData.PercentageGrade = '';
  //   this.EducationalQualificationFormData.MarksheetPhoto = '';
  //   this.EducationalQualificationFormData.Dis_Marksheet = '';

  //   // this.isSubmittedItemDetails = false;
  //   setTimeout(() => {
  //     this.loaderService.requestEnded();
  //   }, 200);
  // }

  // async btnRowDelete_OnClick(item: Staff_EduQualificationDetailsModel) {
  //   try {
  //     this.loaderService.requestStarted();
  //     if (confirm("Are you sure you want to delete this ?")) {
  //       const index: number = this.staffDetailsFormData.EduQualificationDetailsModel.indexOf(item);
  //       if (index != -1) {
  //         this.staffDetailsFormData.EduQualificationDetailsModel.splice(index, 1)
  //       }
  //     }
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


  async OnConfirm(content: any) {
    
    this.modalReference = this.modalService.open(content, { size: 'xl', backdrop: 'static' });
    this.isModalOpen = true;  // Open the modal

  }

  // Method to close the modal when Close button is clicked
  ClosePopup(): void {
    this.modalReference?.close();  // Close the modal
    /*window.location.reload();*/
  }


  async getStreamMasterData() {
    try {
        
      if (this.sSOLoginDataModel.DepartmentID === EnumDepartment.BTER) {
        this.StreamSearch.StreamType = this.Addrequest.StreamTypeID
        /*    this.StreamSearch.InstituteID = this.staffDetailsFormData.InstituteID*/
        this.StreamSearch.InstituteID = this.staffDetailsFormData.InstituteID
        this.loaderService.requestStarted();
        await this.commonMasterService.StreamDDLInstituteIdWise(this.StreamSearch).then((data: any) =>
        {
          data = JSON.parse(JSON.stringify(data));
          this.CourseMasterDDL = data.Data;
          console.log("StreamMasterList", this.CourseMasterDDL)
        }, error => console.error(error));
      } 
      else if (this.sSOLoginDataModel.DepartmentID === EnumDepartment.ITI) {
        this.tradeSearchRequest.TradeTypeId = this.Addrequest.StreamTypeID

        this.loaderService.requestStarted();
        await this.commonMasterService.TradeListTradeTypeWise(this.tradeSearchRequest).then((data: any) =>
        {
          data = JSON.parse(JSON.stringify(data));
          this.TradeMasterList = data.Data;
          console.log("StreamMasterList", this.TradeMasterList)
        }, error => console.error(error));
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


  //async ddlStream_Change() {
  //  try {
  //    
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.SubjectMaster_StreamIDWise(this.Addrequest.BranchID, this.sSOLoginDataModel.DepartmentID, this.Addrequest.SemesterID)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.SubjectMasterDDL = data.Data;
  //        console.log("SubjectMasterDDLList", this.SubjectMasterDDL)
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


  async OnSave() {

  }

  validateFileName(fileName: string): boolean {
    const invalidChars = /[!@#$%^&*()+\-=\[\]{};':"\\|,<>\/?]/;
    return !invalidChars.test(fileName);
  }


  get CheckInstitute(): boolean {
    let insdtitutexist = false
    
    if (this.sSOLoginDataModel.DepartmentID === EnumDepartment.BTER) {
      insdtitutexist = this.AddedChoices.some(x => x.SemesterID == this.Addrequest.SemesterID && x.BranchID == this.Addrequest.BranchID && x.SubjectID == this.Addrequest.SubjectID)
    }
    else if(this.sSOLoginDataModel.DepartmentID === EnumDepartment.ITI) {
      insdtitutexist = this.AddedChoices.some(x => x.SemesterID == this.Addrequest.SemesterID && x.BranchID == this.Addrequest.BranchID && x.SubjectID == this.Addrequest.SubjectID)
    }
    
    if (insdtitutexist) {
      return true
    } else {
      return false
    }
  }


  AddChoice() {
    
    this.isAddrequest = true;
    if (this.AddsubjectFormGroup.invalid) {
      /*this.OptionsFormGroup.markAllAsTouched();*/
      return;
    }

    console.log("this.Addrequest",this.Addrequest);
    if (this.CheckInstitute) {
      this.toastr.error("आपने पहले ही इस संयोजन को चुन लिया है")
    }
    else {
      if (this.sSOLoginDataModel.DepartmentID === EnumDepartment.BTER) {
        // Get the selected values
        this.Addrequest.BranchName = this.CourseMasterDDL.filter((x: any) => x.StreamID == this.Addrequest.BranchID)[0]['StreamName'];
        this.Addrequest.StreamType = this.StreamTypeList.filter((x: any) => x.StreamTypeID == this.Addrequest.StreamTypeID)[0]['StreamType'];
      }
      else if(this.sSOLoginDataModel.DepartmentID === EnumDepartment.ITI) {
        this.Addrequest.StreamType = this.ITITradeSchemeList.filter((x: any) => x.ID == this.Addrequest.StreamTypeID)[0]['Name'];
        this.Addrequest.BranchName = this.TradeMasterList.filter((x: any) => x.Id == this.Addrequest.BranchID)[0]['TradeName'];
      }

      this.Addrequest.SemesterName = this.SemesterList.filter((x: any) => x.SemesterID == this.Addrequest.SemesterID)[0]['SemesterName'];
      this.Addrequest.ExamType = this.ExamTypeList.filter((x: any) => x.ID == this.Addrequest.ExamTypeID)[0]['Name'];
      this.Addrequest.SubjectName = this.SubjectMasterDDL.filter((x: any) => x.ID == this.Addrequest.SubjectID)[0]['Name'];
      
      this.Addrequest.SubjectType = this.Addrequest.IsOptional ? 'Optional' : 'Teaching';

      if (!this.staffDetailsFormData.StaffSubjectListModel) {
        this.staffDetailsFormData.StaffSubjectListModel = [];
      }


      this.staffDetailsFormData.StaffSubjectListModel.push({
        BranchName: this.Addrequest.BranchName,
        BranchID: this.Addrequest.BranchID,
        StreamType: this.Addrequest.StreamType,
        StreamTypeID: this.Addrequest.StreamTypeID,
        ExamType: this.Addrequest.ExamType,
        ExamTypeID: this.Addrequest.ExamTypeID,
        SubjectName: this.Addrequest.SubjectName,
        SubjectID: this.Addrequest.SubjectID,
        IsOptional: this.Addrequest.IsOptional,
        SemesterID: this.Addrequest.SemesterID,
        SemesterName: this.Addrequest.SemesterName,
        SubjectType: this.Addrequest.SubjectType
      });

      console.log(this.staffDetailsFormData.StaffSubjectListModel);
      this.Addrequest.BranchName = ''
      this.Addrequest.BranchID = 0
      this.Addrequest.SemesterID = 0
      this.Addrequest.ExamTypeID = 0
      this.Addrequest.SubjectID = 0
      this.Addrequest.StreamTypeID = 0
      this.Addrequest.StreamType = ''
      this.Addrequest.ExamType = ''
      this.Addrequest.SubjectName = ''
      this.Addrequest.SubjectType = ''
      this.Addrequest.SemesterName = ''
      this.Addrequest.IsOptional = false
      this.Addrequest.SubjectType = ''
      this.isAddrequest=false

    }
  }

  deleteRow(index: number): void {
    this.staffDetailsFormData.StaffSubjectListModel.splice(index, 1);
  }

  openModalChangeWorkingInstitute(content: any, StaffID: number) {
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'md', keyboard: true, centered: true });
  }

  onChangeWorkingInstitute() {
    this.Swal2.Confirmation("Are you sure you want to Change the current Working Institute ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            this.staffDetailsFormData.ModifyBy = this.sSOLoginDataModel.UserID
            await this.ITIPrivateEstablishService.ChangeWorkingInstitute(this.staffDetailsFormData).then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data);
              if (data.State === EnumStatus.Success){
                this.toastr.success(data.Message);
                this.GetCurrentWorkingInstitute_ByID();
                this.ClosePopup();
              } else {
                this.toastr.error(data.ErrorMessage);
              }
            })
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
      });
  }

  async GetCurrentWorkingInstitute_ByID() {
   try {
     this.searchRequest.StaffID = this.StaffID
     this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
     this.loaderService.requestStarted();
     await this.ITIPrivateEstablishService.GetCurrentWorkingInstitute_ByID(this.searchRequest)
       .then((data: any) => {
         data = JSON.parse(JSON.stringify(data));
         console.log("data", data)
        
         this.staffDetailsFormData.InstituteID = data.Data[0].InstituteID
         this.staffDetailsFormData.InstituteDivisionID = data.Data[0].InstituteDivisionID
         this.staffDetailsFormData.InstituteDistrictID = data.Data[0].InstituteDistrictID
         this.staffDetailsFormData.InstituteTehsilID = data.Data[0].InstituteTehsilID
         this.staffDetailsFormData.InstituteName = data.Data[0].InstituteName
         this.staffDetailsFormData.InstituteDivision = data.Data[0].InstituteDivision
         this.staffDetailsFormData.InstituteDistrict = data.Data[0].InstituteDistrict
         this.staffDetailsFormData.InstituteTehsil = data.Data[0].InstituteTehsil
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


  openOTP() {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno;
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      this.CheckOtpAfterSave();
      console.log("otp verified on the page")
    })
  }

  async CheckOtpAfterSave() {

    try {
      this.loaderService.requestStarted();
      this.staffDetailsFormData.ModifyBy = this.sSOLoginDataModel.UserID
      this.staffDetailsFormData.StatusOfStaff = EnumStatusOfStaff.Submitted
      console.log("lock and submit", this.staffDetailsFormData)
      await this.ITIPrivateEstablishService.LockandSubmit(this.staffDetailsFormData).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log(data);
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.ClosePopup();
          window.location.reload();
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
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




