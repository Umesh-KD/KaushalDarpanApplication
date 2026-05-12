import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { TeacherHigherEducationApplicationVerificationService } from '../../../../Services/teacher-higher-education-application-Verification/teacher-higher-education-application-Verification.service';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { PrincipleApplicationListSearchModel, THTE_ApplicationSearchModel, THTE_DDL, THTE_DropdownDataModel, UpdateApplicationStatusDataModel_Committee } from '../../../../Models/TeacherHigherEducationApplicationDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import Swal from 'sweetalert2';
import { TeacherHigherEducationApplicationService } from '../../../../Services/teacher-higher-education-application/teacher-higher-education-application.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-verify-application-committee',
  standalone: false,
  templateUrl: './verify-application-committee.component.html',
  styleUrl: './verify-application-committee.component.css'
})
export class VerifyApplicationCommitteeComponent {
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public requestSearch = new THTE_ApplicationSearchModel();
  public searchRequest = new PrincipleApplicationListSearchModel();
  public dropdownRequest = new THTE_DropdownDataModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new UpdateApplicationStatusDataModel_Committee();
  public Selecteditem: any = {}
  public ApplicationListData: any = [];
  public StatusListDDL: any = [];
  public UserApplyInstituteList: any = [];
  public UpdateStatusListDDL: any = [];
  public InstituteStatusListDDL: any = [];
  public CommitteeListDDL: any = [];
  public UserRequestHistoryList: any = [];
  public SelectedInstituteId: number | null = null;

  public status: number = 0;
  public CommitteeID: number = 0;
  modalReference: NgbModalRef | undefined;
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
  public requestDDl = new THTE_DDL();
  //end table feature default
  public isShowInstituteSaveButton: boolean = false;

  constructor(
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private Swal2: SweetAlert2,
    private activatedRoute: ActivatedRoute,
    public appsettingConfig: AppsettingService,
    public teacherHigherEducationApplicationVerificationService: TeacherHigherEducationApplicationVerificationService,
    private router: Router,
    public teacherHigherEducationApplicationService: TeacherHigherEducationApplicationService,
    private modalService: NgbModal,

  ) { }

  async ngOnInit () { 
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetCommitteeListDDL();
    await this.GetStatusData();
  }


  async GetCommitteeListDDL() {
    try {
      this.requestDDl.UserID = this.sSOLoginDataModel.UserID;
      this.requestDDl.RoleID = this.sSOLoginDataModel.RoleID;
      
      await this.teacherHigherEducationApplicationService.GetCommitteeDDL(this.requestDDl)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CommitteeListDDL = data['Data'];
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async GetStatusData() {
    try {
      this.dropdownRequest.action = "GetStatusDDL"
      this.dropdownRequest.RoleID = this.sSOLoginDataModel.RoleID
      
      await this.commonMasterService.THTE_StatusDDL(this.dropdownRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StatusListDDL = data['Data'];
        this.StatusListDDL = this.StatusListDDL.filter((x: any) => x.ID === 1341  || x.ID === 1343)
        this.UpdateStatusListDDL = this.StatusListDDL.filter((x: any) => x.ID === 1343)
      })
    } catch (error) {
      console.error(error);
    }
  }

  async GetCommitteeData() {
    try {
      this.dropdownRequest.action = "GetStatusDDL"
      this.dropdownRequest.RoleID = this.sSOLoginDataModel.RoleID

      await this.commonMasterService.THTE_StatusDDL(this.dropdownRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StatusListDDL = data['Data'];
        this.StatusListDDL = this.StatusListDDL.filter((x: any) => x.ID === 1341 || x.ID === 1342 || x.ID === 1343)
        this.UpdateStatusListDDL = this.StatusListDDL.filter((x: any) => x.ID === 1343 || x.ID === 1342)
      })
    } catch (error) {
      console.error(error);
    }
  }



  async btn_Clear() {
    this.searchRequest = new PrincipleApplicationListSearchModel();
  }

