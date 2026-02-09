import { Component } from '@angular/core';
import { EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { TeacherHigherEducationApplicationVerificationService } from '../../../../Services/teacher-higher-education-application-Verification/teacher-higher-education-application-Verification.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { TeacherHigherEducationApplicationService } from '../../../../Services/teacher-higher-education-application/teacher-higher-education-application.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-institute-committee-list-dte',
  standalone: false,
  templateUrl: './institute-committee-list-dte.component.html',
  styleUrl: './institute-committee-list-dte.component.css'
})
export class InstituteCommitteeListDTEComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();

  public InstituteCommitteeData: any = [];
  public THTE_GetInstituteCommitteeMemberData: any = [];
  public StatusListDDL: any = [];
  public UpdateStatusListDDL: any = [];
  public InstituteMasterList: any = [];
  public enumRole = EnumRole;
  modalReference: NgbModalRef | undefined;
  searchReq: any = {}

  public status: number = 0;

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
    public thteApplicationService: TeacherHigherEducationApplicationService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetMasterData();
    await this.THTE_GetInstituteCommitteeList();
  }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async THTE_GetInstituteCommitteeList() {
    try {
      
      this.searchReq.action ="GetCommitteeData";

      await this.thteApplicationService.THTE_GetInstituteCommitteeList(this.searchReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteCommitteeData = data.Data;
        this.loadInTable();
      })
    } catch (error) {
      console.error(error)
    }
  }

  async THTE_GetInstituteCommitteeMemberList(CommitteeID: number) {
    try {
      const searchReq: any = {}
      searchReq.action ="GetCommitteeMemberData";
      searchReq.CommitteeID = CommitteeID;

      await this.thteApplicationService.THTE_GetInstituteCommitteeList(searchReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.THTE_GetInstituteCommitteeMemberData = data.Data;
          
        } else {
          this.InstituteCommitteeData = [];
          this.toastr.error("no member found")
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async btn_Clear() {
    this.searchReq = {};
    this.THTE_GetInstituteCommitteeList();
  }

  async OpenModalCommitteeMemberDetails(model: any, CommitteeID: number) {
    try {
      this.loaderService.requestStarted();
      await this.THTE_GetInstituteCommitteeMemberList(CommitteeID)
      this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
    } catch (error) {
      console.error(error)
    }
  }

  async CloseModalCommitteeMemberDetails() {
    this.modalService.dismissAll()
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
    this.paginatedInTableData = [...this.InstituteCommitteeData].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.InstituteCommitteeData] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.InstituteCommitteeData.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.InstituteCommitteeData.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.paginatedInTableData.forEach((row: any) => {
      row.Selected = this.AllInTableSelect;

      // Direct update to the original list
      const item = this.InstituteCommitteeData.find((x: any) => x.THTEAppID === row.THTEAppID);
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
    const item = this.InstituteCommitteeData.filter((x: any) => x.THTEAppID === row.THTEAppID);
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
