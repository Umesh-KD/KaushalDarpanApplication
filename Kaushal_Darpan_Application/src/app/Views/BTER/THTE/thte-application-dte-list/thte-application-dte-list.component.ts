import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { TeacherHigherEducationApplicationVerificationService } from '../../../../Services/teacher-higher-education-application-Verification/teacher-higher-education-application-Verification.service';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { ApplicationGenrateOrderByDteListSearchModel, PrincipleApplicationListSearchModel, THTE_DropdownDataModel, UpdateApplicationStatusDataModel_Principle } from '../../../../Models/TeacherHigherEducationApplicationDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-thte-application-dte-list',
  standalone: false,
  templateUrl: './thte-application-dte-list.component.html',
  styleUrl: './thte-application-dte-list.component.css'
})
export class THTEApplicationDteListComponent {
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  public searchRequest = new PrincipleApplicationListSearchModel();
  public dropdownRequest = new THTE_DropdownDataModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public _DTEGenrateOrder = new ApplicationGenrateOrderByDteListSearchModel();


  public ApplicationListData: any = [];
  public ApplicationListOrderData: any = [];
  public StatusListDDL: any = [];
  public UpdateStatusListDDL: any = [];

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
    private router: Router,
  ) { }

  async ngOnInit () { 
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetMasterData();
  }

  async GetMasterData() {
    try {
      this.dropdownRequest.action = "GetStatusDDL"
      await this.commonMasterService.THTE_StatusDDL(this.dropdownRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StatusListDDL = data['Data'];
        this.UpdateStatusListDDL = data['Data'];

        this.StatusListDDL = this.StatusListDDL.filter((x: any) => x.ID == 1342 || x.ID == 1344 || x.ID == 1345)
        this.UpdateStatusListDDL = this.UpdateStatusListDDL.filter((x: any) => x.ID == 1342 || x.ID == 1345)
        
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

  async updateStatusRemark() {
    let anySelected = this.ApplicationListData.some((x: any) => x.Selected === true)
    if (!anySelected) {
      this.toastr.warning('Please select at least one record.');
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
      debugger
      

      await this.teacherHigherEducationApplicationVerificationService.UpdateApplicationStatus_DTE_THTE(selected)
      .then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.status = 0
          this._DTEGenrateOrder.THTEAppIDs = selected.map((x: any) => x.THTEAppID).join(',');
          this._DTEGenrateOrder.RoleID = this.sSOLoginDataModel.RoleID;
          this.GenrateOrder();
          await this.ApplicationList_ForPrinciple_THTE();
        }
      })
    } catch (error) {
      console.error(error);
    }
  }




  async GenrateOrder() {
    debugger
    await this.teacherHigherEducationApplicationVerificationService.GetApplication_GenrateOrder_Dte_THTE(this._DTEGenrateOrder).then(async (data: any) => {
        
        data = JSON.parse(JSON.stringify(data));
        debugger
        if (data && data.Data) {
          const base64 = data.Data;

          const byteCharacters = atob(base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = 'THTEApplicationGenrateOrderDte.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        } 
      }, (error: any) => {
        console.error(error);
        this.toastr.error("some error !")
      });
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
