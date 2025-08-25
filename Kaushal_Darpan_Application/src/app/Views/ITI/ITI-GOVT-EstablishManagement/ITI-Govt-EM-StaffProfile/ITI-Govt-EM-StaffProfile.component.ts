import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITIGovtEMAddStaffBasicDetailDataModel, ITIGovtEMStaffMasterDataModel, ITI_Govt_EM_ZonalOFFICERSSearchDataModel, ITI_Govt_EM_ZonalOFFICERSDataModel, UpdateSSOIDByPricipleModel, ITI_Govt_EM_OFFICERSSearchDataModel, ITI_Govt_EM_OFFICERSDataModel, ITIGovtEMStaff_PersonalDetailsModel, ITIGovtEMStaff_promotionModel, ITI_Govt_EM_PersonalDetailByUserIDSearchModel, ITI_Govt_EM_UserRequestHistoryListSearchDataModel, ITI_Govt_EM_PersonalDetailByUserIDDeleteModel } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, EnumProfileStatus, EnumDepartment, EnumStatusOfStaff, EnumEMProfileStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITICollegeTradeSearchModel } from '../../../../Models/ITI/SeatIntakeDataModel';
import { CommonVerifierApiDataModel } from '../../../../Models/PublicInfoDataModel';

@Component({
  selector: 'app-ITI-Govt-EM-StaffProfile',
  standalone: false,

  templateUrl: './ITI-Govt-EM-StaffProfile.component.html',
  styleUrl: './ITI-Govt-EM-StaffProfile.component.css'
})
export class ITIGovtEMStaffProfileComponent implements OnInit {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new ITIGovtEMStaff_PersonalDetailsModel();
  public promotionDataFromGroup!: FormGroup;
  public promotionData = new ITIGovtEMStaff_promotionModel();
  public isSubmitted: boolean = false;
  public personalDetailsRequest = new ITI_Govt_EM_PersonalDetailByUserIDSearchModel();
  public deleteRequest = new ITI_Govt_EM_PersonalDetailByUserIDDeleteModel();
  public searchRequestUserProfileStatus = new ITI_Govt_EM_UserRequestHistoryListSearchDataModel();
  public searchRequest = new ITI_Govt_EM_ZonalOFFICERSSearchDataModel();
  public searchRequestUpdateSSOIDByPricipleModel = new UpdateSSOIDByPricipleModel();
  staffDetailsFormData = new ITIGovtEMStaffMasterDataModel();
  public searchRequestITi = new ITICollegeTradeSearchModel();
  public isLoading: boolean = false;
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RoleMasterList: any[] = [];
  public DesignationMasterList: any[] = [];

