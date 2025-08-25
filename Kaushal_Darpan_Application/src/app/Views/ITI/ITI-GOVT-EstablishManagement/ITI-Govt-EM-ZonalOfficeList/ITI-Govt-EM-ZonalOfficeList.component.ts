import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITIGovtEMAddStaffBasicDetailDataModel, ITIGovtEMStaffMasterDataModel, ITI_Govt_EM_ZonalOFFICERSSearchDataModel, ITI_Govt_EM_ZonalOFFICERSDataModel, UpdateSSOIDByPricipleModel, ITI_Govt_EM_OFFICERSSearchDataModel, ITI_Govt_EM_OFFICERSDataModel, RequestUpdateStatus, ITI_Govt_EM_UserRequestHistoryListSearchDataModel, DeleteModel } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff, EnumEMProfileStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITICollegeTradeSearchModel } from '../../../../Models/ITI/SeatIntakeDataModel';
import { UserMasterService } from '../../../../Services/UserMaster/user-master.service';
import { AssignRoleRightsService } from '../../../../Services/AssignRoleRights/assign-role-rights.service';
import { AssignRoleRightsDataModel, UserMasterModel } from '../../../../Models/UserMasterDataModel';
@Component({
  selector: 'app-ITI-Govt-EM-ZonalOfficeList',
  standalone: false,
  
  templateUrl: './ITI-Govt-EM-ZonalOfficeList.component.html',
  styleUrl: './ITI-Govt-EM-ZonalOfficeList.component.css'
})
export class ITIGovtEMZonalOfficeListComponent implements OnInit {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new ITI_Govt_EM_ZonalOFFICERSDataModel();
  public isSubmitted: boolean = false;

  public searchRequest = new ITI_Govt_EM_ZonalOFFICERSSearchDataModel();
  public deleteRequest = new DeleteModel();
  public searchRequestUserProfileStatus = new ITI_Govt_EM_UserRequestHistoryListSearchDataModel();
  public searchRequestUpdateSSOIDByPricipleModel = new UpdateSSOIDByPricipleModel();
  staffDetailsFormData = new ITIGovtEMStaffMasterDataModel();
  public searchRequestITi = new ITICollegeTradeSearchModel();
  public isLoading: boolean = false;

  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
/*  public RoleMasterList: any[] = [];*/
  public DesignationMasterList: any[] = [];
  
  public ITIGovtEMOFFICERSList: any[] = [];
  public StaffTypeList: any[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  public isModalOpen = false;
  // New Work Pawan 18-02-2025
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
  public PostList: any = [];
  public QueryReqFormGroup!: FormGroup;
  public _EnumRole = EnumRole
  public GetRoleID: number=0
  AddedZonalList: ITI_Govt_EM_ZonalOFFICERSDataModel[] = [];
  public ZonalList: any = [];
  public UserProfileStatusHistoryList: any = [];
  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public filteredStatusList: any[] =[];
  public RequestUpdateStatus = new RequestUpdateStatus();
  groupForm!: FormGroup;
  public type: string = ''
  public Govt_EM_GetUserLevelDetails: any = [];
  public SuccessMessage: any = [];
  request = new UserMasterModel();
  public RoleMasterList: AssignRoleRightsDataModel[] = [];
  public AssignedRoleRights: any = [];
  //end table feature default
  allSelected = false;
  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;
  closeResult: string | undefined;
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  public LevelList: any = [];
  constructor(private commonMasterService: CommonFunctionService, private ITIGovtEMStaffMasterService: ITIGovtEMStaffMaster, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2,
    private ITICollegeTradeService: ItiSeatIntakeService, private UserMasterService: UserMasterService, private fb: FormBuilder, private assignRoleRightsService: AssignRoleRightsService
  ) {

  }



  async ngOnInit() {

    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
      ddlOffice: ['', [DropdownValidators]],
      ddlPost: ['', [DropdownValidators]],
      txtSSOID: ['', Validators.required],
      chkIsHod: [false]

    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;    

    this.QueryReqFormGroup = this.formBuilder.group({
      txtSSOID: ['',[Validators.required]]
    });

    this.groupForm = this.fb.group({
      ddlStatus: [0, [DropdownValidators]],
      txtRemark: ['', Validators.required]
    });
    //this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID
   
   

    await this.GetStatusList();
    await this.GetZonalList();
    await this.GetLevelList();
    await this.GetStaffTypeData();
   

   

   
    
    console.log(this.sSOLoginDataModel);

    await this.GetRoleMasterData();
    

    //this.filteredStatusList = [
    //  { ID: 1, Name: 'Approved' },
    //  { ID: 2, Name: 'Reject' }
    //];

  }
  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }


  

