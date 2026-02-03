import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { EnumEMProfileStatus, EnumDepartment, EnumStatus, GlobalConstants, EnumRole } from '../../../../Common/GlobalConstants';
import { BTER_DesignationWiseBranchDataModel, BTER_EM_AddStaffDetailsDataModel, BTER_EM_GetPersonalDetailByUserID, Bter_Govt_EM_UserRequestHistoryListSearchDataModel, Bter_RequestUpdateStatus, BTERGovtEMStaff_ServiceDetailsOfPersonalModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { IStateMasterDataModel, StreamDDL_InstituteWiseModel } from '../../../../Models/CommonMasterDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { StaffDetailsDataModel, StaffSubjectList } from '../../../../Models/StaffMasterDataModel';
import { CommonVerifierApiDataModel } from '../../../../Models/PublicInfoDataModel';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bter-em-add-staff-details',
  standalone: false,
  templateUrl: './bter-em-add-staff-details.component.html',
  styleUrl: './bter-em-add-staff-details.component.css'
})
export class BterEMAddStaffDetailsComponent {
  StaffMasterFormGroup!: FormGroup;
  isSubmitted: boolean = false;
  public AddsubjectFormGroup!: FormGroup;
  public request = new BTER_EM_AddStaffDetailsDataModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public StreamSearch = new StreamDDL_InstituteWiseModel()
  public requestUser = new BTER_EM_GetPersonalDetailByUserID();
  public finalSubmitRequest = new Bter_RequestUpdateStatus();
  AddedServiceList: BTERGovtEMStaff_ServiceDetailsOfPersonalModel[] = [];
  AddedServiceListAdded: BTERGovtEMStaff_ServiceDetailsOfPersonalModel[] = [];
  public Addrequest = new StaffSubjectList();
  public userID:number=0;
  public InstituteMasterDDLList: any = [];
  public DesignationMasterDDLList: any = [];
  public RoleMasterDDLList: any = [];
  public StaffTypeMasterDDLList: any = [];
  public CourseMasterDDL: any = [];
  public GenderList: any = [];
  public OfficeList: any[] = [];
  public StreamTypeList: any = [];
  public ExamTypeList: any = [];
  public SemesterList: any = [];
  public SubjectMasterDDL: any = [];
  public ShowAllSemester: number = 0;
  public StateMasterList: IStateMasterDataModel[] = [];
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  public _EnumRole = EnumRole;
  public isAddrequest: boolean = false;
  public AddedChoices: StaffSubjectList[] = [];
  public DesignationWiseBranchListRole: any [] = [];
  public DesignationWiseBranchList: any [] = [];
  staffDetailsFormData = new StaffDetailsDataModel();
  _DesignationWiseBranchDataModel = new BTER_DesignationWiseBranchDataModel();

  
  public searchRequestUserProfileStatus = new Bter_Govt_EM_UserRequestHistoryListSearchDataModel();
  public UserProfileStatusHistoryList: any = [];
  modalReference: NgbModalRef | undefined;

