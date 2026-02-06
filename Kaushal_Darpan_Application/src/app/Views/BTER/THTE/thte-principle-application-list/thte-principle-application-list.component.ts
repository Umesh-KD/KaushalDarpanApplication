import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { TeacherHigherEducationApplicationVerificationService } from '../../../../Services/teacher-higher-education-application-Verification/teacher-higher-education-application-Verification.service';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { PrincipleApplicationListSearchModel, THTE_ApplicationSearchModel, THTE_DropdownDataModel } from '../../../../Models/TeacherHigherEducationApplicationDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import Swal from 'sweetalert2';
import { TeacherHigherEducationApplicationService } from '../../../../Services/teacher-higher-education-application/teacher-higher-education-application.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-thte-principle-application-list',
  standalone: false,
  templateUrl: './thte-principle-application-list.component.html',
  styleUrl: './thte-principle-application-list.component.css'
})
export class THTEPrincipleApplicationListComponent {
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  modalReference: NgbModalRef | undefined;
  public searchRequest = new PrincipleApplicationListSearchModel();
  public dropdownRequest = new THTE_DropdownDataModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public UserApplyInstituteList:any=[]

  public ApplicationListData: any = [];
  public StatusListDDL: any = [];
  public UpdateStatusListDDL: any = [];
  public requestSearch = new THTE_ApplicationSearchModel();
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
    public teacherHigherEducationApplicationService: TeacherHigherEducationApplicationService,
    private modalService: NgbModal,
    private router: Router,
  ) { }

  async ngOnInit () { 
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetStatusData();
  }

  async GetStatusData() {
    try {
      this.dropdownRequest.action = "GetStatusDDL"
      this.dropdownRequest.RoleID = this.sSOLoginDataModel.RoleID
      await this.commonMasterService.THTE_StatusDDL(this.dropdownRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StatusListDDL = data['Data'];
        this.StatusListDDL = this.StatusListDDL.filter((x: any) => x.ID === 1340 || x.ID === 1341 || x.ID === 1342)
        this.UpdateStatusListDDL = this.StatusListDDL.filter((x: any) => x.ID === 1341 || x.ID === 1342)
      })
    } catch (error) {
      console.error(error);
    }
  }

  async btn_Clear() {
    this.searchRequest = new PrincipleApplicationListSearchModel();
  }

  async ApplicationList_ForPrinciple_THTE() {
    try {
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID

      if(this.sSOLoginDataModel.RoleID === EnumRole.Principal || this.sSOLoginDataModel.RoleID === EnumRole.PrincipalNon) {
        this.searchRequest.InstituteId = this.sSOLoginDataModel.InstituteID
      }
      await this.teacherHigherEducationApplicationVerificationService.ApplicationList_ForPrinciple_THTE(this.searchRequest).then(async (data: any) => {
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

  async updateStatusRemark() {
    debugger
    let anySelected = this.ApplicationListData.some((x: any) => x.Selected === true)
    if (!anySelected) {
      this.toastr.warning('Please select at least one record.');
      return;
    }
    if(this.status == 0) {
      this.toastr.warning('Please select status.');
      return;
    }

    let dyMsg = '';
    if(this.status == 1341) {
      dyMsg = "Approve";
    } else {
      dyMsg = "Reject";
    }
    this.Swal2.Confirmation(`Are you sure you want to ${dyMsg}?`,
    async (result: any) => {
      
      if (result.isConfirmed) {
        Swal.fire({
          title: dyMsg + ' Application List',
          input: 'textarea',
          inputLabel: 'Remark',
          inputPlaceholder: 'Enter your remark here...',
          inputAttributes: {
            'aria-label': 'Type your remark here'
          },
          showCancelButton: true,
          confirmButtonText: 'Save Remark',
          cancelButtonText: 'Cancel'
        }).then(async (result: any) => {
          if (result.isConfirmed && result.value?.trim()) {
            const remark = result.value.trim();
            await this.openOTPModal(remark);
          } else if (result.isConfirmed && !result.value?.trim()) {
            this.toastr.warning('Remark is required.');
          }
        });
      }
    })
    
  }

  async openOTPModal(remark: string) {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno

    // await for open model
    await this.childComponent.OpenOTPPopup();

    // await OTP verification
    await this.childComponent.waitForVerification();

    // do work
    await this.SaveDataMarked(remark);
  }

  async SaveDataMarked(remark: string) {
    try {
      let selected = this.ApplicationListData.filter((x: any) => x.Selected === true)
      selected.forEach((x: any) => {
        x.ModifyBy = this.sSOLoginDataModel.UserID,
        x.status = this.status,
        x.Remark = remark,
        x.RoleID = this.sSOLoginDataModel.RoleID
      })

      await this.teacherHigherEducationApplicationVerificationService.UpdateApplicationStatus_Principle_THTE(selected)
      .then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.status = 0
          await this.ApplicationList_ForPrinciple_THTE();
        }
      })
    } catch (error) {
      console.error(error);
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
  //selectInTableAllCheckbox() {
  //  this.ApplicationListData.forEach((x: any) => {
  //    x.Selected = this.AllInTableSelect;
  //  });
  //}
  ////checked single (replace org. list here)
  //selectInTableSingleCheckbox(isSelected: boolean, item: any) {
  //  const data = this.ApplicationListData.filter((x: any) => x.StudentExamID == item.StudentExamID);
  //  data.forEach((x: any) => {
  //    x.Selected = isSelected;
  //  });
  //  //select all(toggle)
  //  this.AllInTableSelect = this.ApplicationListData.every((r: any) => r.Selected);
  //}



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
    const item = this.ApplicationListData.filter((x:any) => x.THTEAppID === row.THTEAppID);
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


  async ApplyCollegelist(model: any, THTEAppID: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.requestSearch.THTEAppID = THTEAppID


      await this.teacherHigherEducationApplicationService.THTE_GrtApplyInstituteList(this.requestSearch)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserApplyInstituteList = data.Data;
     /*     this.UserApplyInstituteList = this.UserApplyInstituteList.filter((item: any) => item.StatusID == 1340 || item.StatusID == 1345)*/
    


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

  async CloseModalRequestHistorylist() {
    this.modalService.dismissAll()
  }

  // end table feature
}
