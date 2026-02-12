import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { TeacherHigherEducationApplicationVerificationService } from '../../../../Services/teacher-higher-education-application-Verification/teacher-higher-education-application-Verification.service';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { ApplicationGenrateOrderByDteListSearchModel, PrincipleApplicationListSearchModel, THTE_ApplicationSearchModel, THTE_DropdownDataModel, UpdateApplicationStatusDataModel_Principle } from '../../../../Models/TeacherHigherEducationApplicationDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StaffMasterService } from '../../../../Services/StaffMaster/staff-master.service';
import { StaffDetailsDataModel } from '../../../../Models/StaffMasterDataModel';
import { TeacherHigherEducationApplicationService } from '../../../../Services/teacher-higher-education-application/teacher-higher-education-application.service';

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
  staffDetailsFormData = new StaffDetailsDataModel();
  public requestSearch = new THTE_ApplicationSearchModel();

  modalReference: NgbModalRef | undefined;
  public ApplicationListData: any = [];
  public ApplicationListOrderData: any = [];
  public StatusListDDL: any = [];
  public UpdateStatusListDDL: any = [];
  public enumRole = EnumRole;
  public Selecteditem: any = {}
  public UserApplyInstituteList: any = [];

  public status: number = 0;
  public isModalOpen: boolean = false;
  Dis_CommitteeDocs: string = ''
  CommitteeDocs: string = ''

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

    await this.GetMasterData();
  }

  async GetMasterData() {
    try {
      this.dropdownRequest.action = "GetStatusDDL"
      await this.commonMasterService.THTE_StatusDDL(this.dropdownRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StatusListDDL = data['Data'];
        this.UpdateStatusListDDL = data['Data'];

        if(this.sSOLoginDataModel.RoleID === EnumRole.DTE) {
          this.StatusListDDL = this.StatusListDDL.filter((x: any) => x.ID == 1342 || x.ID == 1353 || x.ID == 1345)
        } else if(this.sSOLoginDataModel.RoleID === EnumRole.CommitteInchargeDTE) {
          this.StatusListDDL = this.StatusListDDL.filter((x: any) => x.ID == 1342 || x.ID == 1354 || x.ID == 1353)
        }

        if(this.sSOLoginDataModel.RoleID == EnumRole.CommitteInchargeDTE) {
          this.UpdateStatusListDDL = this.UpdateStatusListDDL.filter((x: any) => x.ID == 1342 || x.ID == 1353)
        } else if(this.sSOLoginDataModel.RoleID === EnumRole.DTE) {
          this.UpdateStatusListDDL = this.UpdateStatusListDDL.filter((x: any) => x.ID == 1342 || x.ID == 1345)
        }
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
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID
      
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
    if (this.status == 1345) {
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
    await this.teacherHigherEducationApplicationVerificationService.GetApplication_GenrateOrder_Dte_THTE(this._DTEGenrateOrder).then(async (data: any) => {
        
        data = JSON.parse(JSON.stringify(data));
         
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

  async updateStatusRemark_DTECommittee() {
    let anySelected = this.ApplicationListData.some((x: any) => x.Selected === true)
    if (!anySelected) {
      this.toastr.warning('Please select at least one record.');
      return;
    }

    // if((this.searchRequest.status == 1354 && this.sSOLoginDataModel.RoleID === EnumRole.CommitteInchargeDTE) && 
    //     (this.CommitteeDocs == null || this.CommitteeDocs == '')) {
    //   this.toastr.warning('Please upload committee document.');
    //   return;
    // }

    let dyMsg = '';
    if (this.status == 1353) {
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
            await this.openOTPModal_DTECommittee(remark);
          } else if (result.isConfirmed && !result.value?.trim()) {
            this.toastr.warning('Remark is required.');
          }
        });
      }
    })
    
  }

  async openOTPModal_DTECommittee(remark: string) {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno

    // await for open model
    await this.childComponent.OpenOTPPopup();

    // await OTP verification
    await this.childComponent.waitForVerification();

    // do work
    await this.SaveDataMarked__DTECommittee(remark);
  }

  async SaveDataMarked__DTECommittee(remark: string) {
    try {
      let selected = this.ApplicationListData.filter((x: any) => x.Selected === true)
      selected.forEach((x: any) => {
        x.ModifyBy = this.sSOLoginDataModel.UserID,
          x.status = this.status,
          x.Remark = remark,
          x.RoleID = this.sSOLoginDataModel.RoleID,
          x.CommitteeDocs = this.CommitteeDocs,
          x.Dis_CommitteeDocs = this.Dis_CommitteeDocs  
      })

      await this.teacherHigherEducationApplicationVerificationService.UpdateApplicationStatus_DTE_THTE(selected)
      .then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.status = 0
          this._DTEGenrateOrder.THTEAppIDs = selected.map((x: any) => x.THTEAppID).join(',');
          this._DTEGenrateOrder.RoleID = this.sSOLoginDataModel.RoleID;
          await this.GenrateOrder();
          await this.ApplicationList_ForPrinciple_THTE();
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async OnConfirm(content: any, ID: number) {
    this.modalReference = this.modalService.open(content, { size: 'xl', backdrop: 'static' });
    this.isModalOpen = true;  // Open the modal
    this.GetByID(ID)
  }

  ClosePopup(): void {
    this.modalReference?.close();  // Close the modal
  }

  async GetByID(id: number) {
    
    try {

      this.loaderService.requestStarted();

      await this.staffMasterService.GetByID(id, this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'FFFFF');
          this.staffDetailsFormData = data['Data']
          this.staffDetailsFormData.StaffID = data['Data']["StaffID"];
          this.staffDetailsFormData.StaffTypeID = data['Data']["StaffTypeID"];
          this.staffDetailsFormData.Name = data['Data']["Name"];
          this.staffDetailsFormData.SSOID = data['Data']["SSOID"];
          this.staffDetailsFormData.AdharCardNumber = data['Data']["AdharCardNumber"];
          this.staffDetailsFormData.RoleID = data['Data']["RoleID"];
          this.staffDetailsFormData.DesignationID = data['Data']["DesignationID"];
          this.staffDetailsFormData.StateID = data['Data']["StateID"];
          /*   await this.ddlState_Change();*/
          this.staffDetailsFormData.DistrictID = data['Data']["DistrictID"];

          this.staffDetailsFormData.Address = data['Data']["Address"];

          this.staffDetailsFormData.CourseID = data['Data']["CourseID"];

          /*  await this.ddlStream_Change();*/
          this.staffDetailsFormData.SubjectID = data['Data']["SubjectID"];
          this.staffDetailsFormData.Email = data['Data']["Email"];
          this.staffDetailsFormData.MobileNumber = data['Data']["MobileNumber"];
          this.staffDetailsFormData.HigherQualificationID = data['Data']["HigherQualificationID"];

          if (data['Data']["AdharCardPhoto"] != null) {
            this.staffDetailsFormData.AdharCardPhoto = data['Data']["AdharCardPhoto"];
          } else {
            this.staffDetailsFormData.AdharCardPhoto = ''
          }
          if (data['Data']["Dis_AdharCardNumber"] != null) {
            this.staffDetailsFormData.Dis_AdharCardNumber = data['Data']["Dis_AdharCardNumber"];
          } else {
            this.staffDetailsFormData.Dis_AdharCardNumber = ''
          }

          if (data['Data']["ProfilePhoto"] != null) {
            this.staffDetailsFormData.ProfilePhoto = data['Data']["ProfilePhoto"];
          } else {
            this.staffDetailsFormData.ProfilePhoto = ''
          }
          if (data['Data']["Dis_ProfileName"] != null) {
            this.staffDetailsFormData.Dis_ProfileName = data['Data']["Dis_ProfileName"];
          } else {
            this.staffDetailsFormData.Dis_ProfileName = ''
          }

          if (data['Data']["PanCardPhoto"] != null) {
            this.staffDetailsFormData.PanCardPhoto = data['Data']["PanCardPhoto"];
          } else {
            this.staffDetailsFormData.PanCardPhoto = ''
          }
          if (data['Data']["Dis_PanCardNumber"] != null) {
            this.staffDetailsFormData.Dis_PanCardNumber = data['Data']["Dis_PanCardNumber"];
          } else {
            this.staffDetailsFormData.Dis_PanCardNumber = ''
          }

          if (data['Data']["Certificate"] != null) {
            this.staffDetailsFormData.Certificate = data['Data']["Certificate"];
          } else {
            this.staffDetailsFormData.Certificate = ''
          }
          if (data['Data']["Dis_Certificate"] != null) {
            this.staffDetailsFormData.Dis_Certificate = data['Data']["Dis_Certificate"];
          } else {
            this.staffDetailsFormData.Dis_Certificate = ''
          }

          this.staffDetailsFormData.PanCardNumber = data['Data']["PanCardNumber"];

          this.staffDetailsFormData.DateOfBirth = this.dateSetter(data['Data']['DateOfBirth'])
          this.staffDetailsFormData.DateOfAppointment = this.dateSetter(data['Data']['DateOfAppointment'])
          this.staffDetailsFormData.DateOfJoining = this.dateSetter(data['Data']['DateOfJoining'])
          this.staffDetailsFormData.Experience = data['Data']["Experience"];

          this.staffDetailsFormData.SpecializationSubjectID = data['Data']["SpecializationSubjectID"];
          this.staffDetailsFormData.AnnualSalary = data['Data']["AnnualSalary"];
          this.staffDetailsFormData.PFDeduction = data['Data']["PFDeduction"];
          this.staffDetailsFormData.ResearchGuide = data['Data']["ResearchGuide"];
          this.staffDetailsFormData.StaffStatus = data['Data']["StaffStatus"];
          this.staffDetailsFormData.EduQualificationDetailsModel = data['Data']["EduQualificationDetailsModel"];
          this.staffDetailsFormData.Pincode = data['Data']['Pincode']

          this.staffDetailsFormData.BankName = data['Data']['BankName']
          this.staffDetailsFormData.BankAccountNo = data['Data']['BankAccountNo']
          this.staffDetailsFormData.BankAccountName = data['Data']['BankAccountName']
          this.staffDetailsFormData.IFSCCode = data['Data']['IFSCCode']


          if (this.staffDetailsFormData.StaffSubjectListModel != null)
            this.staffDetailsFormData.StaffSubjectListModel.forEach(e => {
              e.SubjectType = e.IsOptional ? 'Optional' : 'Teaching'

            })
          console.log(this.staffDetailsFormData.StaffSubjectListModel);

          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";
        }, (error: any) => console.error(error));
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

  dateSetter(date: any){
    const Dateformat = new Date(date);
    const year = Dateformat.getFullYear();
    const month = String(Dateformat.getMonth() + 1).padStart(2, '0');
    const day = String(Dateformat.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
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

  async CloseModalRequestHistorylist() {
    this.Selecteditem = {}
    this.modalService.dismissAll()
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

  async SaveDTERecommendationInstitutes_THTE(remark: string) {
     
    try {
      // let selected = this.UserApplyInstituteList.filter((x: any) => x.SelectedInstitute === true)
      // if (selected.length == 0) {
      //   this.toastr.warning("Please Select Institute")
      //   return
      // }

      // 1. Check if every single row has a status selected (!= 0)
      const allStatusSelected = this.UserApplyInstituteList.every((row: any) => 
        row.DTECommitteeStatus != 0 && row.DTECommitteeStatus != null
      );

      if (!allStatusSelected) {
        this.toastr.error("Please choose status for all institutes in the list.");
        return;
      }

      // 2. Check if rejections have remarks
      const invalidRejections = this.UserApplyInstituteList.filter((row: any) => 
        row.DTECommitteeStatus == 1342 && (!row.Remarks || row.Remarks.trim() === '')
      );

      if (invalidRejections?.length > 0) {
        this.toastr.error("Remarks are mandatory for all rejected institutes.");
        return;
      }

      this.UserApplyInstituteList.forEach((e: any) => {
        e.UserID = this.sSOLoginDataModel.UserID
      });

      await this.teacherHigherEducationApplicationService.SaveDTERecommendationInstitutes_THTE(this.UserApplyInstituteList)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.status = 0;
            await this.CloseModalRequestHistorylist();
            // this.request = new UpdateApplicationStatusDataModel_Committee();
            // await this.ApplicationList_ForCommittee_THTE();
          }
        })
    } catch (error) {
      console.error(error);
    }
  }
}