  public ITIGovtEMOFFICERSList: any[] = [];
  public StaffTypeList: any[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  public isModalOpen = false;

  public StaffLevelList: any = [];
  public StaffLevelChildList: any = [];
  public HostelList: any = [];
  public BranchesMasterList: any = [];
  public TechnicianList: any = [];
  public HOD_DDlList: any = [];
  public StaffParentID: number = 0;
  public LevelsID: number = 0;
  public settingsMultiselect: object = {};
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public OfficeList: any = [];
  public PostList: any = [];
  public QueryReqFormGroup!: FormGroup;
  public _EnumRole = EnumRole
  public GetRoleID: number = 0
  AddedZonalList: ITIGovtEMStaff_promotionModel[] = [];
  public ProfileStatus: number = 0;
  public ProfileStatusID: number = 0;
  public CurrentBasicDesignationList: any = [];
  public CurrentPostingEmpList: any = [];
  public GenderList: any = [];
  public BloodGroupList: any = [];
  public MaritalStatusList: any = [];
  public ServiceTypeHWList: any = [];
  public CastList: any = [];
  public ReligionList: any = [];
  public DivyangList: any = [];
  public StateList: any = [];
  public StateHomeStateList: any = [];
  public DistrictList: any = [];
  public JudicialCasePendingList: any = [];
  public SpecialAbilityList: any = [];
  public DepartmentalEnquiryPendingList: any = [];
  public PunishedInDepartmentalInquiryList: any = [];
  public _EnumProfileStatus = EnumProfileStatus;
  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;
  closeResult: string | undefined;
  public CheckUserID: number = 0;
  public GetGenderID: number = 0;
  public GetSSOIDByStaff: string = "";
  public DdlType: string = '';
  public requestSSoApi = new CommonVerifierApiDataModel();
  public IsMaritalCheck: boolean = false;
  public IsLockandSubmit: boolean = false;
  public UserProfileStatusHistoryList: any = [];
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  public isVisibleSeniorInstructor: boolean = false;
  public isVisibleRenounced: boolean = false;
  public isVisibleiDepartmentalMixed: boolean = false;


  constructor(private commonMasterService: CommonFunctionService, private ITIGovtEMStaffMasterService: ITIGovtEMStaffMaster, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2,
    private ITICollegeTradeService: ItiSeatIntakeService
  ) {

  }



  async ngOnInit() {
    
    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({


      /*txtName: ['', Validators.required],*/
      txtName: [{ value: '', disabled: true }, Validators.required],
      /*    txtName: ['', [Validators.required]],*/
      txtEmployeeID: [{ value: '', disabled: true }],
      ddlCurrentBasicDesignationID: [{ value: '', disabled: true }],
      txtCoreBusiness: [''],
      ddlCurrentPostingEmp: [{ value: '', disabled: true }],
      txtDateofPostingEmp: [''],
      ddlGenderID: [{ value: '', disabled: true }],
      /*txtPanCardNumber: ['', Validators.required],*/
      txtPanCardNumber: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/) ]],
      ddlBloodGroupID: ['', [DropdownValidators]],
      /* txtFatherName: ['', Validators.required],*/
      txtFatherName: ['', [Validators.required,Validators.pattern(/^[A-Za-z\s]+$/) ]],
      txtDateOfBirth: [{ value: '', disabled: true }, Validators.required],
      ddlMaritalStatusID: ['', [DropdownValidators]],
      //txtHusband_WifeName: [''],
      txtHusband_WifeName: ['',[ Validators.pattern(/^[A-Za-z\s]+$/)]],
      ddlServiceTypeHWID: [''],
      txtEmployeeIDOfHusband_Wife: [''],
      ddlCastID: ['', [DropdownValidators]],
      ddlReligionID: ['', [DropdownValidators]],
      ddlDivyangID: [''],
      txtTotalChildren: [{ value: '', disabled: true }],
      txtBeforeChildren: [''],
      /* txtBeforeChildren: ['', [ Validators.pattern('^[0-9]*$')]],*/

      txtAfterChildren: [''],
      txtAddress: [{ value: '', disabled: true }],
      txtPincode: [{ value: '', disabled: true }],
      ddlStateID: ['', [DropdownValidators]],
      ddlStateHomeStateID: ['', [DropdownValidators]],
      ddlDistrictID: ['', [DropdownValidators]],
      txtEmail: [{ value: '', disabled: true }],
      txtMobileNumber: [{ value: '', disabled: true }],
      txtAdharCardNumber: [{ value: '', disabled: true }],
      txtBhamashahNo: [{ value: '', disabled: true }],
      //txtPassportNo: [''],
      txtPassportNo: ['', [Validators.pattern(/^[A-Za-z0-9]+$/)]],
      txtCITSPassedYears: [''],
      txtDateOfJoiningGvernmentOfEmp: [''],
      txtFirstPostJoiningDateEmp: [''],
      ddlJudicialCasePendingID: [''],
      ddlSpecialAbilityID: [''],
      ddlDepartmentalEnquiryPendingID: [''],
      ddlPunishedInDepartmentalInquiryID: [''],
      txtDateOfPunishment: [''],
      txtDistrictYear: [''],
      txtDistrictCommak: [''],
      txtDivisionLevelYear: [''],
      txtDivisionLevelCommak: [''],
      txtStateYear: [''],
      txtStateCommak: [''],
      txtPromotionDate: [''],
      ddlPostID: [''],
      txtBusiness: [''],
      RadioisDepartmentalMixed: [''],
      RadioisRenounced: [''],
      RadioisSeniorInstructor: ['']




    })



    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;

    this.QueryReqFormGroup = this.formBuilder.group({
      txtSSOID: ['', [Validators.required]]
    });


    this.promotionData.PostID = 0;
    //this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID



    this.CheckUserID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    console.log(this.CheckUserID)
    /*alert(this.CheckUserID);*/


    this.LoadStaticDropdownLists();
    this.GetCurrentBasicDesignationListAndCurrentPostingEmpListAndPostList();
    this.GetGenderList();
    this.GetBloodGroupList();
    this.GetMaritalStatusList();
    this.GetServiceTypeHWList();
    this.GetCastList();
    this.GetReligionList();
    this.GetDivyangList();
    this.GetStateList()
    this.GetSpecialAbilityList()
    await this.GetITI_Govt_EM_GetUserProfileStatus();


    /* await this.GetAllData()*/


    if (this.CheckUserID > 0) {
      this.personalDetailsRequest.StaffID = this.CheckUserID;
      await this.GetPersonalDetails();
      await this.GetSSOID(this.CheckUserID);
      await this.SSOIDGetSomeDetails(this.GetSSOIDByStaff);
    } else {
      this.CheckUserID = 0;
      this.personalDetailsRequest.StaffID = this.sSOLoginDataModel.StaffID;
      if (this.sSOLoginDataModel.StaffID > 0) {
        await this.GetPersonalDetails();
        await this.SSOIDGetSomeDetails(this.sSOLoginDataModel.SSOID);
      }
    }
    await this.GetUserProfileStatus();

    
    if (this.CheckUserID == 0 && (this._EnumEMProfileStatus.LockAndSubmit == this.sSOLoginDataModel.ProfileID ||
      this._EnumEMProfileStatus.Approve == this.sSOLoginDataModel.ProfileID
      || this._EnumEMProfileStatus.Reject == this.sSOLoginDataModel.ProfileID)) {
      this.AddStaffBasicDetailFromGroup.disable();
      this.IsLockandSubmit = true;
    }
    else if (this.CheckUserID > 0 && (this._EnumEMProfileStatus.LockAndSubmit == this.ProfileStatusID ||
      this._EnumEMProfileStatus.Approve == this.ProfileStatusID
      || this._EnumEMProfileStatus.Reject == this.ProfileStatusID)) {
      this.AddStaffBasicDetailFromGroup.disable();
      this.IsLockandSubmit = true;
    }



    console.log(this.sSOLoginDataModel);
  }
  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }


  async GetSSOID(StaffId: number) {


    try {
      this.loaderService.requestStarted();
      await this.ITIGovtEMStaffMasterService.ITIGovtEM_GetSSOID(StaffId).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GetSSOIDByStaff = data.Data.SSOID;
        console.log("SSoList", data.Data);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  LoadStaticDropdownLists() {


    this.StateHomeStateList = [
      { ID: 1, Name: 'Yes' },
      { ID: 2, Name: 'No' }

    ];

    this.JudicialCasePendingList = [
      { ID: 1, Name: 'Yes' },
      { ID: 2, Name: 'No' }

    ];

    this.DepartmentalEnquiryPendingList = [
      { ID: 1, Name: 'Yes' },
      { ID: 2, Name: 'No' }

    ];

    this.PunishedInDepartmentalInquiryList = [
      { ID: 1, Name: 'Yes' },
      { ID: 2, Name: 'No' }

    ];
  }






  async GetCurrentBasicDesignationListAndCurrentPostingEmpListAndPostList() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignationAndPostMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CurrentBasicDesignationList = data['Data'];
          this.CurrentPostingEmpList = data['Data'];
          this.PostList = data['Data'];
          console.log(this.CurrentBasicDesignationList, "CurrentBasicDesignationListAndCurrentPostingEmpListAndPostList")
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



  async GetGenderList() {

    try {
      this.loaderService.requestStarted();
      this.DdlType = 'Gender';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.DdlType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
          console.log(this.GenderList, "GenderList")
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
  async GetBloodGroupList() {

    try {
      this.loaderService.requestStarted();
      this.DdlType = 'BloodGroup';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.DdlType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BloodGroupList = data['Data'];
          console.log(this.BloodGroupList, "BloodGroupList")
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

  async GetMaritalStatusList() {

    try {
      this.loaderService.requestStarted();
      this.DdlType = 'MaritalStatus';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.DdlType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.MaritalStatusList = data['Data'];
          console.log(this.MaritalStatusList, "MaritalStatusList")
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



  async GetCastList() {

    try {
      this.loaderService.requestStarted();
      this.DdlType = 'Cate_Cast';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.DdlType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CastList = data['Data'];
          console.log(this.CastList, "CastList")
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



  async GetServiceTypeHWList() {

    try {
      this.loaderService.requestStarted();
      this.DdlType = 'Husband_WifevtService';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.DdlType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ServiceTypeHWList = data['Data'];
          console.log(this.MaritalStatusList, "ServiceTypeHWList")
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

  async GetReligionList() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('Religion')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ReligionList = data['Data'];
          console.log(this.ReligionList, "ReligionList")
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

  async GetDivyangList() {

    try {
      this.loaderService.requestStarted();
      this.DdlType = 'Divyang_Type';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.DdlType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DivyangList = data['Data'];
          console.log(this.DivyangList, "DivyangList")
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

  async GetOfficeList(levelID:number) {
    /*this.formData.OfficeID = 0;*/
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, levelID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CurrentPostingEmpList = data['Data'];
          console.log(this.CurrentPostingEmpList, "CurrentPostingEmpList")
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

  async GetStateList() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StateList = data['Data'];
          console.log(this.StateList, "StateList")
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
      this.DistrictList = []
      await this.commonMasterService.DistrictMaster_StateIDWise(this.formData.StateID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictList = data['Data'];
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
  async GetSpecialAbilityList() {

    try {
      this.loaderService.requestStarted();
      this.DdlType = 'SpecialAbility';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.DdlType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SpecialAbilityList = data['Data'];
          console.log(this.SpecialAbilityList, "SpecialAbilityList")
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



  async GetITI_Govt_EM_GetUserProfileStatus() {

    try {
      this.loaderService.requestStarted();
      await this.ITIGovtEMStaffMasterService.GetITI_Govt_EM_GetUserProfileStatus(this.sSOLoginDataModel.StaffID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //this.Govt_EM_GetUserLevelDetails = data['Data'];
          this.ProfileStatus = data['Data'][0]["ProfileStatus"];
          /* alert(this.LevelID);*/
          //console.log(this.Govt_EM_GetUserLevelDetails, "Govt_EM_GetUserLevelDetails")
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


  async GetUserProfileStatus() {

    try {
      this.loaderService.requestStarted();
      await this.ITIGovtEMStaffMasterService.GetITI_Govt_EM_GetUserProfileStatus(this.personalDetailsRequest.StaffID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //this.Govt_EM_GetUserLevelDetails = data['Data'];
          this.ProfileStatusID = data['Data'][0]["ProfileStatus"];
          /* alert(this.LevelID);*/
          //console.log(this.Govt_EM_GetUserLevelDetails, "Govt_EM_GetUserLevelDetails")
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

  //async GetPostList() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.DDL_PostMaster()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.PostList = data['Data'];
  //        console.log(this.PostList, "PostList")
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



  async AddZonal() {


    this.isSubmitted = true;
    // If the form is invalid, return early
    //if (this.AddStaffBasicDetailFromGroup.invalid) {
    //  return;
    //}



    if (this.promotionData.PromotionDate === "") {
      this.toastr.error('Please Select Promotion Year.');
      return;
    }

    // Check for duplicate deployment dates in the AddedDeploymentList



    const isDuplicate = this.AddedZonalList.some((element: any) =>
      this.promotionData.PromotionDate === element.PromotionDate &&
      this.promotionData.PostID === element.PostID &&
      this.promotionData.Business === element.Business
    );

    if (isDuplicate) {
      this.toastr.error('Promotion Data Already Exists.');
      return;
    } else {
      // Adding office and post names from the respective lists

      this.promotionData.PostName = this.PostList.find((x: any) => x.ID == this.promotionData.PostID)?.Name;


      // Push the deployment data into the AddedDeploymentList
      this.AddedZonalList.push({ ...this.promotionData });

      // Reset the deployment request object to clear the form fields
      this.promotionData = new ITIGovtEMStaff_promotionModel();

      // After adding, reset some form values if needed
      this.isSubmitted = false;
    }
  }


  async DeleteRow(item: ITIGovtEMStaff_promotionModel) {
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {

          if (item.ID > 0) {
            try {
              this.deleteRequest.StaffID = item.ID;
              this.deleteRequest.UserID = this.sSOLoginDataModel.UserID;
              //Show Loading
              this.loaderService.requestStarted();
              /*     alert(isParent)*/
              await this.ITIGovtEMStaffMasterService.ITIGovtEM_DeleteByIdStaffPromotionHistory(this.deleteRequest)
                .then(async (data: any) => {
                  data = JSON.parse(JSON.stringify(data));
                  console.log(data)
                  this.State = data['State'];
                  this.Message = data['Message'];
                  this.ErrorMessage = data['ErrorMessage'];

                  if (this.State == EnumStatus.Success) {
                    this.toastr.success(this.Message)
                    //this.GetOfficeMasterList()
                    await this.GetPersonalDetails();
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

          else {
            const index: number = this.AddedZonalList.indexOf(item);
            if (index != -1) {
              this.AddedZonalList.splice(index, 1)
              this.toastr.success("Deleted sucessfully")
            }
          }

        }

      });

  }


  async GetPersonalDetails() {

    debugger
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      this.personalDetailsRequest.SSOID = this.sSOLoginDataModel.SSOID;
      debugger
      console.log( this.formData);



      this.personalDetailsRequest.SSOID = this.sSOLoginDataModel.SSOID;

      this.personalDetailsRequest.StaffUserID = this.sSOLoginDataModel.UserID;
      this.personalDetailsRequest.Action = 'StaffDetails';
      await this.ITIGovtEMStaffMasterService.ITIGovtEM_ITI_Govt_Em_PersonalDetailByUserID(this.personalDetailsRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          //this.formData = data['Data']['iTIGovtEMStaffPersonalDetails'];
          //this.formData.Name = data['Data']['iTIGovtEMStaffPersonalDetails']['Name'];
          //this.formData.EmployeeID = data['Data']['iTIGovtEMStaffPersonalDetails']['EmployeeID'];
          this.formData.CurrentBasicDesignationID = data['Data']['iTIGovtEMStaffPersonalDetails']['CurrentBasicDesignationID'];
          this.formData.CoreBusiness = data['Data']['iTIGovtEMStaffPersonalDetails']['CoreBusiness'];
          this.formData.CurrentPostingEmp = data['Data']['iTIGovtEMStaffPersonalDetails']['CurrentPostingEmp'];
          //this.formData.GenderID = data['Data']['iTIGovtEMStaffPersonalDetails']['GenderID'];
          this.formData.PanCardNumber = data['Data']['iTIGovtEMStaffPersonalDetails']['PanCardNumber'];
          this.formData.BloodGroupID = data['Data']['iTIGovtEMStaffPersonalDetails']['BloodGroupID'];
          this.formData.FatherName = data['Data']['iTIGovtEMStaffPersonalDetails']['FatherName'];
          this.formData.MaritalStatusID = data['Data']['iTIGovtEMStaffPersonalDetails']['MaritalStatusID'];
          this.formData.Husband_WifeName = data['Data']['iTIGovtEMStaffPersonalDetails']['Husband_WifeName'];
          this.formData.ServiceTypeHWID = data['Data']['iTIGovtEMStaffPersonalDetails']['ServiceTypeHWID'];
          this.formData.EmployeeIDOfHusband_Wife = data['Data']['iTIGovtEMStaffPersonalDetails']['EmployeeIDOfHusband_Wife'];
          this.formData.CastID = data['Data']['iTIGovtEMStaffPersonalDetails']['CastID'];
          this.formData.ReligionID = data['Data']['iTIGovtEMStaffPersonalDetails']['ReligionID'];
          this.formData.DivyangID = data['Data']['iTIGovtEMStaffPersonalDetails']['DivyangID'];
          this.formData.BeforeChildren = data['Data']['iTIGovtEMStaffPersonalDetails']['BeforeChildren'];
          this.formData.AfterChildren = data['Data']['iTIGovtEMStaffPersonalDetails']['AfterChildren'];
          this.formData.TotalChildren = data['Data']['iTIGovtEMStaffPersonalDetails']['TotalChildren'];
          //this.formData.Address = data['Data']['iTIGovtEMStaffPersonalDetails']['Address'];
          //this.formData.Pincode = data['Data']['iTIGovtEMStaffPersonalDetails']['Pincode'];
          this.formData.StateID = data['Data']['iTIGovtEMStaffPersonalDetails']['StateID'];
          this.formData.DistrictID = data['Data']['iTIGovtEMStaffPersonalDetails']['DistrictID'];
          this.formData.StateHomeStateID = data['Data']['iTIGovtEMStaffPersonalDetails']['StateHomeStateID'];
          //this.formData.Email = data['Data']['iTIGovtEMStaffPersonalDetails']['Email'];
          //this.formData.MobileNumber = data['Data']['iTIGovtEMStaffPersonalDetails']['MobileNumber'];
          //this.formData.AdharCardNumber = data['Data']['iTIGovtEMStaffPersonalDetails']['AdharCardNumber'];
          //this.formData.BhamashahNo = data['Data']['iTIGovtEMStaffPersonalDetails']['BhamashahNo'];
          this.formData.PassportNo = data['Data']['iTIGovtEMStaffPersonalDetails']['PassportNo'];
          this.formData.SpecialAbilityID = data['Data']['iTIGovtEMStaffPersonalDetails']['SpecialAbilityID'];
          this.formData.JudicialCasePendingID = data['Data']['iTIGovtEMStaffPersonalDetails']['JudicialCasePendingID'];
          this.formData.DepartmentalEnquiryPendingID = data['Data']['iTIGovtEMStaffPersonalDetails']['DepartmentalEnquiryPendingID'];
          this.formData.PunishedInDepartmentalInquiryID = data['Data']['iTIGovtEMStaffPersonalDetails']['PunishedInDepartmentalInquiryID'];
          this.formData.DistrictCommak = data['Data']['iTIGovtEMStaffPersonalDetails']['DistrictCommak'];
          this.formData.DivisionLevelCommak = data['Data']['iTIGovtEMStaffPersonalDetails']['DivisionLevelCommak'];
          this.formData.StateCommak = data['Data']['iTIGovtEMStaffPersonalDetails']['StateCommak'];
          //this.formData.DateOfBirth = this.dateSetter(data['Data']['iTIGovtEMStaffPersonalDetails']['DateOfBirth'])         
          this.formData.DateofPostingEmp = this.dateSetter(data['Data']['iTIGovtEMStaffPersonalDetails']['DateofPostingEmp'])
          this.formData.CITSPassedYears = this.dateSetter(data['Data']['iTIGovtEMStaffPersonalDetails']['CITSPassedYears'])
          this.formData.DateOfJoiningGvernmentOfEmp = this.dateSetter(data['Data']['iTIGovtEMStaffPersonalDetails']['DateOfJoiningGvernmentOfEmp'])
          this.formData.FirstPostJoiningDateEmp = this.dateSetter(data['Data']['iTIGovtEMStaffPersonalDetails']['FirstPostJoiningDateEmp'])
          this.formData.DateOfPunishment = this.dateSetter(data['Data']['iTIGovtEMStaffPersonalDetails']['DateOfPunishment'])
          this.formData.DistrictYear = this.dateSetter(data['Data']['iTIGovtEMStaffPersonalDetails']['DistrictYear'])
          this.formData.DivisionLevelYear = this.dateSetter(data['Data']['iTIGovtEMStaffPersonalDetails']['DivisionLevelYear'])
          this.formData.StateYear = this.dateSetter(data['Data']['iTIGovtEMStaffPersonalDetails']['StateYear'])

          this.formData.isSeniorInstructor = data['Data']['iTIGovtEMStaffPersonalDetails']['isSeniorInstructor'];
          this.formData.isRenounced = data['Data']['iTIGovtEMStaffPersonalDetails']['isRenounced'];
          this.formData.isDepartmentalMixed = data['Data']['iTIGovtEMStaffPersonalDetails']['isDepartmentalMixed'];
          this.formData.CurrentBasicDesignationID = data['Data']['iTIGovtEMStaffPersonalDetails']['PostID'];
          this.LevelsID = data['Data']['iTIGovtEMStaffPersonalDetails']['LevelID'];
          this.GetOfficeList(this.LevelsID)
          this.formData.CurrentPostingEmp = data['Data']['iTIGovtEMStaffPersonalDetails']['OfficeID'];

          if (this.formData.isSeniorInstructor) {
            this.isVisibleSeniorInstructor = true;
          }
          if (this.formData.isRenounced) {
            this.isVisibleRenounced = true;
          }
          if (this.formData.isDepartmentalMixed) {
            this.isVisibleiDepartmentalMixed = true;
          }

          this.AddedZonalList = data['Data']['PromotionList'];

          if (data['Data']['iTIGovtEMStaffPersonalDetails']['StateID'] > 0) {
            this.ddlState_Change();
          }
          //this.formData.ID = data['Data']['ITIGovtEMStaffPersonalDetails']["ID"];
          //this.formData.Name = data['Data']['iTIGovtEMStaffPersonalDetails']["Name"];


          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }
  //dateSetter(date: any): string {
  //  if (date != null) {
  //    const dateObj = new Date(date);
  //    const year = dateObj.getFullYear();
  //    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  //    const day = String(dateObj.getDate()).padStart(2, '0');
  //    return `${year}-${month}-${day}`;
  //  }
  //  return '';
  //}
  dateSetter(date: any): string {
    if (date != null) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        // Check for '1900-01-01'
        const isDefaultDate = parsedDate.getFullYear() === 1900 &&
          parsedDate.getMonth() === 0 &&
          parsedDate.getDate() === 1;
        if (isDefaultDate) {
          return '';
        }

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
    return '';
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

      this.loaderService.requestStarted();
      await this.commonMasterService.CommonVerifierApiSSOIDGetSomeDetails(this.requestSSoApi).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        let response = JSON.parse(JSON.stringify(data));
        if (response?.Data) {

          let parsedData = JSON.parse(response.Data); // parse string inside Data
          if (parsedData != null) {

            this.formData.Name = parsedData.displayName;
            this.formData.MobileNumber = parsedData.mobile;
            this.formData.Email = parsedData.mailPersonal;
            this.formData.AdharCardNumber = parsedData.aadhaarId;
            this.formData.BhamashahNo = parsedData.bhamashahId;
            this.formData.Pincode = parsedData.postalCode;
            this.formData.Address = parsedData.postalAddress;
            this.formData.EmployeeID = parsedData.employeeNumber;

            if (parsedData.dateOfBirth) {
              const [day, month, year] = parsedData.dateOfBirth.split('/');
              this.formData.DateOfBirth = `${year}-${month}-${day}`; // yyyy-MM-dd format
            }

            if (parsedData.gender != null) {
              this.GetGenderID = this.GenderList.find((item: any) =>
                item.Name?.toLowerCase().trim() === parsedData.gender?.toLowerCase().trim()
              )?.ID ?? 0;
              this.formData.GenderID = this.GetGenderID;
            }
            else {
              this.formData.GenderID = 0;
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




    //try {
    //  this.loaderService.requestStarted();

    //  const result = await this.http.get<any>(url).toPromise();
    //  console.log('SSO Details:', result);



    //  return result;

    //} catch (ex) {
    //  console.error('Error fetching SSO details:', ex);
    //} finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}
  }

















  //async GetAllData() {
  //  
  // // console.log('id test ', this.searchRequest.DivisionID);
  //  try {
  //    //this.loaderService.requestStarted();
  //    //await this.Staffservice.GetAllITI_Govt_EM_OFFICERS(this.searchRequest)
  //    //  .then((data: any) => {
  //    //    data = JSON.parse(JSON.stringify(data));
  //    //    console.log(data);
  //    //    this.ITIGovtEMOFFICERSList = data['Data'];
  //    //    console.log(this.ITIGovtEMOFFICERSList)
  //    //  }, (error: any) => console.error(error)
  //    //  );
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}





  async SaveData() {


    this.formData.StaffID = this.sSOLoginDataModel.StaffID;
    //if (this.AddedZonalList.length == 0) {
    //  this.toastr.error("Please Add At Least One Zonal Office");
    //}

    //this.AddedZonalList.forEach((element: any) => {

    //  element.CreatedBy = this.sSOLoginDataModel.UserID;
    //  element.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    //  element.DepartmentID = this.sSOLoginDataModel.DepartmentID;

    //})

    try {
      this.isSubmitted = true;
      if (this.AddStaffBasicDetailFromGroup.invalid) {
        return
      }
      this.loaderService.requestStarted();
      this.formData.PromotionList = this.AddedZonalList;
      await this.ITIGovtEMStaffMasterService.ITIGovtEM_Govt_StaffProfileUpdate(this.formData).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.AddedZonalList = [];
          this.formData = new ITIGovtEMStaff_PersonalDetailsModel();
          this.tabChange.emit(1);
        }
        else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);

        }
        else {
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




  ResetControl() {
    this.isSubmitted = false;
    this.formData = new ITIGovtEMStaff_PersonalDetailsModel();
    this.AddedZonalList = [];
    //const btnSave = document.getElementById('btnSave');
    //if (btnSave) btnSave.innerHTML = "Submit";
  }

  //  Check git  




  async MaritalStatusAccordingCondition() {

    if (this.formData.MaritalStatusID != 63) {
      this.IsMaritalCheck = true
    } else {
      this.IsMaritalCheck = false;
    }

  }

  async RajasthanCheckcondition() {
    if (this.formData.StateHomeStateID == 1) {
      this.formData.StateID = 6;
      this.ddlState_Change();
    }
  }

  async GetChildrenTotal() {

    this.formData.TotalChildren = (Number(this.formData.BeforeChildren) + Number(this.formData.AfterChildren));

  }




  async onUserProfileStatusHistorylist(model: any, StaffUserID: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.searchRequestUserProfileStatus.StaffID = StaffUserID;
      this.searchRequestUserProfileStatus.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.ITIGovtEMStaffMasterService.UserProfileStatusHistoryList(this.searchRequestUserProfileStatus)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserProfileStatusHistoryList = data.Data;


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



  VisibleRenounced() {
    if (this.formData.isRenounced) {
      this.isVisibleRenounced = true;
    }
    else {
      this.isVisibleRenounced = false;
    }
  }

   VisibleSeniorInstructor() {
    if (this.formData.isSeniorInstructor) {
      this.isVisibleSeniorInstructor = true;
    }
    else {
      this.isVisibleSeniorInstructor = false;
    }
  }

  VisibleiDepartmentalMixed() {
    debugger
    if (this.formData.isDepartmentalMixed) {
      this.isVisibleiDepartmentalMixed = true;
    }
    else {
      this.isVisibleiDepartmentalMixed = false;
    }
  }







}
