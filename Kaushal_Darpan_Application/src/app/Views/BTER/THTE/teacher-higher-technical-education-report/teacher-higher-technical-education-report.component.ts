import { Component, ViewChild } from '@angular/core';
import { PrincipleApplicationListSearchModel, THTE_ApplicationSearchModel, THTE_DashboardTilesDataModel, THTE_DropdownDataModel } from '../../../../Models/TeacherHigherEducationApplicationDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { TeacherHigherEducationApplicationVerificationService } from '../../../../Services/teacher-higher-education-application-Verification/teacher-higher-education-application-Verification.service';
import { TeacherHigherEducationApplicationService } from '../../../../Services/teacher-higher-education-application/teacher-higher-education-application.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ViewStaffProfileModalComponent } from '../../BTER-GOVT-Establish-Management/view-staff-profile-modal/view-staff-profile-modal.component';

@Component({
  selector: 'app-teacher-higher-technical-education-report',
  standalone: false,
  templateUrl: './teacher-higher-technical-education-report.component.html',
  styleUrl: './teacher-higher-technical-education-report.component.css'
})
export class TeacherHigherTechnicalEducationReportComponent {
  public dropdownRequest = new THTE_DropdownDataModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new THTE_DashboardTilesDataModel();
  public requestSearch = new THTE_ApplicationSearchModel();

  public StatusListDDL: any = [];
  public UserApplyInstituteList: any = [];
  public UserRequestHistoryList: any = [];
  public ApplicationListData: any = [];

  public Selecteditem: any = {};
  modalReference: NgbModalRef | undefined;
  status: number = 0;

  @ViewChild('Modal_StaffDetailsViewModal') childComponentViewStaffProfile!: ViewStaffProfileModalComponent;

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
  public DateConfigSetting: any = [];
  //end table feature default

  constructor(
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private Swal2: SweetAlert2,
    private activatedRoute: ActivatedRoute,
    public appsettingConfig: AppsettingService,
    public teacherHigherEducationApplicationVerificationService: TeacherHigherEducationApplicationVerificationService,
    public teacherHigherEducationApplicationService: TeacherHigherEducationApplicationService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  async ngOnInit () { 
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.status = Number(this.activatedRoute.snapshot.queryParamMap.get('id')) || 0;
    this.searchRequest.StatusID = this.status
    await this.GetApplicationReportData_THTE();
    await this.GetMasterData();
  }

  async GetMasterData() {
    try {
      this.dropdownRequest.action = "GetStatusDDL"
      await this.commonMasterService.THTE_StatusDDL(this.dropdownRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StatusListDDL = data['Data'];
      })
    } catch (error) {
      console.error(error);
    }
  }

  async GetApplicationReportData_THTE() {
    try {
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.searchRequest.UserID=this.sSOLoginDataModel.UserID;
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;

      await this.teacherHigherEducationApplicationService.GetApplicationReportData_THTE(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ApplicationListData = data['Data'];

        this.loadInTable();
      })
    } catch (error) {
      console.error(error);
    }
  }

  async btn_Clear() {
    this.searchRequest = new THTE_DashboardTilesDataModel();
    this.GetApplicationReportData_THTE();
  }

  async ApplyCollegelist(model: any, THTEAppID: number,row:any) {
     
    try {
      this.loaderService.requestStarted();
      this.requestSearch.THTEAppID = THTEAppID
      this.requestSearch.RoleID = this.sSOLoginDataModel.RoleID
      this.Selecteditem=row
      await this.teacherHigherEducationApplicationService.THTE_GrtApplyInstituteList(this.requestSearch)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserApplyInstituteList = data.Data;
        }, (error: any) => console.error(error))
      this.modalReference = this.modalService.open(model, { size: 'xl', backdrop: 'static' });
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

  async onUserRequestHistorylist(model: any, THTEAppID: number) {
     
    try {
      this.loaderService.requestStarted();
      const requestSearch: any = {}
      requestSearch.THTEAppID = THTEAppID

      await this.teacherHigherEducationApplicationService.THTE_GrtApplicationStatusHistory(requestSearch)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserRequestHistoryList = data.Data;

        }, (error: any) => console.error(error))

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

  async OpenStaffProfileViewModal(StaffID: number, UserID: number) {
    //debugger
    this.childComponentViewStaffProfile.StaffID = StaffID;
    this.childComponentViewStaffProfile.UserID = UserID;
    await this.childComponentViewStaffProfile.OpenStaffProfileViewModal();
  }

  async CloseModalRequestHistorylist() {
    this.Selecteditem = {}
    this.modalService.dismissAll()
  }

  CloseModalRequestHistorylist1() {
    this.modalService.dismissAll();
    this.modalReference?.close();
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
    this.paginatedInTableData = [...this.ApplicationListData].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.ApplicationListData] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.ApplicationListData.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.ApplicationListData.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.paginatedInTableData.forEach((row: any) => {
      row.Selected = this.AllInTableSelect;

      // Direct update to the original list
      const item = this.ApplicationListData.find((x: any) => x.THTEAppID === row.THTEAppID);
      if (item) {
        item.Selected = this.AllInTableSelect;
      }
    });
  }

  // Select/Deselect Single
  selectInTableSingleCheckbox(isSelected: boolean, row: any) {
    // Update current row
    row.Selected = isSelected;

    // Update master list item
    const item = this.ApplicationListData.filter((x: any) => x.THTEAppID === row.THTEAppID);
    if (item) {
      item.Selected = isSelected;
    }

    // Ensure all rows have boolean Selected (default false)
    this.paginatedInTableData.forEach(r => {
      if (typeof r.Selected !== 'boolean') {
        r.Selected = false;
      }
    });

    // Check if all visible rows are selected (defensive)
    this.AllInTableSelect = this.paginatedInTableData.every(r => r.Selected === true);
  }
  // end table feature
}
