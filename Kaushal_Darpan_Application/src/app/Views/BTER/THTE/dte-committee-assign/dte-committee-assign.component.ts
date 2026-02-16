import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { TeacherHigherEducationApplicationVerificationService } from '../../../../Services/teacher-higher-education-application-Verification/teacher-higher-education-application-Verification.service';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { ApplicationGenrateOrderByDteListSearchModel, PrincipleApplicationListSearchModel, StaffDetailsPreviewDataModel, THTE_DropdownDataModel, UpdateApplicationStatusDataModel_Principle } from '../../../../Models/TeacherHigherEducationApplicationDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StaffMasterService } from '../../../../Services/StaffMaster/staff-master.service';
import { StaffDetailsDataModel } from '../../../../Models/StaffMasterDataModel';
import { TeacherHigherEducationApplicationService } from '../../../../Services/teacher-higher-education-application/teacher-higher-education-application.service';

@Component({
  selector: 'app-dte-committee-assign',
  standalone: false,
  templateUrl: './dte-committee-assign.component.html',
  styleUrl: './dte-committee-assign.component.css'
})
export class DTECommitteeAssignComponent {
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  public searchRequest = new PrincipleApplicationListSearchModel();
  public dropdownRequest = new THTE_DropdownDataModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public _DTEGenrateOrder = new ApplicationGenrateOrderByDteListSearchModel();
  staffDetailsFormData = new StaffDetailsDataModel();
  staffDetailsPreview = new StaffDetailsPreviewDataModel();

  modalReference: NgbModalRef | undefined;
  public ApplicationListData: any = [];
  public ApplicationListOrderData: any = [];
  public StatusListDDL: any = [];
  public UpdateStatusListDDL: any = [];
  public DTECommitteeListDDL: any = [];
  public enumRole = EnumRole;

  public status: number = 0;
  public isModalOpen: boolean = false;
  Dis_CommitteeDocs: string = ''
  CommitteeDocs: string = ''
  DTECommitteID: number = 0;

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
    private staffMasterService: StaffMasterService,
  ) { }

  async ngOnInit () { 
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.THTE_GetDTECommitteeDDL();
    await this.GetMasterData();
  }

  async THTE_GetDTECommitteeDDL() {
    try {
      let request: any = {}
      await this.teacherHigherEducationApplicationService.THTE_GetDTECommitteeDDL(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DTECommitteeListDDL = data['Data'];
      })
    } catch (error) {
      console.error(error)
    }
  }

  async GetMasterData() {
    try {
      this.dropdownRequest.action = "GetStatusDDL"
      await this.commonMasterService.THTE_StatusDDL(this.dropdownRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StatusListDDL = data['Data'];
        this.UpdateStatusListDDL = data['Data'];
        this.StatusListDDL = this.StatusListDDL.filter((x: any) => x.ID == 1342 || x.ID == 1344 || x.ID == 1354)
        this.UpdateStatusListDDL = this.UpdateStatusListDDL.filter((x: any) => x.ID == 1354)
      })
    } catch (error) {
      console.error(error);
    }
  }

  async btn_Clear() {}

  async ApplicationList_ForPrinciple_THTE() {
    try {
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID

      
      await this.teacherHigherEducationApplicationVerificationService.ApplicationList_ForDTE_THTE(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.ApplicationListData = data['Data'];

          this.loadInTable();
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async openOTPModal() {
    let anySelected = this.ApplicationListData.some((x: any) => x.Selected === true)
    if (!anySelected) {
      this.toastr.warning('Please select at least one record.');
      return;
    }

    if(this.DTECommitteID == 0 || this.DTECommitteID == undefined || this.DTECommitteID == null) {
      this.toastr.warning('Please select committee.');
      return;
    }

    if(this.status == 0 || this.status == undefined || this.status == null) {
      this.toastr.warning('Please select status.');
      return;
    }

    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno

    // await for open model
    await this.childComponent.OpenOTPPopup();

    // await OTP verification
    await this.childComponent.waitForVerification();

    // do work
    await this.DTECommitteeAssign_THTE();
  }

  async DTECommitteeAssign_THTE() {
    

    try {
      let selected = this.ApplicationListData.filter((x: any) => x.Selected === true)
      selected.forEach((x: any) => {
        x.ModifyBy = this.sSOLoginDataModel.UserID,
        x.status = this.status,
        x.RoleID = this.sSOLoginDataModel.RoleID,
        x.CommitteeDocs = this.CommitteeDocs,
        x.Dis_CommitteeDocs = this.Dis_CommitteeDocs  ,
        x.DTECommitteID = this.DTECommitteID
      })

      await this.teacherHigherEducationApplicationVerificationService.DTECommitteeAssign_THTE(selected)
      .then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.status = 0
          this._DTEGenrateOrder.THTEAppIDs = selected.map((x: any) => x.THTEAppID).join(',');
          this._DTEGenrateOrder.RoleID = this.sSOLoginDataModel.RoleID;
          this.status = 0;
          this.DTECommitteID = 0;
          await this.ApplicationList_ForPrinciple_THTE();
        }
      })
    } catch (error) {
      console.error(error);
    }
    
    
  }

  async OnConfirm(content: any, ID: number) {
    await this.StaffDetailsPreview_THTE(ID)
    this.modalReference = this.modalService.open(content, { size: 'xl', backdrop: 'static' });
    this.isModalOpen = true;  // Open the modal
  }

  ClosePopup(): void {
    this.staffDetailsPreview = new StaffDetailsPreviewDataModel();
    this.modalReference?.close();  // Close the modal
  }

  async StaffDetailsPreview_THTE(ID: number) {
    try {
      this.staffDetailsPreview.StaffID = ID;
      await this.teacherHigherEducationApplicationVerificationService.StaffDetailsPreview_THTE(this.staffDetailsPreview).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.staffDetailsPreview = data['Data'][0];
        } else {
          this.staffDetailsPreview = new StaffDetailsPreviewDataModel();
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png' || this.file.type == 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
        }
        else {// type validation
          this.toastr.error('Select Only jpeg/jpg/png file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State == EnumStatus.Success) {
              if (Type == "CommitteeDoc") {
                this.Dis_CommitteeDocs = data['Data'][0]["Dis_FileName"];
                this.CommitteeDocs = data['Data'][0]["FileName"];

              }
              event.target.value = null;
            }
            if (data.State == EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage)
            }
            else if (data.State == EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
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