  async GetStatusList() {
    
    try {
      this.loaderService.requestStarted();
      this.type = 'ITIvtARRStauts';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.filteredStatusList = data['Data'];
          this.filteredStatusList = this.filteredStatusList.filter((item: any) => item.ID != this._EnumEMProfileStatus.Pending && item.ID != this._EnumEMProfileStatus.Completed && item.ID != this._EnumEMProfileStatus.LockAndSubmit)
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

 


  async GetZonalList() {
    
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.searchRequest.CreatedBy = this.sSOLoginDataModel.UserID
    debugger
    try {
      this.loaderService.requestStarted();
      await this.ITIGovtEMStaffMasterService.ITIGovtEM_Govt_AdminT2Zonal_GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ZonalList = data['Data'];
          this.loadInTable()
          console.log(this.ZonalList, "ZonalList")
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
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLevelMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LevelList = data['Data'];
          console.log(this.LevelList, "LevelList")
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

  //new
  //async GetLevelList() {
  //  try {
  //    this.loaderService.requestStarted();
  //    const data: any = await this.commonMasterService.GetLevelMaster();
  //    const response = JSON.parse(JSON.stringify(data));

  //    // 🟢 Sirf "State" name wale item ko filter karo
  //    this.LevelList = response['Data'].filter((item: any) =>
  //      item.Name?.toLowerCase().trim() === 'state'
  //    );

  //    // 🟢 Agar ek hi item hai (State), to usse by default set kar do
  //    if (this.LevelList.length === 1) {
  //      const stateLevelId = this.LevelList[0].ID;
  //      this.formData.LevelID = stateLevelId;

  //      // FormControl ke liye bhi set karo
  //      if (this.AddStaffBasicDetailFromGroup?.controls['ddlLevelID']) {
  //        this.AddStaffBasicDetailFromGroup.controls['ddlLevelID'].setValue(stateLevelId);
  //      }
  //    }

  //    console.log(this.LevelList, "Filtered LevelList");
  //  } catch (ex) {
  //    console.error(ex);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  async GetOfficeList() {
   
    this.formData.OfficeID = 0;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, this.searchRequest.LevelID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
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
  async ResetControl() {
    this.isSubmitted = false;
    this.searchRequest.LevelID = 0;
    this.searchRequest.OfficeID = 0;
    this.searchRequest.StaffTypeID = 0;
    this.searchRequest.SSOID = "";
    this.searchRequest.Name = "";    
    await this.GetZonalList();
  }



  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }


  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.ZonalList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }

  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.ZonalList.length;
  }



  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.RequestUpdateStatus.StatusIDs = 0;
    this.RequestUpdateStatus.Remark = '';
    this.isSubmitted = false;
  }



