import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITIGovtEMAddStaffBasicDetailDataModel, ITIGovtEMStaffMasterDataModel, ITI_Govt_EM_ZonalOFFICERSSearchDataModel, ITI_Govt_EM_ZonalOFFICERSDataModel, UpdateSSOIDByPricipleModel, ITI_Govt_EM_OFFICERSSearchDataModel, ITI_Govt_EM_OFFICERSDataModel, RequestUpdateStatus, ITI_Govt_EM_UserRequestHistoryListSearchDataModel, DeleteModel, ITT_EM_ApproveStaffDataModel, UserOfficePostDataModel } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff, EnumEMProfileStatus, EnumOffice } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITICollegeTradeSearchModel } from '../../../../Models/ITI/SeatIntakeDataModel';
import { UserMasterService } from '../../../../Services/UserMaster/user-master.service';
import { AssignRoleRightsService } from '../../../../Services/AssignRoleRights/assign-role-rights.service';
import { AssignRoleRightsDataModel, UserMasterModel } from '../../../../Models/UserMasterDataModel';
import { ITI_InstructorTechnicalCITSQualification } from '../../../../Models/ITI/ItiInstructorDataModel';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-ITI-Govt-EM-ZonalOfficeList',
  standalone: false,
  
  templateUrl: './ITI-Govt-EM-ZonalOfficeList.component.html',
  styleUrl: './ITI-Govt-EM-ZonalOfficeList.component.css'
})
export class ITIGovtEMZonalOfficeListComponent implements OnInit {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public UpdatePostFormGroup!: FormGroup;
  public formData = new ITI_Govt_EM_ZonalOFFICERSDataModel();
  public isSubmitted: boolean = false;

  public searchRequest = new ITI_Govt_EM_ZonalOFFICERSSearchDataModel();
  public deleteRequest = new DeleteModel();
  public searchRequestUserProfileStatus = new ITI_Govt_EM_UserRequestHistoryListSearchDataModel();
  public searchRequestUpdateSSOIDByPricipleModel = new UpdateSSOIDByPricipleModel();
  staffDetailsFormData = new ITIGovtEMStaffMasterDataModel();
  public searchRequestITi = new ITICollegeTradeSearchModel();
  public UpdateRequest = new UserOfficePostDataModel();
  public isLoading: boolean = false;

  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
/*  public RoleMasterList: any[] = [];*/
  public DesignationMasterList: any[] = [];
  public CompanyMasterList: any[] = [];
  public Districtlist: any[] = [];
  public ItiDDLlist: any[] = [];
  public UserOfficePostDetails: any[] = [];
  
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
  public approveRequest = new ITT_EM_ApproveStaffDataModel();
  StaffMasterFormGroup!: FormGroup;
  public DesignationMasterDDLList: any = [];
  public InstituteMasterDDLList: any[] = [];
  public OfficeWorkList: any = [];
  public StaffServiceDetailsDataList: any = [];
  public isUpdateSubmitted: boolean = false;
  public _EnumOffice = EnumOffice;
  TransferFormGroup!: FormGroup;
  public isTransferSubmitted = false;
  public TransferRequest: any = {};
  public ListITICollegeByManagement: any = [];
  public StaffPostTypeList: any = [];

  constructor(
    private commonMasterService: CommonFunctionService, 
    private ITIGovtEMStaffMasterService: ITIGovtEMStaffMaster, 
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder, 
    private activatedRoute: ActivatedRoute, 
    private routers: Router, 
    private modalService: NgbModal, 
    private Swal2: SweetAlert2,
    private ITICollegeTradeService: ItiSeatIntakeService, 
    private UserMasterService: UserMasterService, 
    private fb: FormBuilder, 
    private assignRoleRightsService: AssignRoleRightsService
  ) { }