  public IsOptional: boolean = false
  _enumDepartment = EnumDepartment
  public ExamTypeHeading = '';
  public requestSSoApi = new CommonVerifierApiDataModel();
  public GetGenderID: number = 0;
  public IsHideShow: boolean = false
  public IsSubjectlistTech: boolean = false
  public IsOterFacultyTech: boolean = false
  public today: string='';
  public IsGuestHouse: boolean = false


  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private bterEstablishManagementService: BTEREstablishManagementService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router,
  ) {}

  async ngOnInit() {


    this.StaffMasterFormGroup = this.formBuilder.group({
      InstituteID: [{ value: 0, disabled: true }],
      BranchID: [0,],
      DesignationID: [0, [DropdownValidators]],
      ServiceBookBranchID: [0,],
      Gender: [0, [DropdownValidators]],

      Name: ['', [Validators.required]],
      DateOfBirth: ['', [Validators.required]],
      DateOfAppointment: ['', [Validators.required]],
      DepartmentJoiningDate: ['', [Validators.required]],
      DateOfJoining: ['', [Validators.required]],

      MobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      SSOID: ['', [Validators.required]],
      EmployeeID: ['',[Validators.required]],

      CurrentDesignationID: ['', [DropdownValidators]],
      Office: [{ value: 0, disabled: true }],

      Experience: ['', [Validators.required]],

      QualificationAtJoining: ['', [Validators.required]],
      QualificationAfterJoining: ['', [Validators.required]],

      DateOfRetirement: [{ value: '', disabled: true }],
      Remark: [''],
      IsNodal: [{ value: false, disabled: true }],
      
    });

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
    this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
   
    this.userID=this.sSOLoginDataModel.UserID;

    debugger
    try {
      this.loaderService.requestStarted();
      await this.bterEstablishManagementService.BTER_EM_DesignationWiseBranch(this._DesignationWiseBranchDataModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DesignationWiseBranchListRole = data['Data'];
          this.DesignationWiseBranchList = data['Data'];
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


    if (this.sSOLoginDataModel.UserID > 0) {
      await this.GetPersonalDetailByUserID();
    }

    await this.GetOfficeList();
    await this.GetInstituteMaster();
    await this.getStreamMasterData();
    await this.GetDesignationMasterData();
    await this.GetManageDDl();
   
    

    debugger
    const roleIDs = this.DesignationWiseBranchListRole.map((item: any) => item.RoleID);
    const DesignationIDs = this.DesignationWiseBranchList.map((item: any) => item.StaffTypeID == this.request.StaffTypeID && item.DesignationID );
    /*&& item.StaffTypeID == this.request.StaffTypeID*/
    if (roleIDs.includes(this.sSOLoginDataModel.RoleID)) {
      this.IsHideShow = true;
      this.StaffMasterFormGroup.controls['BranchID'].setValidators([DropdownValidators]);
      this.StaffMasterFormGroup.controls['ServiceBookBranchID'].setValidators([DropdownValidators]);
    }
    else if (DesignationIDs.includes(this.request.DesignationID)) {
      this.IsHideShow = true;
      
      this.StaffMasterFormGroup.controls['BranchID'].setValidators([DropdownValidators]);
      this.StaffMasterFormGroup.controls['ServiceBookBranchID'].setValidators([DropdownValidators]);
    }

    else {
      this.IsHideShow = false;
      this.StaffMasterFormGroup.controls['BranchID'].clearValidators();
      this.StaffMasterFormGroup.controls['ServiceBookBranchID'].clearValidators();
    }
    this.StaffMasterFormGroup.controls['BranchID'].updateValueAndValidity();
    this.StaffMasterFormGroup.controls['ServiceBookBranchID'].updateValueAndValidity();


    if (this.sSOLoginDataModel.RoleID == this._EnumRole.GuestFaculty || this.sSOLoginDataModel.RoleID == this._EnumRole.ShikshaSambal || this.sSOLoginDataModel.RoleID == this._EnumRole.GuestHouseIncharge || this.sSOLoginDataModel.RoleID == this._EnumRole.GuestRoomWarden || this.sSOLoginDataModel.RoleID == this._EnumRole.GuestHouseAdmin) {
      this.IsOterFacultyTech = true

      this.StaffMasterFormGroup.controls['DepartmentJoiningDate'].clearValidators();
      this.StaffMasterFormGroup.controls['DateOfJoining'].clearValidators();
      this.StaffMasterFormGroup.controls['CurrentDesignationID'].clearValidators();
      this.StaffMasterFormGroup.controls['Experience'].clearValidators();
      this.StaffMasterFormGroup.controls['QualificationAtJoining'].clearValidators();
      this.StaffMasterFormGroup.controls['QualificationAfterJoining'].clearValidators();
      this.StaffMasterFormGroup.controls['DateOfRetirement'].clearValidators();


      this.StaffMasterFormGroup.controls['DepartmentJoiningDate'].updateValueAndValidity();
      this.StaffMasterFormGroup.controls['DateOfJoining'].updateValueAndValidity();
      this.StaffMasterFormGroup.controls['CurrentDesignationID'].updateValueAndValidity();
      this.StaffMasterFormGroup.controls['Experience'].updateValueAndValidity();
      this.StaffMasterFormGroup.controls['QualificationAtJoining'].updateValueAndValidity();
      this.StaffMasterFormGroup.controls['QualificationAfterJoining'].updateValueAndValidity();
      this.StaffMasterFormGroup.controls['DateOfRetirement'].updateValueAndValidity();


      if (
        this.sSOLoginDataModel.RoleID == this._EnumRole.GuestHouseIncharge ||
        this.sSOLoginDataModel.RoleID == this._EnumRole.GuestRoomWarden
        || this.sSOLoginDataModel.RoleID == this._EnumRole.GuestHouseAdmin
      ) {
        this.IsGuestHouse = true;
        this.IsHideShow = false;
        this.StaffMasterFormGroup.controls['BranchID'].clearValidators();
        this.StaffMasterFormGroup.controls['ServiceBookBranchID'].clearValidators();
        this.StaffMasterFormGroup.controls['Office'].clearValidators();
        this.StaffMasterFormGroup.controls['DesignationID'].clearValidators();

        this.StaffMasterFormGroup.controls['BranchID'].clearValidators();
        this.StaffMasterFormGroup.controls['ServiceBookBranchID'].clearValidators();
        this.StaffMasterFormGroup.controls['Office'].clearValidators();
        this.StaffMasterFormGroup.controls['DesignationID'].clearValidators();

        this.StaffMasterFormGroup.controls['Office'].updateValueAndValidity();
        this.StaffMasterFormGroup.controls['BranchID'].updateValueAndValidity();
        this.StaffMasterFormGroup.controls['ServiceBookBranchID'].updateValueAndValidity();
        this.StaffMasterFormGroup.controls['DesignationID'].updateValueAndValidity();
      }


    }

    await this.setTodayDate();


   
    await this.SSOIDGetSomeDetails(this.sSOLoginDataModel.SSOID);
  }
  get _AddsubjectFormGroup() { return this.AddsubjectFormGroup.controls; }
  get _StaffMasterFormGroup() { return this.StaffMasterFormGroup.controls; }



  async GetManageDDl() {


    await this.commonMasterService.GetExamType()
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log(data['Data']);
        this.ExamTypeList = data['Data'];
        console.log(this.ExamTypeList, "ExamTypeList");
      }, error => console.error(error));

    await this.commonMasterService.GetStreamType()
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log(data['Data']);
        this.StreamTypeList = data['Data'];
        console.log(this.StateMasterList);
      }, error => console.error(error));
  }

  async getStreamMasterData() {
    try {
      this.StreamSearch.InstituteID = this.sSOLoginDataModel.InstituteID
      this.StreamSearch.StreamType = this.sSOLoginDataModel.Eng_NonEng
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamDDLInstituteIdWise(this.StreamSearch).then((data: any) =>
      {
        data = JSON.parse(JSON.stringify(data));
        this.CourseMasterDDL = data.Data;
        console.log("StreamMasterList", this.CourseMasterDDL)
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

  async SemesterMaster() {
    debugger
    try {

      this.loaderService.requestStarted();
      this.ShowAllSemester = this.Addrequest.ExamTypeID
      await this.commonMasterService.SemesterMaster(this.ShowAllSemester)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.SemesterList = data['Data'];
          
          
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

  async GetSubjectMasterDDL() {
    var DepartmentID = this.sSOLoginDataModel.DepartmentID

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SubjectMaster_StreamIDWise(this.Addrequest.BranchID, this.sSOLoginDataModel.DepartmentID, this.Addrequest.SemesterID).then((data: any) => {
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

  async GetDesignationMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignationAndPostMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DesignationMasterDDLList = data.Data;
        this.DesignationMasterDDLList = this.DesignationMasterDDLList.filter((item: any) => item.TypeID == this.request.StaffTypeID);
        this.StaffMasterFormGroup.patchValue({
          CurrentDesignationID: this.request.CurrentDesignationID || '0'
        });
        // console.log("DesignationMasterList", this.DesignationMasterDDLList);
      }, error => console.error(error))

      await this.commonMasterService.GetCommonMasterDDLByType('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
          console.log("GenderList", this.GenderList);
        }, (error: any) => console.error(error)
        );
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetPersonalDetailByUserID() {
    debugger
    try {
      
      this.loaderService.requestStarted();
      this.requestUser.SSOID = this.sSOLoginDataModel.SSOID;
      this.requestUser.StaffUserID = this.sSOLoginDataModel.UserID;
      await this.bterEstablishManagementService.BTER_EM_GetPersonalDetailByUserID(this.requestUser).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success) {
          this.request = data.Data[0];
          console.log(this.request.DateOfBirth);
          console.log(this.StaffMasterFormGroup.get('DateOfBirth')?.value);
          /*this.staffDetailsFormData.StaffSubjectListModel = request.*/
          console.log("GetPersonalDetailByUserID", this.request);
          debugger
          //if (this.request.DepartmentJoiningDate != '' || this.request.DepartmentJoiningDate != null) {
          //  const isoDate = this.request.DepartmentJoiningDate;
          //  const dateObj = new Date(isoDate);

          //  const day = String(dateObj.getDate()).padStart(2, '0');
          //  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // months are zero-indexed
          //  const year = dateObj.getFullYear();

          //  const formattedDate = `${day}-${month}-${year}`;
          //  this.request.DepartmentJoiningDate = formattedDate;
          //}
         

          //this.StaffMasterFormGroup.get('InstituteID')?.setValue(this.request.InstituteID);
        }

        
        
      }, error => console.error(error))

      await this.bterEstablishManagementService.BterStaffSubjectListModel(this.sSOLoginDataModel.StaffID, this.sSOLoginDataModel.DepartmentID).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          
          
          
          this.staffDetailsFormData.StaffSubjectListModel = data?.Data?.bterStaffSubjectListModel;
          
          this.staffDetailsFormData.StaffSubjectListModel.forEach(e => {
            e.SubjectType = e.IsOptional ? 'Optional' : 'Teaching'


            const examTypeItem = this.staffDetailsFormData.StaffSubjectListModel?.find(e => e.ExamType != null);
            if (examTypeItem) {
              this.ExamTypeHeading = examTypeItem.ExamType;
            }

          })
        
        }

        

      }, error => console.error(error))



    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetOfficeList() {
   /* this.request.OfficeID = 0;*/
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, 1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
          if (this.sSOLoginDataModel.RoleID == 194) {
            this.OfficeList = this.OfficeList.filter(x => x.ID == 19);
          }
          if (this.sSOLoginDataModel.RoleID == this._EnumRole.JDConfidential_Eng) {
            this.OfficeList = this.OfficeList.filter(x => x.ID == 18);
          }
          //if (this.sSOLoginDataModel.RoleID == this._EnumRole.Principal) {
          //  this.OfficeList = this.OfficeList.filter(x => x.ID == 21);
          //} else
          {
            this.OfficeList = this.OfficeList;
          }
          console.log(this.OfficeList, "OfficeList")
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
  GetInstituteMaster() {
    const officeList = [
      { InstituteID: 10001, InstituteName: 'DTE', OfficeTypeID: 17 },
      { InstituteID: 10002, InstituteName: 'BTER', OfficeTypeID: 18 },
      { InstituteID: 10003, InstituteName: 'TTC', OfficeTypeID: 19 }
    ];

    this.commonMasterService.InstituteMaster(
      this.sSOLoginDataModel.DepartmentID,
      this.sSOLoginDataModel.Eng_NonEng,
      this.sSOLoginDataModel.EndTermID
    ).then((response: any) => {
      const instituteList = Array.isArray(response?.Data) ? response.Data : [];
      this.InstituteMasterDDLList = officeList.concat(instituteList);
    });
  }

  checkoptional() {
    this.Addrequest.IsOptional = !this.Addrequest.IsOptional;
    if (!this.Addrequest.IsOptional) {
      this.Addrequest.IsOptional = false
    }
  }

  getCircularReplacer() {
    const seen = new WeakSet();
    return (key: string, value: any) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    };
  }
  async SaveData() {
    debugger
    this.isSubmitted = true;
    if (this.StaffMasterFormGroup.invalid) {
      Object.keys(this.StaffMasterFormGroup.controls).forEach(key => {
        const control = this.StaffMasterFormGroup.get(key);
        if (control && control.invalid) {
          console.error(`Field '${key}' is invalid.`);

          if (control.errors) {
            Object.keys(control.errors).forEach(errorKey => {
              // Safely stringify the error value to avoid issues
              const errorValue = control.errors![errorKey];
              const errorMessage = (typeof errorValue === 'string')
                ? errorValue
                : JSON.stringify(errorValue, this.getCircularReplacer());

              /*console.error(`  Error: ${errorKey} - ${errorMessage}`);*/
            });
          }
        }
      });
      this.StaffMasterFormGroup.markAllAsTouched();
      return;
    }
    // this.sSOLoginDataModel.RoleID === this._EnumRole.Teacher || 
    if (this.sSOLoginDataModel.RoleID === this._EnumRole.GuestFaculty || this.sSOLoginDataModel.RoleID === this._EnumRole.ShikshaSambal) {
      const hasSubjects = this.staffDetailsFormData.StaffSubjectListModel?.length > 0;
      if (!hasSubjects) {
        this.toastr.warning('Please enter subject details for the teacher !');
        return;
      }
    }

    this.loaderService.requestStarted();
    this.request.StaffUserID = this.sSOLoginDataModel.UserID;
    this.request.bterStaffSubjectListModel = this.staffDetailsFormData.StaffSubjectListModel;
    this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;

    try {
      await this.bterEstablishManagementService.BTER_EM_AddStaffDetails(this.request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          if (this.sSOLoginDataModel.UserID > 0) {
            await this.GetPersonalDetailByUserID();
          }
        } else {
          this.toastr.error(data.ErrorMessage);

        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  async onUserProfileStatusHistorylist(model: any, StaffUserID: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.searchRequestUserProfileStatus.StaffUserID = StaffUserID;
      this.searchRequestUserProfileStatus.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.bterEstablishManagementService.UserProfileStatusHistoryList(this.searchRequestUserProfileStatus)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserProfileStatusHistoryList = data.Data;
          this.UserProfileStatusHistoryList=this.UserProfileStatusHistoryList.filter((item:any)=>item.UserProfileStatus==='Revert');

        }, (error: any) => console.error(error))

      console.log(StaffUserID, "modal");
      this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
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

  CloseModalProfileStatuslist() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.isSubmitted = false;
  }

  async CancelData() { }


  async LockSubmitSaveData() {
    this.finalSubmitRequest.CreatedBy = this.sSOLoginDataModel.UserID;
    this.finalSubmitRequest.ID = this.sSOLoginDataModel.StaffID;
    try {
      this.loaderService.requestStarted();

      await this.bterEstablishManagementService.BTERFinalSubmitUpdateStaffProfileStatus(this.finalSubmitRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.AddedServiceList = [];
          this.sSOLoginDataModel.ProfileID = this._EnumEMProfileStatus.LockAndSubmit;
          this.commonMasterService.setsSOLoginDataModel(this.sSOLoginDataModel);
          window.location.reload();
          // const currentUrl = this.router.url;
          // this.router.navigateByUrl('/', { skipLocationChange: true })
          //   .then(() => {
          //     this.router.navigate([currentUrl]);
          //   });
          
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  get CheckInstitute(): boolean {
    let insdtitutexist = false

    if (this.sSOLoginDataModel.DepartmentID === EnumDepartment.BTER) {
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

    console.log("this.Addrequest", this.Addrequest);
    if (this.CheckInstitute) {
      this.toastr.error("आपने पहले ही इस संयोजन को चुन लिया है")
    }
    else {
      
        // Get the selected values
        this.Addrequest.BranchName = this.CourseMasterDDL.filter((x: any) => x.StreamID == this.Addrequest.BranchID)[0]['StreamName'];
        this.Addrequest.StreamType = this.StreamTypeList.filter((x: any) => x.StreamTypeID == this.Addrequest.StreamTypeID)[0]['StreamType'];
    
      

      this.Addrequest.SemesterName = this.SemesterList.filter((x: any) => x.SemesterID == this.Addrequest.SemesterID)[0]['SemesterName'];
      this.Addrequest.ExamType = this.ExamTypeList.filter((x: any) => x.ID == this.Addrequest.ExamTypeID)[0]['Name'];
      this.Addrequest.SubjectName = this.SubjectMasterDDL.filter((x: any) => x.ID == this.Addrequest.SubjectID)[0]['Name'];

      this.Addrequest.SubjectType = this.Addrequest.IsOptional ? 'Optional' : 'Teaching';

      if (!this.staffDetailsFormData.StaffSubjectListModel) {
        this.staffDetailsFormData.StaffSubjectListModel = [];
      }

      const isDuplicate = this.staffDetailsFormData.StaffSubjectListModel.some((element: any) =>
        this.Addrequest.SubjectID === element.SubjectID
      );

      debugger
      if (isDuplicate) {
        this.toastr.error('A record with this subject already exists.', 'Duplicate Entry');
        return;
      } else {

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
        this.isAddrequest = false
      }

      

    }
  }
  deleteRow(index: number): void {
    this.staffDetailsFormData.StaffSubjectListModel.splice(index, 1);
  }

  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {

    if (SSOID == "") {
      this.toastr.error("SSOID Null");
      return;
    }

    const username = SSOID; // or hardcoded 'SIDDHA.AZAD'
    const appName = 'madarsa.test';
    const password = 'Test@1234';

    /*const url = `https://ssotest.rajasthan.gov.in:4443/SSOREST/GetUserDetailJSON/${username}/${appName}/${password}`;*/

    this.requestSSoApi.SSOID = username;
    this.requestSSoApi.appName = appName;
    this.requestSSoApi.password = password;



    try {
      debugger
      this.loaderService.requestStarted();
      await this.commonMasterService.CommonVerifierApiSSOIDGetSomeDetails(this.requestSSoApi).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        let response = JSON.parse(JSON.stringify(data));
        if (response?.Data) {

          let parsedData = JSON.parse(response.Data); // parse string inside Data
          console.log('SSOID',parsedData);
          if (parsedData != null) {
            this.request.EmployeeID = parsedData.employeeNumber;
            this.request.Name = parsedData.displayName;
            this.request.MobileNumber = parsedData.mobile;
            this.request.SSOID = parsedData.SSOID;
            

            //this.formData.Name = parsedData.displayName;
            //this.formData.MobileNumber = parsedData.mobile;
            //this.formData.Email = parsedData.mailPersonal;
            //this.formData.AdharCardNumber = parsedData.aadhaarId;
            //this.formData.BhamashahNo = parsedData.bhamashahId;
            //this.formData.Pincode = parsedData.postalCode;
            //this.formData.Address = parsedData.postalAddress;
            //this.formData.EmployeeID = parsedData.employeeNumber;


            //if (parsedData.dateOfBirth) {
            //  const [day, month, year] = parsedData.dateOfBirth.split('/');
            //  this.request.DateOfBirth = `${year}-${month}-${day}`; // yyyy-MM-dd format
            //}

            debugger;
            if (parsedData.dateOfBirth) {
              const [dayStr, monthStr, yearStr] = parsedData.dateOfBirth.split('/');
              const day = parseInt(dayStr, 10);
              const month = parseInt(monthStr, 10); // 1-12
              const year = parseInt(yearStr, 10);

              // Format DateOfBirth as yyyy-MM-dd
              const dob = new Date(year, month - 1, day);
              if(this.request.DateOfBirth==null || this.request.DateOfBirth==undefined){
                this.request.DateOfBirth = yearStr+'-'+monthStr+'-'+dayStr; // yyyy-MM-dd format
              }
           
              // Calculate retirement year
              const retirementYear = year + 60;

              // Calculate Date of Retirement based on day of month
              let retirementDate: Date;
              if (day === 1) {
                // Last date of previous month in retirement year
                retirementDate = new Date(retirementYear, month - 1, 0);
              } else {
                // Last date of current month in retirement year
                retirementDate = new Date(retirementYear, month, 0);
              }

              // Format retirement date as dd-mm-yyyy
              const rdDay = String(retirementDate.getDate()).padStart(2, '0');
              const rdMonth = String(retirementDate.getMonth() + 1).padStart(2, '0');
              const rdYear = retirementDate.getFullYear();
              this.request.DateOfRetirement = `${rdYear}-${rdMonth}-${rdDay}`;

              // Optionally, check if retirement date is in the future, etc.
            }





            if (parsedData.gender != null) {
              this.GetGenderID = this.GenderList.find((item: any) =>
                item.Name?.toLowerCase().trim() === parsedData.gender?.toLowerCase().trim()
              )?.ID ?? 0;
              this.request.Gender = this.GetGenderID;
            }
            else {
              this.request.Gender = 0;
            }



            //this.formData.SSOID = parsedData.SSOID;
          }
          else {
            this.toastr.error("Record Not Found");
            return;
          }

          //alert("SSOID: " + parsedData.SSOID); // show SSOID in alert
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  openDatePicker(event: any) {
    event.target.showPicker();
  }


  setTodayDate(): void {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    this.today = `${year}-${month}-${day}`;
  }


  async calExperience(){
    debugger
    console.log(this.today)
    console.log(this.request.DepartmentJoiningDate);

    const today = new Date(this.today);
    const joining = new Date(this.request.DepartmentJoiningDate);
  
    let years = today.getFullYear() - joining.getFullYear();
  
    // adjust if birthday/anniversary not reached this year
    // const m = today.getMonth() - joining.getMonth();
  
    // if (m < 0 || (m === 0 && today.getDate() < joining.getDate())) {
    //   years--;
    // }

    this.request.Experience=  years.toString();
  
    console.log("Total Experience (Years):", years);

  }


}


  
    

