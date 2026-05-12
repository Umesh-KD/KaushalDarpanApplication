import { Component, ViewChild } from '@angular/core';
import { BTER_EM_ApproveStaffDataModel, BTER_EM_DeleteModel, BTER_EM_GetPersonalDetailByUserID, BTER_EM_StaffHostelListModel, BTER_EM_StaffListSearchModel, BTER_EM_UnlockProfileDataModel, Bter_Govt_EM_UserRequestHistoryListSearchDataModel, StaffDetailsServicePreviewDataModel, StaffGuestHouseSearchModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { EnumEMProfileStatus, EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import { ToastrService } from 'ngx-toastr';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StreamDDL_InstituteWiseModel } from '../../../../Models/CommonMasterDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { RequestUpdateStatus } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { UserRequestService } from '../../../../Services/UserRequest/user-request.service';
import { __values } from 'tslib';
import { ActivatedRoute } from '@angular/router';
import { AppsettingService } from '../../../../Common/appsetting.service';
import * as XLSX from 'xlsx';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { ViewStaffProfileModalComponent } from '../view-staff-profile-modal/view-staff-profile-modal.component';
import { GuestRoomSeatSearchModel } from '../../../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';
import { GuestRoomManagmentService } from '../../../../Services/GuestRoomManagment/GuestRoomManagment.service';

@Component({
  selector: 'app-bter-em-staff-list',
  standalone: false,
  templateUrl: './bter-em-staff-list.component.html',
  styleUrl: './bter-em-staff-list.component.css'
})
export class BTEREMStaffListComponent {
  public searchRequest = new BTER_EM_StaffListSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public deleteRequest = new BTER_EM_DeleteModel();
  StaffMasterFormGroup!: FormGroup;
  StaffMasterFormGroupGuestHouse!: FormGroup;
  public StaffTypeList: any = [];
  public CategoryList: any = [];
  public OfficeList: any = [];
  public OfficeWorkList: any = [];
  public LevelList: any = [];
  public Table_SearchText: string = '';
  public StaffList: any = [];
  _EnumEMProfileStatus = EnumEMProfileStatus;
  public isSubmitted: boolean = false;
  IsView: boolean = false
  groupForm!: FormGroup;
  //table feature default
  modalReference: NgbModalRef | undefined;
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
  public CourseMasterDDL: any[] = [];
  public requestUser = new BTER_EM_GetPersonalDetailByUserID();
  public approveRequest = new BTER_EM_ApproveStaffDataModel();
  public StreamSearch = new StreamDDL_InstituteWiseModel();
  public searchRequestUserProfileStatus = new Bter_Govt_EM_UserRequestHistoryListSearchDataModel();
  public staffDetailsServicePreview = new StaffDetailsServicePreviewDataModel();
  public unlockRequest = new BTER_EM_UnlockProfileDataModel();
  public RequestUpdateStatus = new RequestUpdateStatus();
  public searchRequest1 = new GuestRoomSeatSearchModel();
  public guestHouseRequest = new StaffGuestHouseSearchModel();
  public guestHouseSaveRequest = new StaffGuestHouseSearchModel();
  public StaffGuestHouseDetails: BTER_EM_StaffHostelListModel[] = []
  public UserProfileStatusHistoryList: any = [];
  public isApproveSubmitted: boolean = false;
  public settingsMultiselect: object = {};
  public isLoading: boolean = false;
  public State: number = 0;
  public StaffIDforGuestHouse: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public staffGuestHouseIDs: string = '';
  public filteredStatusList: any[] = [];
  public type: string = ''
  public InstituteMasterDDL: any[] = [];
  public IsHideShow: boolean = false
  public DesignationMasterDDLList: any = [];
  public GenderList: any = [];
  public InstituteMasterDDLList: any[] = [];
  public GuestHouseNameList: any = [];
  public BugetHeadList:any=[];
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  @ViewChild('Modal_StaffDetailsViewModal') childComponentViewStaffProfile!: ViewStaffProfileModalComponent;

  public isApprove: boolean = false;
  public isModalOpen: boolean = false;
  _EnumRole = EnumRole;
  constructor(
    private loaderService: LoaderService,
    private bterEstablishManagementService: BTEREstablishManagementService,
    private commonMasterService: CommonFunctionService,
    private Swal2: SweetAlert2,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private appsettingConfig:AppsettingService,
    private formBuilder: FormBuilder,
    private userRequestService: UserRequestService,
    private activatedRoute: ActivatedRoute,
    private guestRoomManagmentService: GuestRoomManagmentService,
  ) {}

  async ngOnInit() {
    this.StaffMasterFormGroup = this.formBuilder.group({
      InstituteID: [0],
      BranchID: [0,],
      DesignationID: [0, [DropdownValidators]],
      Gender: [0, [DropdownValidators]],
      EmpInstituteID: [0, [DropdownValidators]],
      EmpDeputatedInstituteID: [0, [DropdownValidators]],
      SalaryDrawnPostID: [0, [DropdownValidators]],
      SalaryDrawnInstituteID: [0, [DropdownValidators]],

      Name: ['', [Validators.required]],
      // SanctionedPosts: ['', [Validators.required]],
      // IsWorking: ['', [Validators.required]],
      // IsVacant: ['', [Validators.required]],
      IsExtraWorking: ['', [Validators.required]],
      IsEmpWorkingOnPost: ['', [Validators.required]],
      IsEmpWorkingOnDeputationFromOther: [''],
      IsEmpWorkingOnDeputationToOther: ['', [Validators.required]],
      IsSalaryDrawnFromSamePost: ['', [Validators.required]],
      IsSalaryDrawnFromOtherInstitute: [''],
      AnyCourtCasePending: ['', [Validators.required]],
      AnyDisciplinaryActionPending: ['', [Validators.required]],
      ExtraOrdinaryLeave: ['', [Validators.required]],
      SelectionCategory: ['', [Validators.required]],
      HigherEduPermission: ['', [Validators.required]],
      HigherEduInstitute: ['', [Validators.required]],
      DateOfBirth: ['', [Validators.required]],
      MobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      SSOID: ['', [Validators.required]],
      EmployeeID: [''],
      Experience: ['', [Validators.required]],
      DateOfRetirement: [''],
      Remark: [''],
      WorkOfficeID: [0, [DropdownValidators]],
      BugetHeadID:['',[Validators.required]] ,
      PhysicalDisability:['',[Validators.required]], 
      SportsQuota:['',[Validators.required]], 
    });


    this.groupForm = this.formBuilder.group({
      ddlStatus: [0, [DropdownValidators]],
      txtRemark: ['', Validators.required]
    });


    this.StaffMasterFormGroupGuestHouse = this.formBuilder.group({
      DesignationID: [0, [DropdownValidators]],
      Gender: [0, [DropdownValidators]],
      EmpInstituteID: [0,],
      EmpDeputatedInstituteID: [0,],
      Name: ['', [Validators.required]],
      DateOfBirth: ['', [Validators.required]],
      MobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      SSOID: ['', [Validators.required]],
      EmployeeID: [''],


      Remark: [''],
    });

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

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));


    let statusID = Number(this.activatedRoute.snapshot.queryParamMap.get("status")?.toString());
   
    if(statusID==1){
        this.searchRequest.status=0
    }
    else if(statusID==2)
    {
        this.searchRequest.status=247
    }
    else if(statusID==3)
    {
        this.searchRequest.status=3   //check in backend if pending or 249(revert)
    }
    else if(statusID==4){
    this.searchRequest.status=248 
    }
    else{
      this.searchRequest.status=0
    }

    await this.GetStatusList();
    await this.BTER_EM_GetStaffList();
    await this.GetOfficeList();
    await this.GetBudgetList();
    await this.GetGuestHouseNameList();
    await this.GetInstituteMaster();
    await this.GetStaffTypeData();
    await this.GetDesignationMasterData();
    await this.getInstituteMasterList();
    await this.GetCategroyData();
    this.approveRequest.WorkOfficeID = 0;
  }

  get _StaffMasterFormGroup() { return this.StaffMasterFormGroup.controls }
  get _StaffMasterFormGroupGuestHouse() { return this.StaffMasterFormGroupGuestHouse.controls }

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


  GetInstituteMaster() {
    //const officeList = [
    //  { InstituteID: 10001, InstituteName: 'DTE', OfficeTypeID: 17 },
    //  { InstituteID: 10002, InstituteName: 'BTER', OfficeTypeID: 18 },
    //  { InstituteID: 10003, InstituteName: 'TTC', OfficeTypeID: 19 }
    //];

    this.commonMasterService.InstituteMaster(
      this.sSOLoginDataModel.DepartmentID,
      this.sSOLoginDataModel.Eng_NonEng,
      this.sSOLoginDataModel.EndTermID
    ).then((response: any) => {
      const instituteList = Array.isArray(response?.Data) ? response.Data : [];
      this.InstituteMasterDDL = instituteList;
      //this.InstituteMasterDDL = officeList.concat(instituteList);
    });
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


  async BTER_EM_GetStaffList() {
    debugger
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID
    this.searchRequest.status=this.searchRequest.status
    this.searchRequest.Eng_NonEng=this.sSOLoginDataModel.Eng_NonEng
    this.searchRequest.GuestHouseID = this.sSOLoginDataModel.GuestHouseID;
    try {
      this.loaderService.requestStarted();
      await this.bterEstablishManagementService.BTER_EM_GetStaffList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
        
          this.StaffList = data['Data'];
        //  this.StaffList = this.StaffList.filter((item: any) => item.CourseType == this.sSOLoginDataModel.Eng_NonEng)

          this.loadInTable()
          console.log(this.StaffList, "ZonalList")
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

  exportToExcel(): void {
    debugger
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID','MobileNo','LevelName','OfficeName','PostName','UserID','IsNodal','ProfileStatusID',
      'StaffID','StaffUserID','DistrictName','uod_InstituteID','RoleID'
    ];
    const filteredData = this.StaffList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'StaffListData.xlsx');
  }

  
  openOTP() {
    debugger;
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      console.log("otp verified on the page")
      this.exportToExcel();
    })
  }

  async ResetControl() {
    this.searchRequest = new BTER_EM_StaffListSearchModel();
    await this.BTER_EM_GetStaffList();
  }
  async GetStatusList() {

    try {
      this.loaderService.requestStarted();
      this.type = 'ITIvtARRStauts';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.filteredStatusList = data['Data'];
          //this.filteredStatusList = this.filteredStatusList.filter((item: any) => item.ID != this._EnumEMProfileStatus.Pending && item.ID != this._EnumEMProfileStatus.Completed && item.ID != this._EnumEMProfileStatus.LockAndSubmit)
          this.filteredStatusList = this.filteredStatusList.filter((item: any) => item.ID == 249)
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
  
  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.StaffList].slice(this.startInTableIndex, this.endInTableIndex);
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
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.StaffList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.StaffList.length;
  }
  // end table feature

  async btnDelete_OnClick(StaffUserID: any, StaffID: any, SSOID: any) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {

          try {
            this.deleteRequest.ModifyBy = this.sSOLoginDataModel.UserID;
            this.deleteRequest.ID = StaffUserID;
            //Show Loading
            this.loaderService.requestStarted();
            /*     alert(isParent)*/
            await this.bterEstablishManagementService.BTER_EM_DeleteStaff(this.deleteRequest)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data)
                
                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  this.BTER_EM_GetStaffList()
                  
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

  async getStreamMasterData() {
    try {
      this.StreamSearch.InstituteID = this.sSOLoginDataModel.InstituteID
      this.StreamSearch.StreamType = this.sSOLoginDataModel.Eng_NonEng
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamDDLInstituteIdWise(this.StreamSearch).then((data: any) => {
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

  async GetPersonalDetailByUserID(StaffUserID: any, SSOID: any) {
    try {
      debugger
      this.loaderService.requestStarted();
      this.requestUser.SSOID = SSOID;
      this.requestUser.StaffUserID = StaffUserID;
      await this.bterEstablishManagementService.BTER_EM_GetPersonalDetailByUserID(this.requestUser).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.approveRequest = data.Data[0];
          await this.getStreamMasterData();

        }

      }, error => console.error(error))


      if ([8, 60, 199, 200].includes(this.approveRequest.RoleID)) {
        this.IsHideShow = true;
        this.StaffMasterFormGroup.controls['BranchID'].setValidators([DropdownValidators]);
      } else {
        this.IsHideShow = false;
        this.StaffMasterFormGroup.controls['BranchID'].clearValidators();
      }
      this.StaffMasterFormGroup.controls['BranchID'].updateValueAndValidity();

      


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
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, 1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
          console.log(this.OfficeList, "OfficeList");
        }, error => console.error(error));

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

  async openModal_ApproveStaffProfile(content: any, StaffUserID: number, SSOID: any, type: boolean) {
    debugger
    this.IsView = type;
    await this.GetPersonalDetailByUserID(StaffUserID, SSOID);
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });

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

  ClosePopup(): void {
    this.modalReference?.close();  // Close the modal
    this.IsView = false
    /*window.location.reload();*/
  }

  ClosePreviewPopup(): void {
    this.staffDetailsServicePreview = new StaffDetailsServicePreviewDataModel();
    this.modalReference?.close();  // Close the modal
  }
  async refreshValidators() {
    debugger
    // if(this.approveRequest.IsSalaryDrawnFromSamePost==true){
    //   this.StaffMasterFormGroup.get('SalaryDrawnPostID')?.removeValidators([DropdownValidators]);
    // }
    if (this.approveRequest.IsEmpWorkingOnDeputationFromOther == false) {
      this.StaffMasterFormGroup.get('EmpInstituteID')?.removeValidators([DropdownValidators]);
      // this.
    }
    if (this.approveRequest.IsEmpWorkingOnDeputationToOther == false) {
      this.StaffMasterFormGroup.get('EmpDeputatedInstituteID')?.removeValidators([DropdownValidators]);
    }
    if (this.approveRequest.IsSalaryDrawnFromSamePost == true) {
      this.StaffMasterFormGroup.get('SalaryDrawnPostID')?.removeValidators([DropdownValidators]);
    }
    if (this.approveRequest.IsSalaryDrawnFromOtherInstitute == false) {
      this.StaffMasterFormGroup.get('SalaryDrawnInstituteID')?.removeValidators([DropdownValidators]);
    }
    if (this.approveRequest.HigherEduPermission == false) {
      this.StaffMasterFormGroup.get('HigherEduInstitute')?.removeValidators([Validators.required]);
    }
    if (this.approveRequest.IsExtraWorking == false) {
      this.StaffMasterFormGroup.get('IsEmpWorkingOnPost')?.removeValidators([Validators.required]);
      // this.StaffMasterFormGroup.get('SalaryDrawnPostID')?.removeValidators([Validators.required]);
      this.StaffMasterFormGroup.get('SalaryDrawnInstituteID')?.removeValidators([Validators.required]);
    
    }

    this.StaffMasterFormGroup.get('IsEmpWorkingOnPost')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('EmpInstituteID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('EmpDeputatedInstituteID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('SalaryDrawnPostID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('SalaryDrawnInstituteID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('HigherEduInstitute')?.updateValueAndValidity();
    // this.StaffMasterFormGroup.get('IsSalaryDrawnFromSamePost')?.updateValueAndValidity();
  }

  async ApproveStaffProfile() {
    debugger
    await this.refreshValidators();
    this.isApproveSubmitted = true;
    if (this.StaffMasterFormGroup.invalid) {  
      // console.log(this.StaffMasterFormGroup.get('IsEmpWorkingOnDeputationFromOther')?.value);
        if(this.StaffMasterFormGroup.invalid){
          Object.keys(this.StaffMasterFormGroup.controls).forEach(key => {
            const control = this.StaffMasterFormGroup.get(key);
        
            if (control?.invalid) {
              console.log('Invalid Field:', key);
              console.log('Errors:', control.errors);
            }
          });
          Object.values(this.StaffMasterFormGroup.controls).forEach(control => {
            control.markAsTouched();
            control.markAsDirty();
          });
          this.toastr.error("Please fill all the Required fields");
          return 
        }
     return;
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

      await this.bterEstablishManagementService.Bter_GOVT_EM_ApproveRejectStaff(this.RequestUpdateStatus)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.CloseModal();
            this.BTER_EM_GetStaffList();
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


  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.RequestUpdateStatus.StatusIDs = 0;
    this.RequestUpdateStatus.Remark = '';
    this.isSubmitted = false;
  }
  async GetDesignationMasterData() {
    try {
      this.loaderService.requestStarted();
      //await this.commonMasterService.GetDesignationMaster().then((data: any) => {
      //  data = JSON.parse(JSON.stringify(data));
      //  this.DesignationMasterDDLList = data.Data;
      //  // console.log("DesignationMasterList", this.DesignationMasterDDLList);
      //}, error => console.error(error))
      var id = 0;
      if (this.sSOLoginDataModel.OfficeID == 18) {
        id = 1
      }
      else {
        id = 0;
      }

      await this.commonMasterService.GetDesignationAndPostMaster(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DesignationMasterDDLList = data.Data;
        this.DesignationMasterDDLList = this.DesignationMasterDDLList;
       
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


  async RevertStaffProfile(model: any, userSubmitData: any) {
    debugger

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

  async RevertupdateReqStatus() {
    debugger
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
      if (this.approveRequest.IsExtraWorking == true) {
        this.StaffMasterFormGroup.get('IsEmpWorkingOnPost')?.setValidators([Validators.required]);
      }
    } 
    else {
      // If salary is drawn from same post 'No', working on post should be 'Yes'
      this.approveRequest.IsSalaryDrawnFromSamePost = true;
      this.approveRequest.IsSalaryDrawnFromOtherInstitute = false;
      if (this.approveRequest.IsExtraWorking == false) {
        this.StaffMasterFormGroup.get('IsEmpWorkingOnPost')?.removeValidators([Validators.required]);
        // this.StaffMasterFormGroup.get('SalaryDrawnPostID')?.removeValidators([Validators.required]);
        this.StaffMasterFormGroup.get('SalaryDrawnInstituteID')?.removeValidators([Validators.required]);
      
      }
    
    }
    this.StaffMasterFormGroup.get('IsEmpWorkingOnPost')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('SalaryDrawnInstituteID')?.updateValueAndValidity();

  }


  // this.StaffMasterFormGroupGuestHouse.controls['DesignationID'].setValidators([DropdownValidators]);
  // this.StaffMasterFormGroupGuestHouse.controls['DesignationID'].clearValidators();

  async openModal_ApproveStaffProfileGuestHouse(content: any, StaffUserID: number, SSOID: any, type: boolean, RoleID: number) {
    debugger
    this.IsView = type;
    await this.GetPersonalDetailByUserID(StaffUserID, SSOID);

    if (this.approveRequest.ProfileStatusID == EnumEMProfileStatus.Approve) {
      this.isApprove = true;
    } else {
      this.isApprove = false;
    }
   
    if (RoleID == this._EnumRole.GuestHouseAdmin || RoleID == this._EnumRole.GuestHouseIncharge || RoleID == this._EnumRole.GuestRoomWarden) {
      this.StaffMasterFormGroupGuestHouse.controls['DesignationID'].setValidators([DropdownValidators]);
      this.StaffMasterFormGroupGuestHouse.controls['DesignationID'].clearValidators();
      this.StaffMasterFormGroupGuestHouse.controls['DesignationID'].updateValueAndValidity();
    }
    


    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'md', keyboard: true, centered: true });
  }

  async ApproveStaffProfileGuestHouse() {
    debugger

    this.isApproveSubmitted = true;

    if (this.StaffMasterFormGroupGuestHouse.invalid) {
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

  ClosePopupGuest(): void {
    this.modalReference?.close();  // Close the modal
    this.IsView = false
    /*window.location.reload();*/
  }

  async OnConfirm(content: any,StaffID:number, ID: number) {
debugger
    await this.StaffDetailsPreview_Service(StaffID,ID);
  
    this.modalReference = this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static'
    });
  
    this.isModalOpen = true;
  
  }

  async StaffDetailsPreview_Service(StaffID:number,ID: number) {
    debugger
    try {
      // Ensure object exists
      if (!this.staffDetailsServicePreview) {
        this.staffDetailsServicePreview = new StaffDetailsServicePreviewDataModel();
      }
      this.staffDetailsServicePreview.UserID = ID;
      this.staffDetailsServicePreview.StaffID=StaffID;
      await this.bterEstablishManagementService.StaffDetailsPreview_ServiceHistory(this.staffDetailsServicePreview).then(async(data:any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {

          // Personal Details
          this.staffDetailsServicePreview = data.Data;
          // Service History List
          // this.staffDetailsServicePreview.ServiceHistoryList =
          //   data.Data?.ServiceHistoryList || [];
        } else {
          this.staffDetailsServicePreview = new StaffDetailsServicePreviewDataModel();
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async OpenStaffProfileViewModal(StaffID: number, UserID: number) {
    //debugger
    this.childComponentViewStaffProfile.StaffID = StaffID;
    this.childComponentViewStaffProfile.UserID = UserID;
    await this.childComponentViewStaffProfile.OpenStaffProfileViewModal();
  }

  async CloseModal_GuestHouseEdit() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.guestHouseSaveRequest = new StaffGuestHouseSearchModel();
    this.guestHouseRequest = new StaffGuestHouseSearchModel();
  }

  async onEditGuestHouse(model: any, row: any) {
    try {
      await this.GetGuestHouseNameList();
      await this.GetStaff_GuestHouseIDs(row.StaffID, row.StaffUserID, row.RoleID);
      this.guestHouseSaveRequest.StaffID = row.StaffID;
      this.guestHouseSaveRequest.StaffUserID = row.StaffUserID;
      this.guestHouseSaveRequest.RoleID = row.RoleID;
      this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static',});
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetGuestHouseNameList() {
   // debugger;
    try {
      this.loaderService.requestStarted();
      this.searchRequest1.GuestHouseIDs = this.sSOLoginDataModel.GuestHouseID;
      this.searchRequest1.isEstablishment = true
      await this.guestRoomManagmentService.GetGuestHouseNameList(this.searchRequest1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
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

  async GetStaff_GuestHouseIDs(StaffID: number, StaffUserID: number, RoleID: number) {
    try {
      this.loaderService.requestStarted();
      this.guestHouseRequest.StaffID = StaffID;
      this.guestHouseRequest.StaffUserID = StaffUserID;
      this.guestHouseRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.guestHouseRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.guestHouseRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.guestHouseRequest.RoleID = RoleID
      await this.bterEstablishManagementService.GetStaff_GuestHouseList(this.guestHouseRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StaffGuestHouseDetails = data['Data'];

          this.StaffGuestHouseDetails = this.GuestHouseNameList.filter((x: any) =>
            this.StaffGuestHouseDetails.some((selected: any) => selected.ID === x.ID)
          );

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

  async SaveStaffGuestHouse() {
    try {
      if (this.StaffGuestHouseDetails.length > 0) {
        this.staffGuestHouseIDs = this.StaffGuestHouseDetails.map((item: any) => item.ID).join(',');
      } else {
        this.toastr.error("Please select at least one hostel")
      }
      this.guestHouseSaveRequest.StaffGuestHouseIDs = this.staffGuestHouseIDs;
      this.guestHouseSaveRequest.ModifyBy = this.sSOLoginDataModel.UserID

      await this.bterEstablishManagementService.SaveStaff_GuestHouseIDs(this.guestHouseSaveRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if(data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            await this.CloseModal_GuestHouseEdit();
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

  onItemSelect(item: any, centerID: number) {
    
  }

  onSelectAll(items: any[], centerID: number) {
    
  }

  onDeSelectAll(centerID: number) {

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
  public onDeSelect(item: any) {
    console.log(item);
  }
}