  async ngOnInit() {

    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
      ddlOffice: ['', [DropdownValidators]],
      ddlPost: ['', [DropdownValidators]],
      txtSSOID: ['', Validators.required],
      chkIsHod: [false]

    });

    this.StaffMasterFormGroup = this.formBuilder.group({
      ddlStatus: ['', [DropdownValidators]],
      txtRemark: ['', Validators.required],
      /*DesignationID: [0, [DropdownValidators]],*/
      DesignationID: [{ value: '', disabled: true }, [DropdownValidators]],
      WorkOfficeID: [0, [DropdownValidators]],
      IsExtraWorking: ['false'],
      IsEmpWorkingOnPost: [false],
      IsEmpWorkingOnDeputationFromOther: [''],
      EmpInstituteID: [''],
      IsEmpWorkingOnDeputationToOther: [false],
      EmpDeputatedInstituteID: [0,],
      IsSalaryDrawnFromSamePost: [false],
      SalaryDrawnPostID: [0, [DropdownValidators]],
      IsSalaryDrawnFromOtherInstitute: [''],
      SalaryDrawnInstituteID: [0, [DropdownValidators]],
      DateOfRetirement: [''],
      AnyCourtCasePending: ['', [Validators.required]],
      AnyDisciplinaryActionPending: ['', [Validators.required]],
    });

    this.UpdatePostFormGroup = this.formBuilder.group({
      UpdatePostID: [0, [DropdownValidators]], 
      Office: [{ value: '', disabled: true }], 
      College: [{ value: '', disabled: true }], 
      Division: [{ value: '', disabled: true }], 
      NodalDistrict: [{ value: '', disabled: true }], 
      CurrentPost: [{ value: '', disabled: true }], 
    });

    this.TransferFormGroup = this.formBuilder.group({
      Name: [{ value: '', disabled: true }],
      SSOID: [{ value: '', disabled: true }],
      MobileNo: [{ value: '', disabled: true }],
      EmailID: [{ value: '', disabled: true }],
      CurrentInstitute: [{ value: '', disabled: true }],
      //CurrentInstitute: [''],
      InstituteID: [0, [DropdownValidators]],
      //PostID: [0],
      Remark: [''],
      StaffPostTypeID: [0, [DropdownValidators]],
      PostID:[0,[DropdownValidators]]
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;    

    this.QueryReqFormGroup = this.formBuilder.group({
      txtSSOID: ['',[Validators.required]]
    });

    //this.groupForm = this.fb.group({
    //  ddlStatus: [0, [DropdownValidators]],
    //  txtRemark: ['', Validators.required]
    //});
    //this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID
   
   

    await this.GetStatusList();
    await this.GetZonalList();
    await this.GetLevelList();
    await this.GetStaffTypeData(); 
    await this.GetRoleMasterData();
    await this.getITICollege();   
    await this.getInstituteMasterList();
    await this.GetStaffPostTypeList();
    //await this.GetPostListnew();

    await this.getItiNameAndCode();   
    await this.GetDistrictMaster();   

    //this.filteredStatusList = [
    //  { ID: 1, Name: 'Approved' },
    //  { ID: 2, Name: 'Reject' }
    //];

  }
  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }

  get _StaffMasterFormGroup() { return this.StaffMasterFormGroup.controls; }
  get _UpdatePostFormGroup() { return this.UpdatePostFormGroup.controls; }
  get _TransferFormGroup() { return this.TransferFormGroup.controls;}

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
    this.searchRequest.RoleId = this.sSOLoginDataModel.RoleID
    if (this.searchRequest.OfficeID != 11) {
      this.searchRequest.InstituteID = 0
      this.searchRequest.DistrictID=0
    }
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
   debugger
    this.formData.OfficeID = 0;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, this.searchRequest.LevelID)
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

  async GetStaffTypeData() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('ITI_StaffType').then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
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



  //async onSubmit(model: any, userSubmitData: any) {

  //  try {
  //    this.RequestUpdateStatus = { ...userSubmitData };
  //    this.RequestUpdateStatus.StatusIDs = 0;
  //    this.RequestUpdateStatus.Remark = '';
  //    console.log(this.RequestUpdateStatus, "modal");
  //    this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
  //  } catch (error) {
  //    console.error('Error fetching data:', error);
  //  }
  //}
  async onSubmit(model: any, userSubmitData: any) {
    debugger
    try {



      this.approveRequest = { ...userSubmitData };
      /*  this.RequestUpdateStatus = { ...userSubmitData };*/
      this.approveRequest.StatusIDs = 0;
      this.approveRequest.Remark = '';
      this.approveRequest.WorkOfficeID = 0;


      if (this.approveRequest.DateOfBirth) {
        // Handle both "/" and "-" just in case
        const dateParts = this.approveRequest.DateOfBirth.includes('/')
          ? this.approveRequest.DateOfBirth.split('/')
          : this.approveRequest.DateOfBirth.split('-');

        const [dayStr, monthStr, yearStr] = dateParts;

        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10); // 1-12
        const year = parseInt(yearStr, 10);

        // Format DateOfBirth as yyyy-MM-dd
        const dob = new Date(year, month - 1, day);
        this.approveRequest.DateOfBirth = dob.toISOString().split('T')[0]; // yyyy-MM-dd format

        // Calculate retirement year
        const retirementYear = year + 60;

        // Calculate Date of Retirement
        let retirementDate: Date;
        if (day === 1) {
          // Last date of previous month in retirement year
          retirementDate = new Date(retirementYear, month - 1, 0);
        } else {
          // Last date of current month in retirement year
          retirementDate = new Date(retirementYear, month, 0);
        }

        // Format retirement date as yyyy-MM-dd
        const rdDay = String(retirementDate.getDate()).padStart(2, '0');
        const rdMonth = String(retirementDate.getMonth() + 1).padStart(2, '0');
        const rdYear = retirementDate.getFullYear();

        this.approveRequest.DateOfRetirement = `${rdYear}-${rdMonth}-${rdDay}`;
      }


      if (this.sSOLoginDataModel.LevelId == 3) {

        await this.commonMasterService.DDL_ITI_GovtEMDDLOfficeVacancy(this.sSOLoginDataModel.DepartmentID, 0)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            /*this.OfficeList = data['Data'];*/
            this.OfficeWorkList = data['Data'];
            console.log(this.OfficeList, "OfficeList")
          }, error => console.error(error));
      }
      else {
        await this.commonMasterService.DDL_ITI_GovtEMDDLOfficeVacancy(this.sSOLoginDataModel.DepartmentID, 0)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            /*this.OfficeList = data['Data'];*/
            this.OfficeWorkList = data['Data'];
            console.log(this.OfficeList, "OfficeList")
          }, error => console.error(error));
      }
      await this.GetDesignationMasterData();
      await this.getInstituteMasterList();
      this.approveRequest.IsExtraWorking = false;

      if (this.approveRequest.IsExtraWorking == false) {
        this.approveRequest.IsSalaryDrawnFromSamePost = true;
        this.approveRequest.IsSalaryDrawnFromOtherInstitute = false;

        this.approveRequest.IsEmpWorkingOnDeputationToOther = false;
      }
      else {
        this.approveRequest.IsSalaryDrawnFromSamePost = false;
        this.approveRequest.IsSalaryDrawnFromOtherInstitute = true;
        this.approveRequest.IsEmpWorkingOnDeputationToOther = false;
      }


      console.log(this.approveRequest, "modal");
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  async updateReqStatus() {
    debugger
    

    if (this.approveRequest.StatusIDs == 247) {
      await this.refreshValidators();
    } else {
      await this.refreshRemoveRejectRevertValidators();
    }

    this.isSubmitted = true;
    if (this.StaffMasterFormGroup.invalid) {
      const invalidControls = this.getInvalidControls(this.StaffMasterFormGroup);
      console.error("❌ Form validation failed. Missing/Invalid fields:", invalidControls);

      // Optional: show Toastr error to user
      this.toastr.error(`Please fill required fields: ${invalidControls.join(', ')}`);

      return; // Stop execution
    }
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      this.RequestUpdateStatus.CreatedBy = this.sSOLoginDataModel.UserID;

      await this.ITIGovtEMStaffMasterService.ITI_EM_PostWithVacancyApproveStaffProfile(this.approveRequest)
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


  getInvalidControls(formGroup: FormGroup): string[] {
    const invalidControls: string[] = [];

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        // Recursively check nested groups
        invalidControls.push(...this.getInvalidControls(control));
      } else if (control && control.invalid) {
        invalidControls.push(key);
      }
    });

    return invalidControls;
  }


  async onCheckData(userSubmitData: any) {
    
    this.RequestUpdateStatus = { ...userSubmitData };
   /* this.RequestUpdateStatus.StaffID*/
    const id = userSubmitData.StaffID;
   /* window.open(`/ITIGOVTEMPersonalDetailsApplicationTab/${id}`);*/
    this.routers.navigate(['/ITIGOVTEMPersonalDetailsApplicationTab'], { queryParams: { id: id } });
   /* this.routers.navigate(['/ITIGOVTEMPersonalDetailsApplicationTab'])*/
  }

  exportToExcel(): void {

    const exportData = this.ZonalList.map((row: any, index: number) => ({
      'Sr. No.': index + 1,
      'Name / SSO ID': `${row.Name || ''} (${row.SSOID || ''})`,
      'Mobile / Email': `${row.MobileNo || ''} (${row.EmailID || ''})`,
      'Level Name or Office Name': `${row.LevelName || ''} ${row.OfficeName ? 'or ' + row.OfficeName : ''}`,
      'Institute Name': row.InstituteName || '',
      'District Name': row.DistrictName || '',
      'Staff Type or Post Name': `${row.StaffTypeName || ''} ${row.PostName ? '\n' + row.PostName : ''}`,
      'Role': row.RoleName || '',
      'Profile Status (Remark)':
        `${row.ProfileStatus === 'Approve' ? 'Approved' : (row.ProfileStatus || '')}` +
        `${row.Remark ? ' (' + row.Remark + ')' : ''}`,
      'Is Hod': row.IsHod || ''
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Auto column width
    const colWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(
        key.length,
        ...exportData.map((r: any) => (r[key] ? r[key].toString().length : 0))
      ) + 2
    }));

    ws['!cols'] = colWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Staff List');

    XLSX.writeFile(wb, 'StaffList.xlsx');
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

  // van--

 


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

  async GetDesignationMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetITIPostDepartmentWise(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DesignationMasterDDLList = data.Data;
        //this.DesignationMasterDDLList = this.DesignationMasterDDLList.filter((item: any) => item.TypeID == this.approveRequest.StaffTypeID);
        // console.log("DesignationMasterList", this.DesignationMasterDDLList);
      }, error => console.error(error))

      //await this.commonMasterService.GetCommonMasterDDLByType('Gender')
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    this.GenderList = data['Data'];
      //    console.log("GenderList", this.GenderList);
      //  }, (error: any) => console.error(error)
      //  );
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async refreshValidators() {
    debugger
    if (this.approveRequest.IsEmpWorkingOnDeputationFromOther == false) {
      this.StaffMasterFormGroup.get('EmpInstituteID')?.removeValidators([DropdownValidators]);
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

    this.StaffMasterFormGroup.get('EmpInstituteID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('EmpDeputatedInstituteID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('SalaryDrawnPostID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('SalaryDrawnInstituteID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('HigherEduInstitute')?.updateValueAndValidity();
  }


  async refreshRemoveRejectRevertValidators() {
    debugger;

    this.StaffMasterFormGroup.get('DesignationID')?.removeValidators(DropdownValidators);
    this.StaffMasterFormGroup.get('WorkOfficeID')?.removeValidators(DropdownValidators);
    this.StaffMasterFormGroup.get('SalaryDrawnPostID')?.removeValidators(DropdownValidators);
    this.StaffMasterFormGroup.get('SalaryDrawnInstituteID')?.removeValidators(DropdownValidators);
    this.StaffMasterFormGroup.get('HigherEduInstitute')?.removeValidators(Validators.required);
    this.StaffMasterFormGroup.get('AnyCourtCasePending')?.removeValidators(Validators.required);
    this.StaffMasterFormGroup.get('AnyDisciplinaryActionPending')?.removeValidators(Validators.required);

    this.StaffMasterFormGroup.get('DesignationID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('WorkOfficeID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('SalaryDrawnPostID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('SalaryDrawnInstituteID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('HigherEduInstitute')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('AnyCourtCasePending')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('AnyDisciplinaryActionPending')?.updateValueAndValidity();
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
      this.approveRequest.IsEmpWorkingOnDeputationFromOther = false;

    } else {
      // If salary is drawn from same post 'No', working on post should be 'Yes'
      this.approveRequest.IsSalaryDrawnFromSamePost = true;
      this.approveRequest.IsSalaryDrawnFromOtherInstitute = false;
      this.approveRequest.IsEmpWorkingOnDeputationFromOther = true;
    }
  }

  async getUserOfficePostDetails(StaffUserID: number) {
    try {
      const request: any = {};
      request.Action = 'GetUserOfficePostDetails_ById'
      request.USerID = StaffUserID;
      request.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      await this.ITIGovtEMStaffMasterService.ITI_EM_GetUserOfficePostDetails(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.UserOfficePostDetails = data.Data;
          this.UpdateRequest = this.UserOfficePostDetails[0];
          await this.GetPostList();
        } else if(data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
          this.UserOfficePostDetails = [];
        } else {
          this.toastr.error(data.Message);
          this.UserOfficePostDetails = [];
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async GetPostList() {
    try {
      var obj = {
        OfficeID: this.UpdateRequest.OfficeID,
        InstituteID: this.UpdateRequest.InstituteID,
      }
      await this.commonMasterService.GetItiVacantPost(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PostList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  async onClick_UserPost(modal: any, StaffUserId: number){
    await this.getUserOfficePostDetails(StaffUserId);
    this.modalReference = this.modalService.open(modal, { size: 'md', backdrop: 'static' });
  }

  CloseModalPopup_updatePost() {
    this.UpdateRequest = new UserOfficePostDataModel();
    this.modalService.dismissAll();
  }

  async updateStaffPost() {
    this.Swal2.Confirmation("Are you sure you want to Update Post ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.UpdateRequest.ModifyBy=this.sSOLoginDataModel.UserID;
            this.UpdateRequest.DepartmentID=this.sSOLoginDataModel.DepartmentID;
            
            await this.ITIGovtEMStaffMasterService.UpdateUserOfficePost_ITI_EM(this.UpdateRequest).then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if(data.State === EnumStatus.Success) {
                this.toastr.success(data.Message);
                this.modalService.dismissAll();
                await this.GetZonalList();
              } else if(data.State === EnumStatus.Warning) {
                this.toastr.warning(data.Message);
              } else {
                this.toastr.error(data.Message);
              }
            })
          } catch (error) {
            console.error(error);
          }
        }
      })
    
  }

  async GetEmployeeServiceDetails_ITI_EM(StaffUserID: number) {
    try {
      const request: any = {};
      request.StaffUserID = StaffUserID;
      await this.ITIGovtEMStaffMasterService.GetEmployeeServiceDetails_ITI_EM(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success){
          this.StaffServiceDetailsDataList = data.Data;
        } else {
          this.StaffServiceDetailsDataList = [];
        }
      })
    } catch (error) {
      console.error
    }
  }

  CloseModal_ServiceHistory() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.isSubmitted = false;
  }

  async openModal_UserServiceHistory(model: any, StaffUserID: number) {
    await this.GetEmployeeServiceDetails_ITI_EM(StaffUserID);
    this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
  }


  exportToPDF() {

    const doc = new jsPDF('l', 'mm', 'a4');

    // Heading
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'ITI Govt Office List',
      pageWidth / 2,
      10,
      { align: 'center' }
    );

    const body = this.ZonalList.map((row: any, index: number) => [
      index + 1,
      `${row.Name} (${row.SSOID})`,
      `${row.MobileNo} (${row.EmailID})`,
      `${row.LevelName || ''}${row.OfficeName ? ' / ' + row.OfficeName : ''}`,
      row.InstituteName,
      row.DistrictName,
      `${row.StaffTypeName || ''}${row.PostName ? ' / ' + row.PostName : ''}`,
      row.RoleName,
      `${row.ProfileStatus === 'Approve' ? 'Approved' : row.ProfileStatus || ''}${row.Remark ? ' (' + row.Remark + ')' : ''
      }`,
      row.IsHod
    ]);

    autoTable(doc, {
      startY: 18,

      head: [[
        'Sr No',
        'Name / SSO ID',
        'Mobile / Email',
        'Level / Office',
        'Institute',
        'District',
        'Staff Type / Post',
        'Role',
        'Profile Status',
        'Is HOD'
      ]],

      body,

      theme: 'grid',

      styles: {
        fontSize: 7,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },

      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      }
    });

    doc.save('ITI_Govt_Office_List.pdf');
  }
  async GetGovtITI() {
    try {


      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData("GovtIti")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.ItiDDLlist = data['Data'];

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


  async getItiNameAndCode() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('GovtIti',0, this.searchRequest.DistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CompanyMasterList = data['Data'];   // full list


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


  async GetDistrictMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster().then((data: any) => {
        this.Districtlist = data.Data;
      });
    } catch (error) {
    } finally {
      this.loaderService.requestEnded();
    }
  }


async openTransferModal(content: any, row: any) {

  this.TransferRequest = row;

  await this.GetStaffPostTypeList();

  this.TransferFormGroup.patchValue({
    Name: row.Name,
    SSOID: row.SSOID,
    MobileNo: row.MobileNo,
    EmailID: row.EmailID,

    CurrentInstitute: row.InstituteName,

    InstituteID: 0,
    StaffPostTypeID: 0,
    PostID: 0,
    Remark: ''
  });

  this.modalReference = this.modalService.open(content, {
    size: 'lg',
    backdrop: 'static'
  });
}

closeTransferModal() {
  this.modalService.dismissAll();
}

saveTransfer() {

  debugger
  this.isTransferSubmitted = true;

  if (this.TransferFormGroup.invalid) {
    return;
  }
const formData = this.TransferFormGroup.getRawValue();
  const request = {

    UserID: this.TransferRequest.StaffUserID,
    OfficeID: 0,
    PostID: formData.PostID,
    DepartmentID:this.sSOLoginDataModel.DepartmentID,
    LevelID:this.TransferRequest.LevelID,
    DesignationID:formData.PostID,
    InstituteID: formData.InstituteID,
    StaffPostTypeID: formData.StaffPostTypeID,
    CreatedBy: this.sSOLoginDataModel.UserID,
    IsAdditionPost: true,
    Remark: formData.Remark,
};


  console.log('post data',request);

  // try {
  //      this.ITIGovtEMStaffMasterService.ITI_IsAdditionUserOfficeSave(request).then(async (data: any) => {
  //       data = JSON.parse(JSON.stringify(data));
  //       if(data.State === EnumStatus.Success){
  //         this.StaffServiceDetailsDataList = data.Data;
  //          this.toastr.success('Record Saved Successfully');
  //       }
  //       else if(data.State === EnumStatus.Warning){
  //         this.StaffServiceDetailsDataList = data.Data;
  //          this.toastr.success('Record Already exist');
  //       }
  //       else {
  //          this.toastr.success(this.SuccessMessage)
  //          this.toastr.success('Some Error Occured');
  //       }
  //     })
  //   } catch (error) {
  //     console.error
  //   }


  try {

  this.ITIGovtEMStaffMasterService
    .ITI_IsAdditionUserOfficeSave(request)
    .then((data: any) => {

      if (data.State === EnumStatus.Success) {

        this.toastr.success(
          data.Message || 'Record Saved Successfully'
        );

        this.closeTransferModal();

      }
      else if (data.State === EnumStatus.Warning) {

        this.toastr.warning(
          data.ErrorMessage || 'Duplicate record already exists.'
        );

      }
      else {

        this.toastr.error(
          data.ErrorMessage || 'Some error occurred.'
        );

      }

    })
    .catch((error) => {

      console.error(error);

      this.toastr.error(
        'Some error occurred while communicating with server.'
      );

    });

}
catch (error) {

  console.error(error);

  this.toastr.error('Some error occurred.');

}
//this.closeTransferModal();
  
}


async getITICollege() {
    try {
      this.searchRequestITi.Action = "_ITICollegeByManagementType";
      this.searchRequestITi.FinancialYearID = 9;
      this.searchRequestITi.ManagementTypeId = 0;

      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('GovtIti')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListITICollegeByManagement = data['Data'];

          this.ListITICollegeByManagement = this.ListITICollegeByManagement.filter((item: any) => item.ID == this.sSOLoginDataModel.InstituteID)

          console.log(this.ListITICollegeByManagement, "ListITICollegeByManagement")
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
  async GetPostListnew() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('PostMaster', this.formData.StaffPostTypeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PostList = data['Data'];
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

  async onPostTypeChange() {

  this.formData.StaffPostTypeID =
      this.TransferFormGroup.value.StaffPostTypeID;

  await this.GetPostListnew();
}

}