  async ApplicationList_ForCommittee_THTE() {
    try {
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID

      if(this.sSOLoginDataModel.RoleID === EnumRole.Principal || this.sSOLoginDataModel.RoleID === EnumRole.PrincipalNon) {
        this.searchRequest.InstituteId = this.sSOLoginDataModel.InstituteID
      }
      await this.teacherHigherEducationApplicationVerificationService.ApplicationList_ForCommittee_THTE(this.searchRequest).then(async (data: any) => {
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
    if(this.status == 0) {
      this.toastr.warning('Please select status.');
      return;
    }

    if (this.CommitteeID == 0) {
      this.toastr.warning('Please select committee.');
      return;
    }
    

    // if(this.request.CommitteeDocs == '' || this.request.CommitteeDocs == undefined || this.request.CommitteeDocs == null) {
    //   this.toastr.warning('Please upload committee document.');
    //   return;
    // }

    let dyMsg = '';
    if(this.status == 1343) {
      dyMsg = "Accept And Forward To Principle";
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
      this.request.ApplicationListData = selected

      this.request.ModifyBy = this.sSOLoginDataModel.UserID
      this.request.status = this.status
      this.request.Remark = remark
      this.request.RoleID = this.sSOLoginDataModel.RoleID
      this.request.CommitteeID = this.CommitteeID

      await this.teacherHigherEducationApplicationVerificationService.UpdateApplicationStatus_Committee_THTE(this.request)
      .then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.status = 0;
          this.CommitteeID = 0;
          this.request = new UpdateApplicationStatusDataModel_Committee();
          await this.ApplicationList_ForCommittee_THTE();
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
                this.request.Dis_CommitteeDocs = data['Data'][0]["Dis_FileName"];
                this.request.CommitteeDocs = data['Data'][0]["FileName"];

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
  // selectInTableAllCheckbox() {
  //   this.paginatedInTableData.forEach((row: any) => {
  //     row.Selected = this.AllInTableSelect;

  //     // Direct update to the original list
  //     const item = this.ApplicationListData.find((x: any) => x.THTEAppID === row.THTEAppID);
  //     if (item) {
  //       item.Selected = this.AllInTableSelect;
  //     }
  //   });
  // }
  selectInTableAllCheckbox() {
  this.paginatedInTableData.forEach((row: any) => {
    // Apply the same condition used in your HTML *ngIf
    const isEligible = row.SelectedInstitute != '' && row.SelectedInstitute != null;

    if (isEligible) {
      row.Selected = this.AllInTableSelect;

      // Update the master list
      const item = this.ApplicationListData.find((x: any) => x.THTEAppID === row.THTEAppID);
      if (item) {
        item.Selected = this.AllInTableSelect;
      }
    } else {
      // Optional: Ensure ineligible rows remain unselected
      row.Selected = false; 
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

          const selected = this.UserApplyInstituteList.find(
            (e: any) => e.SelectedInstitute === 1
          );

          if (selected) {
            this.SelectedInstituteId = selected.ID; // acd.ID
          }
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

  async CloseModalRequestHistorylist() {
    this.Selecteditem = {}
    this.modalService.dismissAll()
  }
  onRadioChange(row: any): void {
   

    this.UserApplyInstituteList.forEach(
      (r: any) => r.SelectedInstitute = false
    );

    row.SelectedInstitute = true;
  }



  async SaveSelectedInstitute(remark: string) {
     
    try {
      // let selected = this.UserApplyInstituteList.filter((x: any) => x.SelectedInstitute === true)
      // if (selected.length == 0) {
      //   this.toastr.warning("Please Select Institute")
      //   return
      // }

      // 1. Check if every single row has a status selected (!= 0)
      const allStatusSelected = this.UserApplyInstituteList.every((row: any) => 
        row.InstituteStatus != 0 && row.InstituteStatus != null
      );

      if (!allStatusSelected) {
        this.toastr.error("Please choose status for all institutes in the list.");
        return;
      }

      // 2. Check if rejections have remarks
      const invalidRejections = this.UserApplyInstituteList.filter((row: any) => 
        row.InstituteStatus == 1342 && (!row.Remarks || row.Remarks.trim() === '')
      );

      if (invalidRejections?.length > 0) {
        this.toastr.error("Remarks are mandatory for all rejected institutes.");
        return;
      }

      this.UserApplyInstituteList.forEach((e: any) => {
        e.UserID = this.sSOLoginDataModel.UserID
      });

      console.log("this.UserApplyInstituteList",this.UserApplyInstituteList);


      await this.teacherHigherEducationApplicationService.UpdateInstitutestatus(this.UserApplyInstituteList)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.status = 0;
            this.CommitteeID = 0;
            this.CloseModalRequestHistorylist();
            this.request = new UpdateApplicationStatusDataModel_Committee();
            await this.ApplicationList_ForCommittee_THTE();
          }
        })
    } catch (error) {
      console.error(error);
    }
  }

  async onUserRequestHistorylist(model: any, THTEAppID: number) {
     
    try {
      this.loaderService.requestStarted();
      this.requestSearch.THTEAppID = THTEAppID

      await this.teacherHigherEducationApplicationService.THTE_GrtApplicationStatusHistory(this.requestSearch)
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

  CloseModalRequestHistorylist1() {
    this.modalService.dismissAll();
    this.modalReference?.close();
  }

}



