import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { EnumStatus, EnumStatusOfStaff, ITIGovtEM_EnumStaffLevel, ITIGovtEM_EnumStaffLevelChild, ITIGovtEM_EnumStaffType, EnumEMProfileStatus, EnumRole, BTERGovtEM_EnumStaffType } from '../../../../Common/GlobalConstants';
import { BTER_DesignationWiseBranchDataModel, BTER_EM_AddStaffBasicDetailDataModel, BTER_EM_ApproveStaffDataModel, BTER_EM_DeleteModel, BTER_EM_GetPersonalDetailByUserID, BTER_EM_StaffHostelListModel, BTER_EM_StaffMasterSearchModel, BTER_EM_UnlockProfileDataModel, Bter_Govt_EM_UserRequestHistoryListSearchDataModel, StaffHostelSearchModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { CommonVerifierApiDataModel } from '../../../../Models/PublicInfoDataModel';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import {  SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StreamDDL_InstituteWiseModel } from '../../../../Models/CommonMasterDataModel';
import { StaffMasterService } from '../../../../Services/StaffMaster/staff-master.service';
import { GuestRoomManagmentService } from '../../../../Services/GuestRoomManagment/GuestRoomManagment.service';
import { GuestRoomSeatSearchModel } from '../../../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';
import { RequestUpdateStatus } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { ViewStaffProfileModalComponent } from '../view-staff-profile-modal/view-staff-profile-modal.component';
import { AssignRoleRightsService } from '../../../../Services/AssignRoleRights/assign-role-rights.service';
import { UserMasterService } from '../../../../Services/UserMaster/user-master.service';
import { AssignRoleRightsDataModel, UserMasterModel } from '../../../../Models/UserMasterDataModel';

@Component({
  selector: 'app-em-principle-staff',
  standalone: false,
  templateUrl: './em-principle-staff.component.html',
  styleUrl: './em-principle-staff.component.css'
})
export class EMPrincipleStaffComponent {
  AddStaffBasicDetailFromGroup!: FormGroup;
  StaffMasterFormGroup!: FormGroup;
  StaffMasterFormGroupOterFaculty!: FormGroup;
  groupForm!: FormGroup;

  public formData = new BTER_EM_AddStaffBasicDetailDataModel();
  public searchRequest = new BTER_EM_StaffMasterSearchModel();
  public requestSSoApi = new CommonVerifierApiDataModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public deleteRequest = new BTER_EM_DeleteModel();
  public approveRequest = new BTER_EM_ApproveStaffDataModel();
  public StreamSearch = new StreamDDL_InstituteWiseModel();
  public requestUser = new BTER_EM_GetPersonalDetailByUserID();
  public unlockRequest = new BTER_EM_UnlockProfileDataModel();
  public searchRequestUserProfileStatus = new Bter_Govt_EM_UserRequestHistoryListSearchDataModel();
  public RequestUpdateStatus = new RequestUpdateStatus();
  _DesignationWiseBranchDataModel = new BTER_DesignationWiseBranchDataModel();
  public searchRequest1 = new GuestRoomSeatSearchModel();
  public hostelSearchReq = new StaffHostelSearchModel();
  request = new UserMasterModel();

  public GuestHouseNameList: any = [];
  public UserProfileStatusHistoryList: any = [];
  _EnumRole = EnumRole;
  PostList: any[] = [];
  public StaffLevelList: any = [];
  public StaffLevelChildList: any = [];
  public HostelList: any = [];
  public BranchesMasterList: any = [];
  public TechnicianList: any = [];
  public HOD_DDlList: any = [];
  public StaffTypeList: any = [];
  public InstituteMasterDDLList: any[] = [];
  public StaffMasterList: any[] = [];
  public CategoryList: any[] = [];
  public CourseMasterDDL: any[] = [];
  public BranchInstituteDDL: any[] = [];
  public DesignationMasterDDLList: any = [];
  public GenderList: any = [];
  public DesignationWiseBranchListRole: any[] = [];
  public DesignationWiseBranchList: any[] = [];
  public OfficeList: any = [];
  public OfficeWorkList: any = [];
  public SactionedPostList: any = [];
  public RoleMasterList: any = [];
  public filteredStatusList: any[] = [];
  public StaffHostelDetails: BTER_EM_StaffHostelListModel[] = []
  public BugetHeadList: any= [];
  public PostBudgetHeadList: any = [];
  public AssignedRoleRights: any = [];

  _ITIGovtEM_EnumStaffLevel = ITIGovtEM_EnumStaffLevel;
  _ITIGovtEM_EnumStaffLevelChild = ITIGovtEM_EnumStaffLevelChild;
  _ITIGovtEM_EnumStaffType = ITIGovtEM_EnumStaffType;
  _BTERGovtEM_EnumStaffType = BTERGovtEM_EnumStaffType;
  _EnumEMProfileStatus = EnumEMProfileStatus;

  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public staffHostelIDs: string = ''
  public StaffIDforHostel: number = 0
  public isLoading: boolean = false;
  public isApprove: boolean = false;
  public type: string = ''
  public settingsMultiselect: object = {};
  public isSubmitted: boolean = false;
  public isApproveSubmitted: boolean = false;
  public isSSOVisible: boolean = false;
  public GetDesignationID: number = 0
  public StaffParentID: number = 0
  Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  IsView: boolean = false
  public IsHideShow: boolean = false
  public allSelected: boolean = false;

  @ViewChild('Modal_StaffDetailsViewModal') childComponentViewStaffProfile!: ViewStaffProfileModalComponent;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private Staffservice: ITIGovtEMStaffMaster,
    private StaffMasterService: StaffMasterService,
    private bterEstablishManagementService: BTEREstablishManagementService,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private guestRoomManagmentService: GuestRoomManagmentService,
    private assignRoleRightsService: AssignRoleRightsService,
    private UserMasterService: UserMasterService,
  ) {}

  async ngOnInit() {
    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
      StaffType: ['', [DropdownValidators]],
      StaffLevel: [''],
      StaffLevelChild: [''],
      Trade: [''],
      Technician: [''],
      InstituteID: [{ value: '', disabled: true }, [DropdownValidators]],
      SSOID: ['', [Validators.required]],
      Name: [{ value: '', disabled: true }],
      MobileNo: [{ value: '', disabled: true }],
      EmailID: [{ value: '', disabled: true }],
      Hostel: [''],
      guestRoomID: [0, []],
      ddlPost: ['', [DropdownValidators]],
      BranchID:['',[DropdownValidators]] ,
      BugetHeadID:['',[DropdownValidators]] 
    })

    this.settingsMultiselect = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      IsVerified: false,
    };

    this.StaffMasterFormGroup = this.formBuilder.group({
      InstituteID: [0, [DropdownValidators]],
      BranchID: [0, ],
      DesignationID: [0, [DropdownValidators]],
      Gender: [0, [DropdownValidators]],
      EmpInstituteID: [0, [DropdownValidators]],
      EmpDeputatedInstituteID: [0, [DropdownValidators]],
      SalaryDrawnPostID: [0, [DropdownValidators]],
      SalaryDrawnInstituteID: [0, [DropdownValidators]],

      Name: ['', [Validators.required]],
     
      IsExtraWorking: ['false'],
      IsEmployeeWorking: ['false'],
      
      IsEmpWorkingOnDeputationFromOther: [''],
      //IsEmpWorkingOnPost: ['', [Validators.required]],
      //IsEmpWorkingOnDeputationToOther: ['', [Validators.required]],
      //IsSalaryDrawnFromSamePost: ['', [Validators.required]],
      //HigherEduInstitute: ['', [Validators.required]],
      IsSalaryDrawnFromOtherInstitute: [''],
      AnyCourtCasePending: ['', [Validators.required]],
      AnyDisciplinaryActionPending: ['', [Validators.required]],
      ExtraOrdinaryLeave: ['', [Validators.required]],
      SelectionCategory: ['', [Validators.required]],
      HigherEduPermission: ['', [Validators.required]],
      
      IsEmpWorkingOnDeputationToOther: [false],
      IsEmpWorkingOnPost: [false],
      IsSalaryDrawnFromSamePost: [false],
      PhysicalDisability: [false],
      SportsQuota: [false],
      HigherEduInstitute: [''],
      
      //IsEmpWorkingOnDeputationToOther: [false, [Validators.required]],
      //IsEmpWorkingOnPost: [false, [Validators.required]],
      //IsSalaryDrawnFromSamePost: [false, [Validators.required]],


      DateOfBirth: ['', [Validators.required]],

      MobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      SSOID: ['', [Validators.required]],
      EmployeeID: [''],

      Experience: ['', [Validators.required]],
      WorkOfficeID: [0, [DropdownValidators]],

      DateOfRetirement: [''],
      Remark: [''],
      BugetHeadID:['',[Validators.required]] 
    });



    this.StaffMasterFormGroupOterFaculty = this.formBuilder.group({
      InstituteID: [0, [DropdownValidators]],
      BranchID: [0,],
      DesignationID: [0, [DropdownValidators]],
      Gender: [0, [DropdownValidators]],
      EmpInstituteID: [0, ],
      EmpDeputatedInstituteID: [0,],
      Name: ['', [Validators.required]],
      DateOfBirth: ['', [Validators.required]],
      MobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      SSOID: ['', [Validators.required]],
      EmployeeID: [''],

      
      Remark: [''],
    });


    this.groupForm = this.formBuilder.group({
      ddlStatus: [0, [DropdownValidators]],
      txtRemark: ['', Validators.required]
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.formData.InstituteID = this.sSOLoginDataModel.InstituteID;

    await this.getInstituteMasterList();
    await this.GetStaffTypeData();
    await this.GetHostelData();
    await this.GetTechnicianDll();
    await this.StaffLevelType();
    await this.GetAllData();
    await this.GetOfficeList();
    await this.GetBudgetList();

    await this.GetDesignationMasterData();
    await this.GetCategroyData();
    await this.getBranchesInstituteIDWise();

    this.approveRequest.WorkOfficeID = 0;

  }

  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }
  get _StaffMasterFormGroup() { return this.StaffMasterFormGroup.controls; }
  get _StaffMasterFormGroupOterFaculty() { return this.StaffMasterFormGroupOterFaculty.controls; }

  async GetOfficeList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, 1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
          this.OfficeWorkList = data['Data'];
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


  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {    
    if (SSOID == "") {
      this.toastr.error("Please Enter SSOID");
      return;
    }

    const username = SSOID; 
    const appName = 'madarsa.test';
    const password = 'Test@1234';

    this.requestSSoApi.SSOID = username;
    this.requestSSoApi.appName = appName;
    this.requestSSoApi.password = password;
    try {

      this.loaderService.requestStarted();
      this.formData.InstituteID = this.sSOLoginDataModel.InstituteID;
      await this.commonMasterService.CommonVerifierApiSSOIDGetSomeDetails(this.requestSSoApi).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log(data);
        let response = JSON.parse(JSON.stringify(data));
        if (response?.Data) {

          let parsedData = JSON.parse(response.Data); // parse string inside Data
          if (parsedData != null) {
            await this.DuplicateCheck(this.requestSSoApi.SSOID);    
            //this.formData.Displayname = parsedData.displayName
            this.isSSOVisible = true;
            this.formData.Displayname = parsedData.displayName;
            this.formData.MobileNo = parsedData.mobile;
            this.formData.Mailpersonal = parsedData.mailPersonal;
            this.formData.SSOID = parsedData.SSOID;
            this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.disable();
            if (parsedData.designation != null) {
              this.GetDesignationID = this.PostList.find((item: any) =>
                item.Name?.toLowerCase().trim() === parsedData.designation?.toLowerCase().trim()
              )?.ID ?? 0;

              this.formData.DesignationID = this.GetDesignationID;
              

            }
            else {
              this.formData.DesignationID = 0;
            }
          }
          else {
            this.toastr.error("Record Not Found", '', { timeOut: 5000 });
            this.formData.SSOID = "";
            this.isSSOVisible = false;
            return;
          }

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

  async GetBudgetList() {
    debugger;  
    try {
      this.loaderService.requestStarted();

        await this.commonMasterService.BTER_BGT_BudgetType(this.sSOLoginDataModel.DepartmentID, 1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BugetHeadList = data['Data'];
          console.log(this.BugetHeadList, "BugetHeadList");
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
  async refreshValidators() {
    debugger
    if(this.approveRequest.IsEmpWorkingOnDeputationFromOther == false) {
      this.StaffMasterFormGroup.get('EmpInstituteID')?.removeValidators([DropdownValidators]);
    }
    if(this.approveRequest.IsEmpWorkingOnDeputationToOther == false) {
      this.StaffMasterFormGroup.get('EmpDeputatedInstituteID')?.removeValidators([DropdownValidators]);
    }
    if(this.approveRequest.IsSalaryDrawnFromSamePost == true) {
      this.StaffMasterFormGroup.get('SalaryDrawnPostID')?.removeValidators([DropdownValidators]);
    }
    if(this.approveRequest.IsSalaryDrawnFromOtherInstitute == false) {
      this.StaffMasterFormGroup.get('SalaryDrawnInstituteID')?.removeValidators([DropdownValidators]);
    }
    if(this.approveRequest.HigherEduPermission == false) {
      this.StaffMasterFormGroup.get('HigherEduInstitute')?.removeValidators([Validators.required]);
    }

    this.StaffMasterFormGroup.get('EmpInstituteID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('EmpDeputatedInstituteID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('SalaryDrawnPostID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('SalaryDrawnInstituteID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('HigherEduInstitute')?.updateValueAndValidity();
  }

  async DuplicateCheck(SSOID: string) {

    try {
      this.loaderService.requestStarted();
      await this.Staffservice.ITIGovtEM_SSOIDCheck(SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {

          }
          else if (data.State == EnumStatus.Warning) {

            const msg = `SSOID ${SSOID} is already mapped in system.</br> If you want to assign a new role, please Assign Role Rights Icon in list.`;
            this.Swal2.Confirmation(`${msg}`, async (result: any) => {
              this.formData.SSOID = '';
              this.isSSOVisible = false;
              this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.enable();
            }, 'OK', false);

            
            // this.formData.SSOID = '';
            // this.isSSOVisible = false;
            // this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.enable();
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
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetHostelData() {
    debugger
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetHostelDDL(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.InstituteID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.HostelList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  
  onItemSelect(item: any, centerID: number) {
    
    if (!this.formData.HostelIDs.some(hostel => hostel.ID === item.ID)) {
      const selectedHostel = new BTER_EM_StaffHostelListModel();
      selectedHostel.ID = item.ID;
      selectedHostel.Name = item.Name; 
      this.formData.HostelIDs.push(selectedHostel);
    }
    
    this.formData.multiHostelIDs = this.formData.HostelIDs.map(hostel => hostel.ID).join(',');
  }

  onSelectAll(items: any[], centerID: number) {
    
    this.HostelList = [...items];
    console.log(this.HostelList, 'ListDAtA');

    if (this.HostelList.length > 0) {
      // Assuming HostelList is an array of objects, and each object has a property 'HostelID'
      this.formData.multiHostelIDs = this.HostelList.map((item :any)=> item.ID).join(',');
    }

    console.log(this.formData.multiHostelIDs, 'HostelIDSSSSS');
  }



  onDeSelectAll(centerID: number) {

    //this.SelectedInstituteList = [];
    this.formData.multiHostelIDs = '';
  }

  onFilterChange(event: any) {
    // Handle filtering logic (if needed)
    console.log(event);
  }

  onDropDownClose(event: any) {
    // Handle dropdown close event
    console.log(event);
  }

  // multiselect events
  public onFilterChanges(item: any) {
    console.log(item);
  }
  public onDropDownCloses(item: any) {
    console.log(item);
  }

  public onItemSelects(item: any) {
    console.log(item);
  }
  public onDeSelects(item: any) {
    console.log(item);
  }

async GetTechnicianDll() {
    
    try {
      this.loaderService.requestStarted();
      this.StaffParentID = 12;
      await this.commonMasterService.GetTechnicianDDL(this.StaffParentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TechnicianList = data['Data'];
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

  async StaffLevelChild() {
    debugger
    this.formData.StaffLevelChildID = 0;
    // this.AddValidationStaffLevelNon();
    this.formData.Show_StaffLevelChild = true;
    this.searchRequest.StaffLevelID = this.formData.StaffLevelID;
    /* alert(this.searchRequest.StaffLevelID);*/


    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      debugger
      await this.StaffMasterService.StaffLevelChild(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffLevelChildList = data['Data'];
        
          console.log(this.StaffLevelChildList,"StaffLevelChildList")
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
  async GetPostList() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignationAndPostMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PostList = data['Data'];
          this.PostList = this.PostList.filter((itme: any) => itme.TypeID == this.formData.StaffTypeID)
          console.log(this.PostList, "PostList")
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

  async getSactionedPostList() {
    try {
      const request: any = {};
      request.OfficeID = this.formData.OfficeID;
      request.StaffTypeID = this.formData.StaffTypeID;
      request.InstituteID = this.formData.InstituteID;
      request.BranchID = this.formData.BranchID;
      request.RoleID = this.sSOLoginDataModel.RoleID;
      request.UserID = this.sSOLoginDataModel.UserID;
      request.Action = "GetSanctionedPost";
      await this.bterEstablishManagementService.Bter_EM_GetCommonDropdownData(request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SactionedPostList = data['Data'];
      })
    } catch (error) {
      console.error(error);
    }
  }

  async resetBranchValidators() {
    const PostID = [76,78,80,81]
    if(PostID.includes(Number(this.formData.PostID)) ){
      this.AddStaffBasicDetailFromGroup.get('BranchID')?.clearValidators();
    } else {
      this.AddStaffBasicDetailFromGroup.get('BranchID')?.setValidators([DropdownValidators]);
    }

    this.AddStaffBasicDetailFromGroup.get('BranchID')?.updateValueAndValidity();
  }

  async getBudgetHeadPostWise() {
    await this.resetBranchValidators();
    try {
      const request: any = {};
      request.OfficeID = this.formData.OfficeID;
      request.StaffTypeID = this.formData.StaffTypeID;
      request.DesignationID = this.formData.PostID;
      request.BranchID = this.formData.BranchID;
      request.OfficeID = 21;  // static passing because we are using this only for institute level
      request.InstituteID = this.formData.InstituteID;
      request.RoleID = this.sSOLoginDataModel.RoleID;
      request.UserID = this.sSOLoginDataModel.UserID;
      request.Action = "GetBudgetHead_PostWise";

      await this.bterEstablishManagementService.Bter_EM_GetCommonDropdownData(request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.PostBudgetHeadList = data['Data'];
      })
    } catch (error) {
      console.error(error);
    }
  }

  async StaffLevelType() {
    this.formData.StaffLevelID = 0;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.StaffTypeID = this.formData.StaffTypeID;

    await this.GetPostList();
    await this.getSactionedPostList();

    //Teaching=30
    if (this.searchRequest.StaffTypeID == 30) {
      this.formData.StaffLevelID = 4;
      this.formData.BranchID = 0;
      await this.GetBranchesMasterData();
      this.formData.HostelID = 0;
      this.formData.guestRoomID = 0
      await this.StaffLevelChild();
    }
    //Non Teaching=31
    if (this.searchRequest.StaffTypeID == 31) {
      this.HOD_DDlList = [];
      this.formData.HODsId = 0;
      this.formData.BranchID = 0;
      this.formData.TechnicianID = 0;
      
      await this.StaffLevelChild();      
    }

    // this.formData.Show_StaffLevelChild = false;
   /* alert(this.searchRequest.StaffTypeID)*/

    try {
      this.loaderService.requestStarted();
      await this.StaffMasterService.StaffLevelType(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data,"sss");
          this.StaffLevelList = data['Data'];
          console.log(this.StaffLevelList,"StaffLevelList")
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

  async GetBranchesMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.BranchesMasterList = data.Data;
        console.log("StreamMasterList", this.BranchesMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetStaffTypeData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
        console.log("StaffTypeList", this.StaffTypeList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getInstituteMasterList() {
    try {
      const request: any = {};
      request.RoleID = this.sSOLoginDataModel.RoleID;
      request.UserID = this.sSOLoginDataModel.UserID;
      request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      request.EndTermId = this.sSOLoginDataModel.EndTermID;
      request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      request.ManagementTypeID = 1; // static passing because we are using this only for govt. institute
      request.Action = "GetInstituteMasterDDL_BTER_EM";
      await this.bterEstablishManagementService.Bter_EM_GetCommonDropdownData(request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data['Data'];
      })
    } catch (error) {
      console.error(error);
    }
  }

  async GetChangeTechcian() {
    debugger
    if (this.formData.StaffTypeID == this._BTERGovtEM_EnumStaffType.Teaching && this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.LabIncharge) {
      this.AddStaffBasicDetailFromGroup.controls['Technician'].setValidators([DropdownValidators]);
    } else {
      this.AddStaffBasicDetailFromGroup.controls['Technician'].clearValidators();

    }
    this.AddStaffBasicDetailFromGroup.controls['Technician'].updateValueAndValidity();
 
    // -------------------------
    if (this.formData.StaffTypeID == this._BTERGovtEM_EnumStaffType.Teaching && this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.Lecturer) {
      this.AddStaffBasicDetailFromGroup.controls['BranchID'].setValidators([DropdownValidators]);
    } else {
      this.AddStaffBasicDetailFromGroup.controls['BranchID'].clearValidators();

    }
    this.AddStaffBasicDetailFromGroup.controls['BranchID'].updateValueAndValidity();

    // -------------------------
    this.formData.multiHostelIDs = "";
    if (this.formData.StaffLevelID == this._ITIGovtEM_EnumStaffLevel.HostelWarden) {
      await this.GetHostelData();

      this.AddStaffBasicDetailFromGroup.controls['Hostel'].setValidators([Validators.required]);
    }
    else {
      this.AddStaffBasicDetailFromGroup.controls['Hostel'].clearValidators();
      this.formData.multiHostelIDs = "";
      this.formData.HostelIDs = [];
    }


    //DEEPAK APPLY CONDITION TEC WAR
    if (this.formData.StaffLevelChildID == 25 && this.formData.StaffTypeID == this._BTERGovtEM_EnumStaffType.Teaching && this.formData.StaffLevelID == 4) {
      await this.GetHostelData();

      this.AddStaffBasicDetailFromGroup.controls['Hostel'].setValidators([Validators.required]);
    }
    else {
      this.AddStaffBasicDetailFromGroup.controls['Hostel'].clearValidators();
      this.formData.multiHostelIDs = "";
      this.formData.HostelIDs = [];
    }
    ////DEEPAK APPLY CONDITION TEC WAR


   
    this.AddStaffBasicDetailFromGroup.controls['Hostel'].updateValueAndValidity();


    if (this.formData.StaffTypeID == this._BTERGovtEM_EnumStaffType.NonTeaching && this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.GuestRoomWarden) {
      await this.GetGuestHouseNameList();
      this.AddStaffBasicDetailFromGroup.controls['guestRoomID'].setValidators([DropdownValidators]);

    } else {
      this.AddStaffBasicDetailFromGroup.controls['guestRoomID'].clearValidators();

    }
    this.AddStaffBasicDetailFromGroup.controls['guestRoomID'].updateValueAndValidity();



  }

  async OnFormSubmit() {
    // debugger
    if(this.sSOLoginDataModel.RoleID != 7) {
      this.AddStaffBasicDetailFromGroup.get('InstituteID')?.removeValidators([DropdownValidators]);
      this.AddStaffBasicDetailFromGroup.get('InstituteID')?.updateValueAndValidity();
    }
    try {
      this.isSubmitted = true;
      if (this.AddStaffBasicDetailFromGroup.invalid) {
        return
      }    

      this.formData.ModifyBy = this.sSOLoginDataModel.UserID;
      this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.formData.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
     

      if (this.formData.StaffLevelID != this._ITIGovtEM_EnumStaffLevel.HostelWarden) {
        this.formData.HostelID = 0;
      }

      if (this.formData.StaffID == 0 && this.formData.StaffTypeID == this._BTERGovtEM_EnumStaffType.NonTeaching) {
        this.formData.StatusOfStaff = EnumStatusOfStaff.Draft;
      }

      if (this.formData.StaffID == 0 && this.formData.StaffTypeID == this._BTERGovtEM_EnumStaffType.Teaching) {
        this.formData.StatusOfStaff = EnumStatusOfStaff.Draft;
      }

      if (this.formData.StaffLevelChildID != this._ITIGovtEM_EnumStaffLevelChild.LabIncharge) {
        this.formData.TechnicianID = 0;
      }

      if (this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.HostelWarden) {
        if (this.sSOLoginDataModel.DepartmentID == 1) {
          this.formData.RoleID = 0;
        } else {
          if (this.sSOLoginDataModel.DepartmentID == 2 && this.sSOLoginDataModel.Eng_NonEng == 1) {
            this.formData.RoleID = 0;
          } else if (this.sSOLoginDataModel.DepartmentID == 2 && this.sSOLoginDataModel.Eng_NonEng == 2) {
            this.formData.RoleID = 0;
          }
        }
      } else if (this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.TPO) {
        this.formData.RoleID = 0;
      } else if (this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.BterGuestRoomWarden) {
        this.formData.RoleID = 0;
      } else if (this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.Lecturer) {
        this.formData.RoleID = 0;
      } else if (this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.LabIncharge) {
        this.formData.RoleID = 0;
      } else {
        this.formData.RoleID = 0;
      }
      this.formData.EMTypeID = 1;

      if (this.formData.HostelIDs.length > 0) {
        // Assuming HostelList is an array of objects, and each object has a property 'HostelID'
        this.formData.multiHostelIDs = this.formData.HostelIDs.map((item: any) => item.ID).join(',');
      } else {
        this.formData.multiHostelIDs = "";
      }
      this.formData.OfficeID = 21;
      this.loaderService.requestStarted();
      this.formData.BugetHeadTypeID = this.PostBudgetHeadList.find((x: any) => x.ID == this.formData.BugetHeadID)?.BudgetTypeID || 0;
      debugger;
      await this.bterEstablishManagementService.BTER_EM_AddStaffPrinciple(this.formData)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            await this.ResetControls();
            await this.GetAllData();

            const btnSave = document.getElementById('btnSave');
            if (btnSave) btnSave.innerHTML = "Submit";
          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(data.Message);
            this.ResetControls();
          } else {
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

  ResetControls() {
    this.isSubmitted = false;
    this.formData = new BTER_EM_AddStaffBasicDetailDataModel();

    const btnSave = document.getElementById('btnSave');
    if (btnSave) btnSave.innerHTML = "Submit";
    this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.enable();
    this.isSSOVisible = false;
  }
  
  async GetAllData() {

    this.searchRequest.StaffLevelID = 0;
    this.searchRequest.StaffTypeID = 0;

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.searchRequest.CreatedBy = this.sSOLoginDataModel.UserID;
    try {
      this.loaderService.requestStarted();
      await this.bterEstablishManagementService.BTER_EM_GetPrincipleStaff(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffMasterList = data['Data'];
          this.StaffMasterList = this.StaffMasterList.filter((item: any) => item.CourseType == this.sSOLoginDataModel.Eng_NonEng)
          console.log(this.StaffMasterList)
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

  async ResetControlFilter() {
    this.isSubmitted = false;   
    this.searchRequest.FilterStaffTypeID = 0;
    this.searchRequest.FilterSSOID = "";
    this.searchRequest.FilterName = "";
    await this.GetAllData();
  }

  async btnDelete_OnClick(UserID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {

          try {
            this.deleteRequest.ModifyBy = this.sSOLoginDataModel.UserID;
            this.deleteRequest.ID = UserID;
            //Show Loading
            this.loaderService.requestStarted();
            /*     alert(isParent)*/
            await this.bterEstablishManagementService.BTER_EM_DeleteStaff(this.deleteRequest)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data)
                
                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  await this.GetAllData()
                  
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
      });
  }

  async GetGuestHouseNameList() {
    try {
      this.loaderService.requestStarted();
      await this.guestRoomManagmentService.GetGuestHouseNameList(this.searchRequest1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.GuestHouseNameList = data['Data'];
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

  async getStreamMasterData() {
    debugger;
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

  async getBranchesInstituteIDWise() {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.Stream_InstituteIdWise(this.sSOLoginDataModel.DepartmentID,this.sSOLoginDataModel.Eng_NonEng,this.sSOLoginDataModel.EndTermID,this.sSOLoginDataModel.InstituteID,this.sSOLoginDataModel.FinancialYearID).then((data: any) =>
      {
        data = JSON.parse(JSON.stringify(data));
        this.BranchInstituteDDL = data.Data;
        console.log("BranchInstituteDDL", this.BranchInstituteDDL)
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

  async GetDesignationMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignationAndPostMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DesignationMasterDDLList = data.Data;
        //this.DesignationMasterDDLList = this.DesignationMasterDDLList.filter((item: any) => item.TypeID == this.approveRequest.StaffTypeID);
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

  async GetPersonalDetailByUserID(StaffUserID: any, SSOID: any) {
    try {
      debugger
      this.loaderService.requestStarted();
      this.requestUser.SSOID = SSOID;
      this.requestUser.StaffUserID = StaffUserID;
      await this.bterEstablishManagementService.BTER_EM_GetPersonalDetailByUserID(this.requestUser).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success) {
          this.approveRequest = data.Data[0];
          this.DesignationMasterDDLList = this.DesignationMasterDDLList.filter((item: any) => item.TypeID == this.approveRequest.StaffTypeID);
          if ( this.approveRequest.ProfileStatusID == EnumEMProfileStatus.Approve) {
            
            this.StaffMasterFormGroup.disable();
          }

          await this.getStreamMasterData();

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
          const roleIDs = this.DesignationWiseBranchListRole.map((item: any) => item.RoleID);
          /*const DesignationIDs = this.DesignationWiseBranchList.map((item: any) => item.DesignationID);*/
          const DesignationIDs = this.DesignationWiseBranchList.map((item: any) => item.StaffTypeID == this.approveRequest.StaffTypeID && item.DesignationID);
          if (roleIDs.includes(this.approveRequest.RoleID)) {
            this.IsHideShow = true;
            this.StaffMasterFormGroup.controls['BranchID'].setValidators([DropdownValidators]);
          }
          else if (DesignationIDs.includes(this.approveRequest.DesignationID)) {
           
            this.IsHideShow = true;
            this.StaffMasterFormGroup.controls['BranchID'].setValidators([DropdownValidators]);

          }
          else {
            this.IsHideShow = false;
            this.StaffMasterFormGroup.controls['BranchID'].clearValidators();
          }
          this.StaffMasterFormGroup.controls['BranchID'].updateValueAndValidity();
          
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

  ClosePopup(): void {
    this.modalReference?.close();  // Close the modal
    this.IsView = false
    /*window.location.reload();*/
  }

  async openModal_ApproveStaffProfile(content: any, StaffUserID: number, SSOID: any, type: boolean) {
    debugger
    this.IsView = type;

    
    await this.GetPersonalDetailByUserID(StaffUserID, SSOID);
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'md', keyboard: true, centered: true });
    this.approveRequest.IsExtraWorking = false;

    if (this.approveRequest.IsExtraWorking == false) {
      this.approveRequest.IsSalaryDrawnFromSamePost = true;
      this.approveRequest.IsSalaryDrawnFromOtherInstitute = false;
    }
    else {
      this.approveRequest.IsSalaryDrawnFromSamePost = false;
      this.approveRequest.IsSalaryDrawnFromOtherInstitute = true;
    }
  }

  // Helper function to safely stringify errors with circular reference protection
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

// Your validation check block


async GetCategroyData() {
  debugger;
  try {
    this.loaderService.requestStarted();
    await this.commonMasterService.DDL_AllCasteCategoryA()
    .then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.CategoryList = data['Data'];
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



  async ApproveStaffProfile() {
    
    await this.refreshValidators();
    this.isApproveSubmitted = true;
    
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

      // Mark all controls as touched to trigger UI validation messages if any
      this.StaffMasterFormGroup.markAllAsTouched();

      return; // Prevent further execution if form invalid
    }

    this.loaderService.requestStarted();
    this.approveRequest.StaffUserID = this.requestUser.StaffUserID;
    this.approveRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.approveRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.approveRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.approveRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    
    try {
     await this.bterEstablishManagementService.BTER_EM_ApproveStaffProfile(this.approveRequest).then(async (data: any) => {
       data = JSON.parse(JSON.stringify(data));
       if (data.State === EnumStatus.Success) {
         this.toastr.success(data.Message);

         setTimeout(() => {
           window.location.reload();
         }, 1500);

       } else if (data.State === EnumStatus.Warning) {
         this.toastr.warning(data.Message);

         setTimeout(() => {
           window.location.reload();
         }, 1500);

       } else {
         this.toastr.error('Some error! Please check.');
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

  async UnlockProfile(StaffUserID: any, SSOID: any, StaffID: any) {
    this.unlockRequest.StaffUserID = StaffUserID;
    this.unlockRequest.SSOID = SSOID;
    this.unlockRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.unlockRequest.StaffID = StaffID;
    this.loaderService.requestStarted();
    this.Swal2.Confirmation("Are you sure you want Unlock ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            await this.bterEstablishManagementService.BTER_EM_UnlockProfile(this.unlockRequest).then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if(data.State == EnumStatus.Success) {
                this.toastr.success(data.Message);
                window.location.reload();
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
      }); 
    
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

  CloseModal_EditHostel() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.isSubmitted = false;
  }

  // async AddValidationStaffLevelNon() {
  //   if (this.formData.StaffTypeID == this._BTERGovtEM_EnumStaffType.NonTeaching) {
  //     this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevelChild'].setValidators([DropdownValidators]);
  //   }
  //   else if (this.formData.StaffTypeID == this._BTERGovtEM_EnumStaffType.Teaching) {
  //     this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevelChild'].setValidators([DropdownValidators]);
  //   }
  //   else {
  //     this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevelChild'].clearValidators();

  //   }
  //   this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevelChild'].updateValueAndValidity();
  // }

  async GetStaff_HostelIDs(StaffID: number, StaffUserID: number) {
    try {
      this.loaderService.requestStarted();

      this.hostelSearchReq.StaffID = StaffID;
      this.hostelSearchReq.StaffUserID = StaffUserID;
      this.hostelSearchReq.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.hostelSearchReq.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.hostelSearchReq.EndTermID = this.sSOLoginDataModel.EndTermID
      this.hostelSearchReq.RoleID = this.sSOLoginDataModel.RoleID

      await this.bterEstablishManagementService.GetStaff_HostelIDs(this.hostelSearchReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StaffHostelDetails = data.Data;

          this.StaffHostelDetails = this.HostelList.filter((hostel: any) =>
            this.StaffHostelDetails.some((selected: any) => selected.ID === hostel.ID)
          );
        }, (error: any) => console.error(error))

    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async onEditHostel(model: any, row: any) {
    try {
      await this.GetHostelData();
      await this.GetStaff_HostelIDs(row.StaffID, row.StaffUserID);
      this.StaffIDforHostel = row.StaffID
      this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static',});
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async SaveHostelList() {
    try {
      if (this.StaffHostelDetails.length > 0) {
        this.staffHostelIDs = this.StaffHostelDetails.map((item: any) => item.ID).join(',');
      } else {
        this.toastr.error("Please select at least one hostel")
      }
      this.hostelSearchReq.StaffID = this.StaffIDforHostel;
      this.hostelSearchReq.StaffHostelIDs = this.staffHostelIDs;

      await this.bterEstablishManagementService.SaveStaff_HostelIDs(this.hostelSearchReq)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if(data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            await this.CloseModal_EditHostel();
          } else if (data.state === EnumStatus.Warning) {
            this.toastr.warning(data.Message)
          } else {
            this.toastr.error(data.ErrorMessage)
          }
        }, (error: any) => console.error(error))
    } catch (error) {
      console.error(error)
    }
  }

  async RevertStaffProfile(model: any, userSubmitData: any) {
    try {
      await this.GetStatusList()
      this.RequestUpdateStatus.StatusIDs = 249;

      this.RequestUpdateStatus = { ...userSubmitData };
      this.RequestUpdateStatus.StatusIDs = 0;
      this.RequestUpdateStatus.Remark = '';
      console.log(this.RequestUpdateStatus, "modal");
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async updateReqStatus() {

    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      this.RequestUpdateStatus.CreatedBy = this.sSOLoginDataModel.UserID;
      this.RequestUpdateStatus.StatusIDs = 249;
      this.unlockRequest.StaffUserID = 0;
      this.unlockRequest.SSOID = "";
      this.unlockRequest.ModifyBy = this.sSOLoginDataModel.UserID;
      this.unlockRequest.StaffID = this.RequestUpdateStatus.StaffID;
      this.unlockRequest.Remark = this.RequestUpdateStatus.Remark;
      this.loaderService.requestStarted();
      this.Swal2.Confirmation("Are you sure you want Revert ?",
        async (result: any) => {
          if (result.isConfirmed) {
            try {
              await this.bterEstablishManagementService.Bter_RevertStaffProfile(this.unlockRequest).then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message);
                  window.location.reload();
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
        });
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.RequestUpdateStatus.StatusIDs = 0;
    this.RequestUpdateStatus.Remark = '';
    this.isSubmitted = false;
  }

  async GetStatusList() {

    try {
      this.loaderService.requestStarted();
      this.type = 'ITIvtARRStauts';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.filteredStatusList = data['Data'];
          this.filteredStatusList = this.filteredStatusList.filter((item:any)=>item.ID==249)
          console.log(this.filteredStatusList, "GetStatusList")
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


  onEmpWorkingChange(value: boolean) {
    debugger;
    this.approveRequest.IsEmpWorkingOnPost = value;

    if (value === true) {
      // If working on post is 'Yes', default salary drawn to 'No'
      this.approveRequest.IsSalaryDrawnFromSamePost = false;
    } else {
      // If working on post is 'No', default salary drawn to 'Yes'
      this.approveRequest.IsSalaryDrawnFromSamePost = true;
    }
  }

  onSalaryDrawnChange(value: boolean) {
    debugger;
    this.approveRequest.IsSalaryDrawnFromSamePost = value;

    if (value === true) {
      // If salary is drawn from same post 'Yes', working on post should be 'No'
      this.approveRequest.IsEmpWorkingOnPost = false;
    } else {
      // If salary is drawn from same post 'No', working on post should be 'Yes'
      this.approveRequest.IsEmpWorkingOnPost = true;
    }
  }

  WorkAccordingonSalaryDrawnChange(value: boolean) {
    debugger;
    /*this.approveRequest.IsSalaryDrawnFromSamePost = value;*/

    if (value === true) {
      // If salary is drawn from same post 'Yes', working on post should be 'No'
      this.approveRequest.IsSalaryDrawnFromSamePost = false;
      this.approveRequest.IsSalaryDrawnFromOtherInstitute = true;
      
    } else {
      // If salary is drawn from same post 'No', working on post should be 'Yes'
      this.approveRequest.IsSalaryDrawnFromSamePost = true;
      this.approveRequest.IsSalaryDrawnFromOtherInstitute = false;
    }
  }

  async openModal_ApproveStaffProfileOterFaculty(content: any, StaffUserID: number, SSOID: any, type: boolean) {
    debugger
    this.IsView = type;
    await this.GetPersonalDetailByUserID(StaffUserID, SSOID);

    if (this.approveRequest.ProfileStatusID == EnumEMProfileStatus.Approve) {
      this.isApprove = true;
    } else {
      this.isApprove = false;
    }

    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'md', keyboard: true, centered: true });
  }

  async ApproveStaffProfileOterFaculty() {
    debugger
    
    this.isApproveSubmitted = true;

    if (this.StaffMasterFormGroupOterFaculty.invalid) {
      return; 
    }

    this.loaderService.requestStarted();
    this.approveRequest.StaffUserID = this.requestUser.StaffUserID;
    this.approveRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.approveRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.approveRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.approveRequest.ModifyBy = this.sSOLoginDataModel.UserID;

    try {
      await this.bterEstablishManagementService.BTER_EM_ApproveStaffProfileOterFaculty(this.approveRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);

          setTimeout(() => {
            window.location.reload();
          }, 1500);

        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);

          setTimeout(() => {
            window.location.reload();
          }, 1500);

        } else {
          this.toastr.error('Some error! Please check.');
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

  async OpenStaffProfileViewModal(StaffID: number, UserID: number) {
    //debugger
    this.childComponentViewStaffProfile.StaffID = StaffID;
    this.childComponentViewStaffProfile.UserID = UserID;
    await this.childComponentViewStaffProfile.OpenStaffProfileViewModal();
  }

  async exportToExcel() {}

  async GetAssignedRole_USerWise(UserID: number) {
    try {
      let request : any = {};
      request.UserID = UserID;
      request.ParentRoleID = this.sSOLoginDataModel.RoleID;
      await this.assignRoleRightsService.GetAssignedRole_USerWise(request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.RoleMasterList = data['Data'];
      })
    } catch (error) {
      console.error(error);
    }
  }

  async ViewandUpdate(content: any, row: any) {
    this.request.UserID = row.StaffUserID;
    this.request.SSOID = row.SSOID;
    await this.GetAssignedRole_USerWise(row.StaffUserID);

    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
  }
  CloseModalPopup() {
    this.modalService.dismissAll();
    this.request = new UserMasterModel();
  }

  checkMainRoleSelected(): boolean {
    return this.RoleMasterList.some((role: any) => role.IsMainRole && role.Marked);
  }

  toggleAllCheckboxes(event: any): void {
    const isChecked = event.target.checked;
    this.RoleMasterList.forEach((r: any) => {
      const assignedRole = this.AssignedRoleRights.find((role: { ID: number; }) => role.ID === r.ID);
      if (assignedRole) {
        assignedRole.Marked = isChecked;
      }
    });
  }

  toggleCheckbox(role: any): void {
    const assignedRole = this.AssignedRoleRights.some((r: { ID: any; }) => r.ID === role.ID);
    if (assignedRole) {
      role.Marked = !assignedRole.Marked;
    }
    this.allSelected = this.RoleMasterList.every((r: any) => this.isChecked(r.ID));
  }

  ResetCheck(row: AssignRoleRightsDataModel) {
    this.RoleMasterList.forEach((r: any) => r.IsMainRole = false);
    this.RoleMasterList.forEach((r: any) => r.Marked = false);
  }

  isChecked(roleId: number, row?: any): boolean {
    const assignedRole = this.AssignedRoleRights.some((role: { ID: number; }) => role.ID === roleId);
    if (assignedRole) {
      row.Marked = true;
    }
    return this.AssignedRoleRights.some((role: { ID: number; }) => role.ID === roleId);
  }

  isMainRole(roleId: number): boolean {
    const assignedRole = this.AssignedRoleRights.find((role: { ID: number; }) => role.ID === roleId);
    return assignedRole ? assignedRole.IsMainRole : false;
  }

  onCheckboxChange(row: any): void {
    // If unchecked, unset as the main role
    if (!row.Marked) {
      row.IsMainRole = false;
    }

  }
  onRadioChange(row: any): void {
    if (row.Marked) {
      // Unset other rows as main role
      this.RoleMasterList.forEach((r: any) => r.IsMainRole = false); row.IsMainRole = true;
    }
  }

  async SaveData_AssignRole() {
    try {
      debugger
      var editChild = this.RoleMasterList.filter((x: { Marked: boolean; }) => x.Marked == true);
      var isMainRole = this.RoleMasterList.filter((x: { IsMainRole: boolean; }) => x.IsMainRole == true);

      if(editChild.length == 0){
        this.toastr.error("Please Marked At least One Role")
        return
      }

      if(isMainRole.length == 0){
        this.toastr.error("Please Marked At least One Main Role")
        return
      }

      editChild.forEach((x: any) => {
        x.UserID = this.request.UserID,
        x.SSOID = this.request.SSOID,
        x.ModifiedBy = this.sSOLoginDataModel.UserID,
        x.DepartmentID = this.sSOLoginDataModel.DepartmentID
        x.InstituteID = this.sSOLoginDataModel.InstituteID
      });
      
      await this.assignRoleRightsService.SaveAssignedRole_UserWise(editChild)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            // await this.GetUserMasterList();
            this.CloseModalPopup();
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
  }

}
