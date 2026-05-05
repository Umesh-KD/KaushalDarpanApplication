import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITIGovtEMAddStaffBasicDetailDataModel, ITIGovtEMStaffMasterDataModel, ITI_Govt_EM_ZonalOFFICERSSearchDataModel, ITI_Govt_EM_ZonalOFFICERSDataModel, UpdateSSOIDByPricipleModel, ITI_Govt_EM_OFFICERSSearchDataModel, ITI_Govt_EM_OFFICERSDataModel, ITI_Govt_EM_RoleOfficeMapping_GetAllDataSearchDataModel, ITI_Govt_EM_NodalSearchDataModel, ITI_Govt_EM_PersonalDetailByUserIDSearchModel } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITICollegeTradeSearchModel } from '../../../../Models/ITI/SeatIntakeDataModel';
import { CommonVerifierApiDataModel } from '../../../../Models/PublicInfoDataModel';

@Component({
  selector: 'app-ITI-Govt-EM-ZonalOfficeMaster',
  standalone: false,
  templateUrl: './ITI-Govt-EM-ZonalOfficeMaster.component.html',
  styleUrl: './ITI-Govt-EM-ZonalOfficeMaster.component.css'
})
export class ITIGovtEMZonalOfficeMasterComponent implements OnInit {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new ITI_Govt_EM_ZonalOFFICERSDataModel();
  public isSubmitted: boolean = false;

  public searchRequest = new ITI_Govt_EM_ZonalOFFICERSSearchDataModel();
  public NodalsearchRequest = new ITI_Govt_EM_NodalSearchDataModel();
  public searchRequestUpdateSSOIDByPricipleModel = new UpdateSSOIDByPricipleModel();
  staffDetailsFormData = new ITIGovtEMStaffMasterDataModel();
  public searchRequestITi = new ITICollegeTradeSearchModel();
  public isLoading: boolean = false;

  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RoleMasterList: any[] = [];
  public DesignationMasterList: any[] = [];
  public ItiCollegesListAll: any[] = [];
  
  public ITIGovtEMOFFICERSList: any[] = [];
  public Govt_EM_GetUserLevelDetails: any[] = [];
  public StaffTypeList: any[] = []
  public StaffPostTypeList: any[] = []
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
  public settingsMultiselect: object = {};
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public OfficeList: any = [];
  public LevelList: any = [];
  public PostList: any = [];
  public QueryReqFormGroup!: FormGroup;
  public _EnumRole = EnumRole
  public GetRoleID: number = 0
  public roleModel= new ITI_Govt_EM_RoleOfficeMapping_GetAllDataSearchDataModel();
  public LevelID: number = 0
  public GetOfficeOldID: number = 0
  public GetLevelOldID: number = 0
  public DivisionID: number = 0
  public IsDisable: boolean = false
  public IsHodIsDisable: boolean = false
  showIsHod = false;
  public GetIsHodOldID: number = 0
  public isSSOVisible: boolean = false;
  public ListITICollegeByManagement: any = [];
  public StaffListCheckDuplicate: any = [];
  public requestSSoApi = new CommonVerifierApiDataModel();
  AddedZonalList: ITI_Govt_EM_ZonalOFFICERSDataModel[] = [];
  public GetDesignationID: number = 0
  public DistrictList: any = [];
  public OldOfficeID: number = 0
  public OldInsituteID: number = 0
  public OldNodalDistrictID: number = 0
  public personalDetailsRequest = new ITI_Govt_EM_PersonalDetailByUserIDSearchModel();
  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;
  closeResult: string | undefined;
  public alreadyExists: any = [];
  public postNotExists: any = [];

  constructor(
    private commonMasterService: CommonFunctionService, 
    private ITIGovtEMStaffMasterService: ITIGovtEMStaffMaster, 
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder, 
    private routers: Router, 
    private ITICollegeTradeService: ItiSeatIntakeService,
  ) { }