  async onSubmit(model: any, userSubmitData: any) {
    
    try {
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

      await this.ITIGovtEMStaffMasterService.ITI_GOVT_EM_ApproveRejectStaff(this.RequestUpdateStatus)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.CloseModal();
            this.GetZonalList();
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message)
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
 

  async onCheckData(userSubmitData: any) {
    
    this.RequestUpdateStatus = { ...userSubmitData };
   /* this.RequestUpdateStatus.StaffID*/
    const id = userSubmitData.StaffID;
   /* window.open(`/ITIGOVTEMPersonalDetailsApplicationTab/${id}`);*/
    this.routers.navigate(['/ITIGOVTEMPersonalDetailsApplicationTab'], { queryParams: { id: id } });
   /* this.routers.navigate(['/ITIGOVTEMPersonalDetailsApplicationTab'])*/
  }


  CloseModalPopup() {
    this.modalService.dismissAll();
  }
  async OnReset() {
    this.request = new UserMasterModel()
  }

  
  async ViewandUpdate(content: any, UserID: number) {

    const initialState = {
      UserID: UserID,
      Type: "Admin",
    };

    try {
      await this.UserMasterService.GetByID(UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          /*this.request.UserID = data['Data']["RoleID"];*/
          this.request.UserID = data['Data']["UserID"];
          this.request.SSOID = data['Data']["SSOID"];
        }, error => console.error(error));

      await this.assignRoleRightsService.GetAssignedRoleById(UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.RoleMasterList = data['Data'];


          console.log("AssignedRoleRights", this.RoleMasterList);
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
    // this.modalReference.componentInstance.initialState = initialState;

    //this.modalReference.shown(CampusPostComponent, { initialState });
    //this.modalReference.show(CampusPostComponent, { initialState });
  }


  async SaveData_AssignRole() {

    try {
      //this.isSubmitted = true;
      //if (this.CommonSubjectFormGroup.invalid) {
      //  return
      //}
      this.isLoading = true;
      //Show Loading
      this.loaderService.requestStarted();
      //child data process....
      //edit child data

      var editChild = this.RoleMasterList.filter(x => x.Marked == true);

      editChild.forEach(x => {
        x.UserID = this.request.UserID,
          x.SSOID = this.request.SSOID,
          x.ModifiedBy = this.sSOLoginDataModel.UserID,
          x.DepartmentID = this.sSOLoginDataModel.DepartmentID,
          x.InstituteID = this.sSOLoginDataModel.InstituteID
        //x.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      });

      console.log("editChild", editChild);


      await this.assignRoleRightsService.SaveData(editChild)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          this.State = data['State'];
          this.SuccessMessage = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.SuccessMessage)
            this.CloseModalPopup();
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
 
  checkMainRoleSelected(): boolean {
    return this.RoleMasterList.some(role => role.IsMainRole && role.Marked);
  }

  toggleAllCheckboxes(event: any): void {
    const isChecked = event.target.checked;
    this.RoleMasterList.forEach(r => {
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
    this.allSelected = this.RoleMasterList.every(r => this.isChecked(r.ID));
  }

  toggleIsMainRole(row: any): void {
    //const assignedRole = this.AssignedRoleRights.find((r: { ID: any; }) => r.ID === row.ID);
    //if (assignedRole)
    //{
    //  this.AssignedRoleRights.forEach((r: { IsMainRole: boolean; }) => r.IsMainRole = false);
    //  row.IsMainRole = true;
    //}

    //console.log(row);
    //if (this.isChecked(row.ID))
    //{
    //  alert(row);
    //}
  }

  ResetCheck(row: AssignRoleRightsDataModel) {
    this.RoleMasterList.forEach(r => r.IsMainRole = false);
    this.RoleMasterList.forEach(r => r.Marked = false);
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


  async GetRoleMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetRoleMasterDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        // this.RoleMasterList = data.Data;
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
            await this.ITIGovtEMStaffMasterService.ITIGovtEM_OfficeDelete(this.deleteRequest)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data)
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  this.GetZonalList()
                  //reload
                  /*        this.GetSubjectCategoryList()*/
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
      });
  }

  async onUserProfileStatusHistorylist(model: any, StaffUserID: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.searchRequestUserProfileStatus.StaffUserID = StaffUserID;
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

}
