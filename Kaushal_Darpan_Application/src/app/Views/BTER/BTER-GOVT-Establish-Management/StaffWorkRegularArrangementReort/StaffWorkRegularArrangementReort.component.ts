import { Component } from '@angular/core';
import { BTER_EM_ApproveStaffDataModel, BTER_EM_DeleteModel, BTER_EM_GetPersonalDetailByUserID, BTER_EM_StaffListSearchModel, BTER_EM_UnlockProfileDataModel, Bter_Govt_EM_UserRequestHistoryListSearchDataModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { EnumEMProfileStatus, EnumStatus } from '../../../../Common/GlobalConstants';
import { ToastrService } from 'ngx-toastr';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StreamDDL_InstituteWiseModel } from '../../../../Models/CommonMasterDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { RequestUpdateStatus } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { UserRequestService } from '../../../../Services/UserRequest/user-request.service';

@Component({
  selector: 'app-StaffWorkRegularArrangementReort',
  standalone: false,
  templateUrl: './StaffWorkRegularArrangementReort.component.html',
  styleUrl: './StaffWorkRegularArrangementReort.component.css'
})
export class StaffWorkRegularArrangementReortComponent {
  public searchRequest = new BTER_EM_StaffListSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public deleteRequest = new BTER_EM_DeleteModel();
  StaffMasterFormGroup!: FormGroup;
  public StaffTypeList: any = [];
  public OfficeList: any = [];
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
  public UserProfileStatusHistoryList: any = [];
  public isApproveSubmitted: boolean = false;
  public isLoading: boolean = false;
  public RequestUpdateStatus = new RequestUpdateStatus();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public filteredStatusList: any[] = [];
  public type: string = ''
  public InstituteMasterDDL: any[] = [];
  public IsHideShow: boolean = false
  public DesignationMasterDDLList: any = [];
  public GenderList: any = [];
  public InstituteMasterDDLList: any[] = [];
  public unlockRequest = new BTER_EM_UnlockProfileDataModel();
  constructor(
    private loaderService: LoaderService,
    private bterEstablishManagementService: BTEREstablishManagementService,
    private commonMasterService: CommonFunctionService,
    private Swal2: SweetAlert2,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userRequestService: UserRequestService
  ) {}

  async ngOnInit() {
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetStatusList();
    await this.BTER_EM_GetStaffList();
    await this.GetOfficeList();
    await this.GetInstituteMaster();
    await this.GetStaffTypeData();
    await this.GetDesignationMasterData();
    await this.getInstituteMasterList();
  }

  async GetOfficeList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, 1)
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

  async BTER_EM_GetStaffList() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID
    try {
      this.loaderService.requestStarted();
      await this.bterEstablishManagementService.GetStaffWorkRegular_ArrangementReort(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
        
          this.StaffList = data['Data'];
          this.StaffList = this.StaffList.filter((item: any) => item.CourseType == this.sSOLoginDataModel.Eng_NonEng)

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
  async GetDesignationMasterData() {
    try {
      this.loaderService.requestStarted();
      //await this.commonMasterService.GetDesignationMaster().then((data: any) => {
      //  data = JSON.parse(JSON.stringify(data));
      //  this.DesignationMasterDDLList = data.Data;
      //  // console.log("DesignationMasterList", this.DesignationMasterDDLList);
      //}, error => console.error(error))

      await this.commonMasterService.GetDesignationAndPostMaster().then((data: any) => {
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

 
}