  async ngOnInit() {
    
    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
      ddlRoleID: ['', [DropdownValidators]],
      ddlStaffType: ['', [DropdownValidators]],
      StaffPostTypeID: ['', [DropdownValidators]],
      ddlOffice: ['', [DropdownValidators]],
      ddlITICollegeTrade: [''],
      ddlLevelID: [{ value: ''}, [DropdownValidators]],      
      ddlPost: ['', [DropdownValidators]],
      txtSSOID: ['', Validators.required],
      txtName: [{ value: '', disabled: true }],
      txtMobile: [{ value: '', disabled: true }],
      txtEmailID: [{ value: '', disabled: true }],
      // chkIsHod: [false],
      ddlDistrictID:['']

    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;    

    this.QueryReqFormGroup = this.formBuilder.group({
      txtSSOID: ['',[Validators.required]]
    });
    this.IsHodIsDisable = true;
    await this.GetITI_Govt_EM_GetUserLevel();
    await this.GetStaffPostTypeList();
    await this.GetLevelList();
   // this.GetRoleMasterData();
    await this.GetStaffTypeData();
    await this.GetPostList();
   
    /*await this.getITICollege();*/
   /* await this.GetAllData()*/
  }
  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }

  async ddl_DivisionID_Wise_District() {
    try {
      this.DistrictList = [];
      await this.commonMasterService.DistrictMaster_DivisionIDWise(this.DivisionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetITI_Govt_EM_GetUserLevel() {
    
    try {
      await this.ITIGovtEMStaffMasterService.ITIGovtEM_ITI_Govt_EM_GetUserLevel(this.sSOLoginDataModel.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          this.Govt_EM_GetUserLevelDetails = data['Data'];
          this.LevelID = data['Data'][0]["LevelID"];
          this.DivisionID = data['Data'][0]["DivisionID"];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  async GetOfficeList() {
    this.formData.OfficeID = 0;
    try {
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, this.formData.LevelID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];

          if (this.formData.LevelID == 1 && this.sSOLoginDataModel.StaffID > 0) {            
            if (this.sSOLoginDataModel.OfficeID != 0) {
              this.OfficeList = this.OfficeList.filter((item: any) => item.ID == this.sSOLoginDataModel.OfficeID)
            }

          } else {
            this.OfficeList = this.OfficeList;
            if(this.sSOLoginDataModel.RoleID == EnumRole.DTETraing){
              this.OfficeList = this.OfficeList.filter((item: any) => item.ID != 15)
            }
          }
          console.log(this.OfficeList, "OfficeList")          
        }, error => console.error(error));


      this.personalDetailsRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.personalDetailsRequest.StaffUserID = this.sSOLoginDataModel.UserID;
      this.personalDetailsRequest.Action = 'StaffDetails';
      await this.ITIGovtEMStaffMasterService.ITIGovtEM_ITI_Govt_Em_PersonalDetailByUserID(this.personalDetailsRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.GetOfficeOldID = data['Data']['iTIGovtEMStaffPersonalDetails']['OfficeID'];
          this.GetLevelOldID = data['Data']['iTIGovtEMStaffPersonalDetails']['LevelID'];
          this.GetIsHodOldID = data['Data']['iTIGovtEMStaffPersonalDetails']['IsHod'];
          this.OldNodalDistrictID = data['Data']['iTIGovtEMStaffPersonalDetails']['NodalDistrictID'];
          

          if (this.GetLevelOldID != 0 && this.formData.LevelID == this.GetLevelOldID) {
            if (data?.Data?.iTIGovtEMStaffPersonalDetails?.IsHod === true) {
              this.GetIsHodOldID = 1;
              this.formData.OfficeID = 0;
              this.OfficeList = this.OfficeList.filter((item: any) => item.ID == this.sSOLoginDataModel.OfficeID)
            }
          } else {
            this.GetIsHodOldID = 0;
          }
        }, error => console.error(error)); 
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async OfficeITIWiseCollegeAndDirstrict() {    
    await this.GetRoleMasterData();
    this.formData.InstituteID = 0;
    this.formData.RoleID = 0;
    if (this.formData.LevelID == 2 && this.formData.OfficeID == 11) {
      // await this.getITICollege();
      await this.GetCollegesListAll();
      this.AddStaffBasicDetailFromGroup.controls['ddlITICollegeTrade'].setValidators([DropdownValidators]);
    }
    else if (this.formData.LevelID == 2 && this.formData.OfficeID == 15 && this.OldNodalDistrictID==0) {
      await this.ddl_DivisionID_Wise_District();
      this.AddStaffBasicDetailFromGroup.controls['ddlDistrictID'].setValidators([DropdownValidators]);
    }

    else {
      this.AddStaffBasicDetailFromGroup.controls['ddlITICollegeTrade'].clearValidators();
      this.AddStaffBasicDetailFromGroup.controls['ddlDistrictID'].clearValidators();
    }

    this.AddStaffBasicDetailFromGroup.controls['ddlITICollegeTrade'].updateValueAndValidity();
    this.AddStaffBasicDetailFromGroup.controls['ddlDistrictID'].updateValueAndValidity();
  }

  async DuplicateNodal() {
   
    this.NodalsearchRequest.DistrictID = this.formData.DistrictID;
    this.NodalsearchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.NodalsearchRequest.LevelID = this.formData.LevelID;
    try {
      await this.ITIGovtEMStaffMasterService.GetITI_Govt_CheckDistrictNodalOffice(this.NodalsearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {


          }
          else if (data.State == EnumStatus.Warning) {            
            this.toastr.warning(data.Message);
            this.formData.RoleID = 0;
          }
          else {
            this.toastr.error(data.ErrorMessage);
            this.formData.RoleID = 0;
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {   
    if (SSOID == "") {
      this.toastr.error("Please Enter SSOID");
      return;
    }

    const username = SSOID; // or hardcoded 'SIDDHA.AZAD'
    const appName = 'madarsa.test';
    const password = 'Test@1234';

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
            this.DuplicateCheck(this.requestSSoApi.SSOID);
            //this.formData.Displayname = parsedData.displayName
            this.isSSOVisible = true;
            this.formData.Name = parsedData.displayName;
            this.formData.MobileNo = parsedData.mobile;
            this.formData.EmailID = parsedData.mailPersonal;
            this.formData.SSOID = parsedData.SSOID;
            this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.disable();
            if (parsedData.designation != null) {
              this.GetDesignationID = this.PostList.find((item: any) =>
                item.Name?.toLowerCase().trim() === parsedData.designation?.toLowerCase().trim()
              )?.ID ?? 0;
              this.formData.PostID = this.GetDesignationID;
            }
            else {
              this.formData.PostID = 0;
            }
          }
          else {
            this.toastr.error("Record Not Found");
            this.formData.SSOID = "";
            this.isSSOVisible = false;
            return;
          }

          //alert("SSOID: " + parsedData.SSOID); // show SSOID in alert
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  // async getITICollege() {
    
  //   try {
  //     this.searchRequestITi.Action = "_ITICollegeWithoutAcademicYearID";
  //     this.searchRequestITi.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
  //     this.searchRequestITi.ManagementTypeId = 1;

  //     await this.ITICollegeTradeService.getITICollegeByManagement(this.searchRequestITi)
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.ListITICollegeByManagement = data['Data'];
  //         this.ListITICollegeByManagement = this.ListITICollegeByManagement.filter((item: any) => item.DivisionId == this.DivisionID)
  //         console.log(this.DivisionID,'DivisionID')
  //         console.log(this.ListITICollegeByManagement, "ListITICollegeByManagement")
  //       }, error => console.error(error));
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  // }

  async getITICollege() {
    //
    // this.ID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListITICollegeByManagement = data['Data'];
          this.ListITICollegeByManagement = this.ListITICollegeByManagement.filter((x: any) => x.ManagementTypeId == 1);
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

  //old
  async GetLevelList() {
    try {
      await this.commonMasterService.GetLevelMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LevelList = data['Data'];
          debugger
          if (this.sSOLoginDataModel.StaffID > 0) {
            if (this.LevelID === 1 && this.sSOLoginDataModel.RoleID == this._EnumRole.DTE_TrainingT2_establishment) {
              this.LevelList = this.LevelList.filter((item: any) => item.ID != 2)
            }
            if (this.LevelID === 1 && this.sSOLoginDataModel.RoleID != this._EnumRole.DTE_TrainingT2_establishment) {
              this.LevelList = this.LevelList.filter((item: any) => item.ID == 1)
            }

            if (this.LevelID === 3) {
              this.LevelList = this.LevelList.filter((item: any) => item.ID != 1)
            }
            if (this.LevelID === 2 && this.sSOLoginDataModel.OfficeID == 15) {
              this.LevelList = this.LevelList.filter((item: any) => item.ID == 2)
            }
          } else {
            if (this.sSOLoginDataModel.StaffID == 0) {
              this.LevelList = this.LevelList.filter((item: any) => item.ID == 1 || item.ID == 2)
            }
          }
          this.LevelID
          
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async onRoleChange(event: any) {    
    const selectedRoleId = +event.target.value;
    if(selectedRoleId == 97){
      await this.DuplicateNodal();
    }
  
    const selectedRole = this.RoleMasterList.find((item: any) => item.ID === selectedRoleId);

    if (selectedRole && selectedRole.IsHod) {
      this.showIsHod = true;
      this.IsHodIsDisable = false; // enable the checkbox
    } else {
      this.showIsHod = false;
      this.IsHodIsDisable = true;  // disable the checkbox
      this.formData.IsHod = false; // reset value
    }
  }




  async GetRoleMasterData() {    
    try {
      debugger
      // await this.commonMasterService.GetRoleMasterDDL(, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
      this.roleModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.roleModel.RoleID = this.sSOLoginDataModel.RoleID;
      this.roleModel.OfficeID = this.formData.OfficeID
      await this.ITIGovtEMStaffMasterService.ITIGovtEM_Govt_RoleOfficeMapping_GetAllData(this.roleModel).then((data: any) => {
     
        data = JSON.parse(JSON.stringify(data));
        this.RoleMasterList = data.Data;
        this.RoleMasterList = this.RoleMasterList.filter((item: any) => item.OfficeTypeID == this.formData.OfficeID)
        if (this.sSOLoginDataModel.RoleID > 0) {
          this.RoleMasterList = this.RoleMasterList.filter((item: any) => item.ID != this.sSOLoginDataModel.RoleID)
        }
        ///DTE_TrainingT2_establishment case 
        if (this.GetRoleID == this._EnumRole.DTE_TrainingT2_establishment) {
          this.RoleMasterList = this.RoleMasterList.filter((item: any) => item.ID != 16);
        } else {
          if (this.GetIsHodOldID > 0) {
            this.RoleMasterList = this.RoleMasterList.filter((item: any) => item.IsHod != true)
          }
        }
        console.log("RoleMasterList", this.RoleMasterList);
      })
    } catch (error) {
      console.error(error);
    }
  }
  async GetPostList() {
   
    try {
      await this.commonMasterService.GetCommonMasterData('PostMaster', this.formData.StaffPostTypeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PostList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetStaffTypeData() {
    try {
      await this.commonMasterService.GetCommonMasterData('ITI_StaffType').then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
      })
    } catch (error) {
      console.error(error);
    }
  }

  async AddZonal() {
    this.isSubmitted = true;
    // If the form is invalid, return early
    if (this.AddStaffBasicDetailFromGroup.invalid) {
      return;
    }
    debugger
    // Check for duplicate deployment dates in the AddedDeploymentList
    const isDuplicate = this.AddedZonalList.some((element: any) =>
      this.formData.SSOID == element.SSOID
    );

    if (isDuplicate) {
      this.toastr.error('SSO ID Already Exists.');
      return;
    } else {
      // Adding office and post names from the respective lists
      this.formData.OfficeName = this.OfficeList.find((x: any) => x.ID == this.formData.OfficeID)?.Name;
      this.formData.LevelName = this.LevelList.find((x: any) => x.ID == this.formData.LevelID)?.Name;
      this.formData.PostName = this.PostList.find((x: any) => x.ID == this.formData.PostID)?.Name;
      this.formData.RoleName = this.RoleMasterList.find((x: any) => x.ID == this.formData.RoleID)?.Name;
      this.formData.StaffTypeName = this.StaffTypeList.find((x: any) => x.ID == this.formData.StaffTypeID)?.Name;
      this.formData.InstituteName = this.ListITICollegeByManagement.find((x: any) => x.ID == this.formData.InstituteID)?.Name;
      this.formData.DistrictName = this.DistrictList.find((x: any) => x.ID == this.formData.DistrictID)?.Name;
      // Push the deployment data into the AddedDeploymentList
      this.AddedZonalList.push({ ...this.formData });

      // Reset the deployment request object to clear the form fields
      this.formData = new ITI_Govt_EM_ZonalOFFICERSDataModel();

      // After adding, reset some form values if needed
      this.isSubmitted = false;
      this.isSSOVisible = false;
      this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.enable();
    }
  }


  async DeleteRow(item: ITI_Govt_EM_ZonalOFFICERSDataModel) {
    
    const index: number = this.AddedZonalList.indexOf(item);
    if (index != -1) {
      this.AddedZonalList.splice(index, 1)
    }
  }

  async DuplicateCheck(SSOID : string) {
    try {
      await this.ITIGovtEMStaffMasterService.ITIGovtEM_SSOIDCheck(SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
          
           
          }
          else if (data.State == EnumStatus.Warning) {
            
            const msg = `SSOID ${SSOID} is already mapped.To assign a new role, please use the Additional Role Mapping section.`;
            this.toastr.warning(msg);
            this.formData.SSOID = '';
            this.isSSOVisible = false;
            this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.enable();
          }
          else {
            this.toastr.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  } 

  async SaveData() {

    if (this.AddedZonalList.length == 0) {
      this.toastr.error("Please Add At Least One Office");
      return;
    }

    this.AddedZonalList.forEach((element: any) => {
     
      element.CreatedBy = this.sSOLoginDataModel.UserID;
      element.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      element.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      
    })

    try {

      await this.ITIGovtEMStaffMasterService.ITIGovtEM_Govt_AdminT2Zonal_Save(this.AddedZonalList).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {    
          this.toastr.success(data.Message);
          this.AddedZonalList = [];
          this.routers.navigate(['/ITIGovtEMZonalOfficeList']);
        }
        else if (data.State == EnumStatus.Warning) {
          if(data.Data?.length > 0){
            data.Data.forEach((element: any) => {
              if(element.ErrorType == 'AlreadyExists'){
                const duplicateSSOIDs = data.Data.map((item: any) => item.SSOID).join(', ');
                const msg = `SSOID ${duplicateSSOIDs} is already mapped.To assign a new role, please use the Additional Role Mapping section.`;
                this.toastr.warning(msg);
              } else if(element.ErrorType == 'PostNotExists'){
                const duplicateSSOIDs = data.Data.map((item: any) => item.SSOID).join(', ');
                const msg = `For SSOID ${duplicateSSOIDs} their is no vacancy is available.`;
                this.toastr.warning(msg);
              }
            })
          }
          // const duplicateSSOIDs = data.Data.map((item: any) => item.SSOID).join(', ');
          // const msg = `SSOID ${duplicateSSOIDs} is already mapped.To assign a new role, please use the Additional Role Mapping section.`;
          // this.toastr.warning(msg);
          // this.AddedZonalList = [];
        }
        else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  async goBack() {
    window.location.href = '/ITIGovtEMZonalOfficeList';
  }

  ResetControl() {
    this.isSubmitted = false;
    this.formData = new ITI_Govt_EM_ZonalOFFICERSDataModel();
    this.AddedZonalList = [];
    this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.enable();
    this.isSSOVisible = false;
    //const btnSave = document.getElementById('btnSave');
    //if (btnSave) btnSave.innerHTML = "Submit";
  }

  async GetStaffPostTypeList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('PostType').then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffPostTypeList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetCollegesListAll() {
    try {
      const request: any = {}
      request.Action = 'GovtCollegesDDL_Planning';
      request.RoleID = this.sSOLoginDataModel.RoleID;
      request.UserID = this.sSOLoginDataModel.UserID;

      await this.ITIGovtEMStaffMasterService.ITI_EM_DropdownGetData(request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiCollegesListAll = data.Data
        console.log(this.ItiCollegesListAll, "ItiCollegesListAll")
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
