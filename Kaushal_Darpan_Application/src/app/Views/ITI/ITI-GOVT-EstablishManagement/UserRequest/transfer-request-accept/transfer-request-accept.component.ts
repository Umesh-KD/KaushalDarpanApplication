import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel, ITIGovtEMStaffMasterDataModel, ITI_Govt_EM_ZonalOFFICERSSearchDataModel, ITI_Govt_EM_ZonalOFFICERSDataModel, UpdateSSOIDByPricipleModel, ITI_Govt_EM_OFFICERSSearchDataModel, ITI_Govt_EM_OFFICERSDataModel, ITI_Govt_EM_PersonalDetailByUserIDSearchModel, RequestUpdateStatus, RelievingLetterSearchModel, JoiningLetterSearchModel, ITI_Relieving_joining_CheckVacantPostModel } from '../../../../../Models/ITIGovtEMStaffMasterDataModel';
import { DropdownValidators } from '../../../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ITIGovtEMStaffMaster } from '../../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff, EnumProfileStatus, EnumEMProfileStatus, GlobalConstants, EnumTransferStatus_ITI_EM } from '../../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../../Common/SweetAlert2';
import { ItiSeatIntakeService } from '../../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITICollegeTradeSearchModel } from '../../../../../Models/ITI/SeatIntakeDataModel';
import { Iti_Update_Relieved_RevertModel, RequestSearchModel } from '../../../../../Models/ITI/UserRequestModel';
import { UserRequestService } from '../../../../../Services/UserRequest/user-request.service';
import { AppsettingService } from '../../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OTPModalComponent } from '../../../../otpmodal/otpmodal.component';



@Component({
  selector: 'app-transfer-request-accept',
  standalone: false,
  templateUrl: './transfer-request-accept.component.html',
  styleUrl: './transfer-request-accept.component.css'
})
export class TransferRequestAcceptComponent {
  
public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel();
  public isSubmitted: boolean = false;
  groupForm!: FormGroup;
  groupFormVRS!: FormGroup;
  public searchRequest = new RequestSearchModel();
  public searchRequestUpdateSSOIDByPricipleModel = new UpdateSSOIDByPricipleModel();
  staffDetailsFormData = new ITIGovtEMStaffMasterDataModel();
  public searchRequestITi = new ITICollegeTradeSearchModel();
  public isLoading: boolean = false;
  requestCheckVacantPost = new ITI_Relieving_joining_CheckVacantPostModel();
  ddlCheckVacantPost = new ITI_Relieving_joining_CheckVacantPostModel();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RoleMasterList: any[] = [];
  public UserRequestList: any[] = [];
  public filteredStatusList: any[] = [];
  public DesignationMasterList: any[] = [];
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public ITIGovtEMOFFICERSList: any[] = [];
  public StaffTypeList: any[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  public isModalOpen = false;
  public StaffLevelList: any = [];
  public StaffLevelChildList: any = [];
  public HostelList: any = [];
  public UserRequestHistoryList: any[] = [];
  public BranchesMasterList: any = [];
  public TechnicianList: any = [];
  public HOD_DDlList: any = [];
  public StaffParentID: number = 0;
  public settingsMultiselect: object = {};
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public ExamOfLevelList: any = [];
  public OfficeList: any = [];
  public LevelList: any = [];
  public VacantPostEmployeeList: any = [];
  public PostList: any = [];
  public ExamTypeList: any = [];
  public RoleListDDL: any = [];
  public QueryReqFormGroup!: FormGroup;
  public _EnumRole = EnumRole
  public GetRoleID: number=0
  public DdlType: string=''
  AddedEducationList: ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel[] = [];
  public educationDetailsRequest = new ITI_Govt_EM_PersonalDetailByUserIDSearchModel();
  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;
  closeResult: string | undefined;
  public CheckUserID: number = 0
  public _EnumProfileStatus = EnumProfileStatus;
  public type: string=''
  public RequestUpdateStatus = new RequestUpdateStatus();
  public RevertModel = new Iti_Update_Relieved_RevertModel();
  public RowlistData  = new RequestUpdateStatus;
  public searchRequestRelieving = new RelievingLetterSearchModel();
  public searchRequestJoining = new JoiningLetterSearchModel();
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  public _EnumTransferStatus_ITI_EM = EnumTransferStatus_ITI_EM;
  public RequestTypeSHowID: number = 0
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
  public PostMessage: string = '';
  public PostCheckValue: number = 0;


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
    private userRequestService: UserRequestService, 
    private fb: FormBuilder, 
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
  ) { }



  async ngOnInit() {
    this.groupForm = this.fb.group({
      ddlStatus: [0, [DropdownValidators]],
      txtRemark: ['', Validators.required],
      txtLastworkingDate: [''],
      txtJoiningDate: [''],
      JoiningRoleID: [0, [DropdownValidators]],
      JoiningTimeID: [0, [DropdownValidators]],
      EmployeeID: [0],
    });

    this.groupFormVRS = this.fb.group({
      ddlStatus: [0, [DropdownValidators]],
      txtRemark: [''],
      txtIsEOL:[false],
      txtIsEnquiries: [false],
      txtEOLFromDate: [''],
      txtEOLToDate: ['']
    });


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;    

    this.QueryReqFormGroup = this.formBuilder.group({
      txtSSOID: ['',[Validators.required]]
    });

    await this.GetStatusList();
    await this.GetRoleListDDL();
    this.formData.LevelOfExamID = 0;
    this.formData.ExamTypeID = 0;
    await this.GetLevelList();
    await this.GetPostList();
    await this.GetStaffTypeData();
  /*  this.getlist();*/
    }

  async getlist() {    
    try {
      if (this.searchRequest.RequestType == 0) {
        this.toastr.error('Please select Request Type');
        return;
      }
      if (this.searchRequest.RequestType == 1) {
        this.RequestTypeSHowID = 1;
        this.searchRequest.Action = "DepartmentWiseRequestlist";
      } else if (this.searchRequest.RequestType == 2) {
        this.RequestTypeSHowID = 2;
        this.searchRequest.Action = "DepartmentWiseJoiningRequestlist";
        this.searchRequest.UserId = this.sSOLoginDataModel.UserID;
      } else {
        this.searchRequest.Action = "DepartmentWiseRequestlist";
      }


      this.searchRequest.PageNumber =0
      this.searchRequest.PageSize = 0
     
      this.searchRequest.CreatedBy = this.sSOLoginDataModel.UserID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.searchRequest.UserId = this.sSOLoginDataModel.UserID;

      this.loaderService.requestStarted();
      await this.userRequestService.GetUserRequestList_DDO(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserRequestList = data.Data;
          this.loadInTable();

          this.totalRecord = this.UserRequestList[0]?.TotalRecords;
          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

        }, (error: any) => console.error(error))
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
  async GetStatusList() {

    try {
      this.loaderService.requestStarted();
      this.type = 'ITIvtARRStauts';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.filteredStatusList = data['Data'];
          this.filteredStatusList = this.filteredStatusList.filter((item: any) => item.ID != this._EnumEMProfileStatus.Pending && item.ID != this._EnumEMProfileStatus.Completed && item.ID != this._EnumEMProfileStatus.LockAndSubmit && item.ID != this._EnumEMProfileStatus.Revert)
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


  async StatusWiseCondition(): Promise<void> {
    debugger;

    //const lastWorkingDateControl = this.groupForm.get('txtLastworkingDate');

    //if (!lastWorkingDateControl) {
    //  return;
    //}

    if (this.searchRequest.RequestType == 1) {

      if (this.RequestUpdateStatus.StatusIDs == 247) {
        this.groupForm.controls['txtLastworkingDate'].setValidators([Validators.required]);
        //lastWorkingDateControl.setValidators(Validators.required);
      } else {
        this.groupForm.controls['txtLastworkingDate'].clearValidators();
      }

      this.groupForm.controls['txtLastworkingDate'].updateValueAndValidity();

    }

    if (this.searchRequest.RequestType == 2) {

      if (this.RequestUpdateStatus.StatusIDs == 247) {
        this.groupForm.controls['txtJoiningDate'].setValidators([Validators.required]);
        //lastWorkingDateControl.setValidators(Validators.required);

        await this.GetRelieving_joining_CheckVacantPostModel();

        if (this.PostCheckValue == 3) {
          this.toastr.warning(this.PostMessage);
          this.groupForm.controls['EmployeeID'].setValidators([DropdownValidators]);
          await this.Getjoining_VacantPostEmployee();
        }
        else {
          this.groupForm.controls['EmployeeID'].clearValidators();
        }

      } else {
        this.groupForm.controls['txtJoiningDate'].clearValidators();
      }

      this.groupForm.controls['txtJoiningDate'].updateValueAndValidity();
      this.groupForm.controls['EmployeeID'].updateValueAndValidity();

     


    }

  }


  async onSubmitStaffRequest(model: any, userSubmitData: any) {
    debugger
    try {
      this.RowlistData = { ...userSubmitData };
      console.log(this.RequestUpdateStatus, "modal");
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });

      //const lastWorkingDateControl = this.groupForm.get('txtLastworkingDate');

      //if (!lastWorkingDateControl) {
      //  return;
      //}


      //if (this.searchRequest.RequestType == 1) 
      //  {
      //  if (this.RequestUpdateStatus.StatusIDs === 247) {
      //    lastWorkingDateControl.setValidators(Validators.required);
      //  } else {
      //    lastWorkingDateControl.clearValidators();
      //  }

      //  lastWorkingDateControl.updateValueAndValidity();
      //}




    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async GetStaffTypeData() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('ITI_StaffType').then((data: any) => {
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

  async GetPostList() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('PostMaster', -1)
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

  async GetOfficeList() {


    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, this.searchRequest.LevelID)
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

  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.RequestUpdateStatus.StatusIDs = 0;
    this.RequestUpdateStatus.Remark = '';
    this.RequestUpdateStatus.OnHoldDoc = '';
    this.RequestUpdateStatus.Dis_OnHoldDoc = '';
    this.RequestUpdateStatus.JoiningDate = '';
    this.RequestUpdateStatus.JoiningTimeID = 0;
    this.RequestUpdateStatus.JoiningRoleID = 0;
    this.isSubmitted = false;
     this.RevertModel = new Iti_Update_Relieved_RevertModel();
  }

  async updateReqStatus() {
    debugger
    

    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      this.RequestUpdateStatus.CreatedBy = this.sSOLoginDataModel.UserID;
      this.RequestUpdateStatus.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.RequestUpdateStatus.ServiceRequestId = this.RowlistData.ServiceRequestId;
      this.RequestUpdateStatus.RequestType = this.RowlistData.RequestTypeID;
      this.RequestUpdateStatus.UserID = this.RowlistData.UserID;

      if (this.searchRequest.RequestType == 1) {
        await this.userRequestService.UserRequestUpdateStatus(this.RequestUpdateStatus)
          .then(async (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == EnumStatus.Success) {
              this.toastr.success(this.Message)
              this.CloseModal();
              this.getlist();
              this.RequestUpdateStatus = new RequestUpdateStatus();
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.Message)
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })

      } else if (this.searchRequest.RequestType == 2) {
        

        await this.userRequestService.UserRequestUpdateStatus(this.RequestUpdateStatus)
          .then(async (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == EnumStatus.Success) {
              this.toastr.success(this.Message)
              this.CloseModal();
              this.getlist();
              this.RequestUpdateStatus = new RequestUpdateStatus();
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.Message)
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
        
      }




    
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async refreshValidators() {
    debugger
    if(this.RequestUpdateStatus.StatusIDs!=247) {
      this.groupForm.get('txtJoiningDate')?.clearValidators();
      this.groupForm.get('JoiningTimeID')?.clearValidators();
      this.groupForm.get('JoiningRoleID')?.clearValidators();

      this.groupForm.get('txtJoiningDate')?.updateValueAndValidity();
      this.groupForm.get('JoiningTimeID')?.updateValueAndValidity();
      this.groupForm.get('JoiningRoleID')?.updateValueAndValidity();
    }
  }

  parseDDMMYYYY(dateStr: string): Date {
    const [dd, mm, yyyy] = dateStr.split('-');
    return new Date(+yyyy, +mm - 1, +dd);
  }
  async UserRequestJoiningApprove_ITI_EM() {
    debugger

   

    await this.refreshValidators();
    this.isSubmitted = true;
    this.groupForm.get('txtLastworkingDate')?.clearValidators();
    this.groupForm.get('txtLastworkingDate')?.updateValueAndValidity();
    if (this.groupForm.invalid) {
      this.toastr.error("Please fill all required fields");
      return;
    }
    if(this.RequestUpdateStatus.StatusIDs==EnumTransferStatus_ITI_EM.On_Hold && (this.RequestUpdateStatus.OnHoldDoc == '')) {
      this.toastr.error("Please upload document");
      return;
    }

    if(this.RequestUpdateStatus.StatusIDs==EnumTransferStatus_ITI_EM.Approve){
      const joiningDate = new Date(this.RequestUpdateStatus.JoiningDate);
      const requestDate = this.parseDDMMYYYY(this.RowlistData.RequestDate);

      // remove time part (important for accurate comparison)
      joiningDate.setHours(0, 0, 0, 0);
      requestDate.setHours(0, 0, 0, 0);

      if (joiningDate < requestDate) {
        this.CloseModal();
        this.toastr.error("Joining Date should be greater than or equal to Relieving Date");
        return;
      }
    }
    
    this.loaderService.requestStarted();
    this.isLoading = true;


    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno;

    // await for open model
    await this.childComponent.OpenOTPPopup();
    // await OTP verification
    await this.childComponent.waitForVerification();


    this.RequestUpdateStatus.CreatedBy = this.sSOLoginDataModel.UserID;
    this.RequestUpdateStatus.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.RequestUpdateStatus.ServiceRequestId = this.RowlistData.ServiceRequestId;
    this.RequestUpdateStatus.RequestType = this.RowlistData.RequestTypeID;
    this.RequestUpdateStatus.UserID = this.RowlistData.UserID;

    await this.userRequestService.UserRequestJoiningApprove_ITI_EM(this.RequestUpdateStatus)
      .then(async (data: any) => {

        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message)
          this.CloseModal();
          this.getlist();
          this.RequestUpdateStatus = new RequestUpdateStatus();
        }
        else if (data.State == EnumStatus.Warning) {
          this.toastr.warning(data.Message)
        }
        else {
          this.toastr.error(data.ErrorMessage)
        }
      });


   /* --------------------*/

    //this.Swal2.Confirmation("Are you sure you want to update request ?",
    //  async (result: any) => {
    //    //confirmed
    //    if (result.isConfirmed) {
    //      try {
    //        this.RequestUpdateStatus.CreatedBy = this.sSOLoginDataModel.UserID;
    //        this.RequestUpdateStatus.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    //        this.RequestUpdateStatus.ServiceRequestId = this.RowlistData.ServiceRequestId;
    //        this.RequestUpdateStatus.RequestType = this.RowlistData.RequestTypeID;
    //        this.RequestUpdateStatus.UserID = this.RowlistData.UserID;

    //        await this.userRequestService.UserRequestJoiningApprove_ITI_EM(this.RequestUpdateStatus)
    //          .then(async (data: any) => {

    //            if (data.State == EnumStatus.Success) {
    //              this.toastr.success(data.Message)
    //              this.CloseModal();
    //              this.getlist();
    //              this.RequestUpdateStatus = new RequestUpdateStatus();
    //            }
    //            else if (data.State == EnumStatus.Warning) {
    //              this.toastr.warning(data.Message)
    //            }
    //            else {
    //              this.toastr.error(data.ErrorMessage)
    //            }
    //          })
    //      }
    //      catch (ex) { console.log(ex) }
    //      finally {
    //        setTimeout(() => {
    //          this.loaderService.requestEnded();
    //          this.isLoading = false;
    //        }, 200);
    //      }
    //    }
    //  });
  }

  async onSubmitModel_VRS(model: any, userSubmitData: any) {
     debugger
     try {
       this.RowlistData = { ...userSubmitData };
       console.log(this.RequestUpdateStatus, "modal");
       this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
 
       //const lastWorkingDateControl = this.groupForm.get('txtLastworkingDate');
 
       //if (!lastWorkingDateControl) {
       //  return;
       //}
 
 
       //if (this.searchRequest.RequestType == 1) 
       //  {
       //  if (this.RequestUpdateStatus.StatusIDs === 247) {
       //    lastWorkingDateControl.setValidators(Validators.required);
       //  } else {
       //    lastWorkingDateControl.clearValidators();
       //  }
 
       //  lastWorkingDateControl.updateValueAndValidity();
       //}
 
 
 
 
     } catch (error) {
       console.error('Error fetching data:', error);
     }
   }

  async onUserRequestHistorylist(model: any, ServiceRequestId: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.searchRequest.ServiceRequestId = ServiceRequestId;
      await this.userRequestService.UserRequestHistoryList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserRequestHistoryList = data.Data;
          this.totalRecord = this.UserRequestList[0]?.TotalRecords;
          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

        }, (error: any) => console.error(error))

      console.log(ServiceRequestId, "modal");
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

  async ResetControl() {
    this.isSubmitted = false;
    this.searchRequest.RequestType = 0;
    this.searchRequest.LevelID = 0;
    this.searchRequest.PostID = 0;
    this.searchRequest.OfficeID = 0;
    this.searchRequest.StaffTypeID = 0;
    this.searchRequest.OrderNo = "";
    this.UserRequestList = [];

    //await this.getlist();
  }

  CloseModalRequestHistorylist() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.isSubmitted = false;
  }
  async onSubmitJoiningRequest(model: any, userSubmitData: any) {
    debugger
    try {
      this.RowlistData = { ...userSubmitData };
      console.log(this.RequestUpdateStatus, "modal");

      this.requestCheckVacantPost.OfficeID = userSubmitData.OfficeID;
      this.requestCheckVacantPost.InstituteID = userSubmitData.InstituteID;
      this.requestCheckVacantPost.StaffTypeID = userSubmitData.StaffTypeID;
      this.requestCheckVacantPost.DesignationID = userSubmitData.PostID;


      this.ddlCheckVacantPost.OfficeID = userSubmitData.OfficeID;
      this.ddlCheckVacantPost.InstituteID = userSubmitData.InstituteID;
      this.ddlCheckVacantPost.StaffTypeID = userSubmitData.StaffTypeID;
      this.ddlCheckVacantPost.DesignationID = userSubmitData.PostID;
      

      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });

      //const txtJoiningDateControl = this.groupForm.get('txtJoiningDate');

      //if (!txtJoiningDateControl) {
      //  return;
      //}


      //if (this.searchRequest.RequestType == 1) {
      //  if (this.RequestUpdateStatus.StatusIDs === 247) {
      //    txtJoiningDateControl.setValidators(Validators.required);
      //  } else {
      //    txtJoiningDateControl.clearValidators();
      //  }

      //  txtJoiningDateControl.updateValueAndValidity();
      //}




    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }



  async GetRelieving_joining_CheckVacantPostModel() {
    try {
      debugger
      this.requestCheckVacantPost.Action = "joining_CheckVacantPost";
      
      await this.ITIGovtEMStaffMasterService.Relieving_joining_CheckVacantPostModel(this.requestCheckVacantPost).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.PostMessage = "Are you sure you want to update request ?";
          this.PostCheckValue = 1;
        }
        else if (data.State === EnumStatus.Warning) {
          this.PostMessage = data.Message;
          this.PostCheckValue = 3;
        }
        else {
          this.PostMessage = data.Message;
          this.PostCheckValue = 0;
        }
      })
    } catch (error) {
      console.error
    }
  }


  async updateReqStatusVRS() {
    debugger
    this.isSubmitted = true;
    if (this.groupFormVRS.invalid) {
      return console.log("error")
    }
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      this.RequestUpdateStatus.CreatedBy = this.sSOLoginDataModel.UserID;
      this.RequestUpdateStatus.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.RequestUpdateStatus.ServiceRequestId = this.RowlistData.ServiceRequestId;
      this.RequestUpdateStatus.RequestType = this.RowlistData.RequestTypeID;
      this.RequestUpdateStatus.UserID = this.RowlistData.UserID;

      if (this.searchRequest.RequestType == 1) {
        await this.userRequestService.UserRequestUpdateStatus(this.RequestUpdateStatus)
          .then(async (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == EnumStatus.Success) {
              this.toastr.success(this.Message)
              this.CloseModal();
              this.getlist();
              this.RequestUpdateStatus = new RequestUpdateStatus();
              //this.RequestUpdateStatus = new BTERRequestUpdateStatus();
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.Message)
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })

      } 





    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  DownloadFile(FileName: string): void {
    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;;
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = FileName; // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }

  async RelievingLetter(UserID: number) {
    try {
      this.searchRequestRelieving.UserID = UserID;
      this.loaderService.requestStarted();

      const blob: any = await this.ITIGovtEMStaffMasterService
        .DownloadRelievingLetter_pdf(this.searchRequestRelieving);

      const now = new Date();
      const timestamp =
        now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + '_' +
        String(now.getHours()).padStart(2, '0') + '-' +
        String(now.getMinutes()).padStart(2, '0') + '-' +
        String(now.getSeconds()).padStart(2, '0');

      const fileName = `ITI_Relieving_Letter_${timestamp}.pdf`;

      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create anchor and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

    } catch (error: any) {
      console.error(error);
     
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }





  async JoiningLetter(UserID: number) {
    try {
      this.searchRequestRelieving.UserID = UserID;
      this.loaderService.requestStarted();

      const blob: any = await this.ITIGovtEMStaffMasterService
        .DownloadJoiningLetter_pdf(this.searchRequestRelieving);

      const now = new Date();
      const timestamp =
        now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + '_' +
        String(now.getHours()).padStart(2, '0') + '-' +
        String(now.getMinutes()).padStart(2, '0') + '-' +
        String(now.getSeconds()).padStart(2, '0');

      const fileName = `ITI_Joining_Letter_${timestamp}.pdf`;

      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create anchor and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

    } catch (error: any) {
      console.error(error);
     
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

    // ✅ Download PDF



  //async JoiningLetter(UserID: number) {
  //  try {
  //    this.searchRequestJoining.UserID = UserID;
  //    this.loaderService.requestStarted();

  //    await this.ITIGovtEMStaffMasterService.DownloadJoiningLetter_pdf(this.searchRequestJoining)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        if(data.State == EnumStatus.Success){
  //          this.DownloadFile(data.Data);
  //        }
          
  //      }, (error: any) => {
  //        console.error(error);
  //        this.toastr.error(this.ErrorMessage)
  //      });

  //  } catch (Ex) {
  //    console.log(Ex);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

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
    this.paginatedInTableData = [...this.UserRequestList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.totalInTableRecord = this.UserRequestList.length;
  }

  async GetRoleListDDL() {
    try {
      const request: any = {};
      request.InstituteID = this.sSOLoginDataModel.InstituteID;
      request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      request.RoleID = this.sSOLoginDataModel.RoleID;
      request.UserID = this.sSOLoginDataModel.UserID;
      request.Action = 'RoleListDDL'
      await this.ITIGovtEMStaffMasterService.ITI_EM_DropdownGetData(request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.RoleListDDL = data.Data;
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
        if (this.file.type === 'application/pdf' || this.file.type === 'image/jpeg' || this.file.type === 'image/png') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
        }
        else {// type validation
          this.toastr.error('error this file ?')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();
        await this.commonMasterService.UploadPublicInfoDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State == EnumStatus.Success) {
              if (Type == "OnHoldDoc") {                
                this.RequestUpdateStatus.Dis_OnHoldDoc = data['Data'][0]["Dis_FileName"];
                this.RequestUpdateStatus.OnHoldDoc = data['Data'][0]["FileName"];
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
  }


  exportToExcel(): void {

    const exportData = this.UserRequestList.map((row: any, index: number) => ({
      'S No': index + 1,
      'Request Type': row.RequestType || '',
      'User': row.UserName || '',
      'Level': row.LevelName || '',
      'Transfer Office': row.OfficeName || '',
      'Transfer Post': row.PostName || '',
      'Relieving Institute': row.RelievingInstitute || '',
      'Transfer Institute': row.InstituteName || '',
      'Staff Type': row.StaffType || '',
      'Order No': row.OrderNo || '',
      'Order Date': row.OrderDate || '',
      'Relieving Date': row.RelievingDate || row.RequestDate || '',
      'Joining Date': row.JoiningDate || '',
      'Request Date': row.RequestDate || '',
      'Staff Request Status': row.RequestStatus || '',
      'Request Remarks': row.RequestRemarks || ''
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    ws['!cols'] = [
      { wch: 8 },
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 25 },
      { wch: 25 },
      { wch: 35 },
      { wch: 35 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 40 }
    ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transfer Requests');

    XLSX.writeFile(wb, 'TransferRequests.xlsx');
  }

  exportToPDF(): void {

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    doc.setFontSize(10); // smaller heading
    doc.setFont('helvetica', 'bold');
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'DDO Relieving & Joining Request List',
      pageWidth / 2,
      10,
      { align: 'center' }
    );

    const body = this.UserRequestList.map((row: any, index: number) => [

      index + 1,
      row.RequestType || '',
      row.UserName || '',
      row.LevelName || '',
      row.OfficeName || '',
      row.PostName || '',
      row.RelievingInstitute || '',
      row.InstituteName || '',
      row.StaffType || '',
      row.OrderNo || '',
      row.OrderDate || '',
      row.RelievingDate || row.RequestDate || '',
      row.JoiningDate || '',
      row.RequestDate || '',
      row.RequestStatus || '',
      row.RequestRemarks || ''

    ]);

    autoTable(doc, {
      startY: 12,
      head: [[
        'S No',
        'Request Type',
        'User',
        'Level',
        'Transfer Office',
        'Transfer Post',
        'Relieving Institute',
        'Transfer Institute',
        'Staff Type',
        'Order No',
        'Order Date',
        'Relieving Date',
        'Joining Date',
        'Request Date',
        'Staff Request Status',
        'Remarks'
      ]],

      body,

      theme: 'grid',

      styles: {
        fontSize: 6,
        cellPadding: 1.5,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        overflow: 'linebreak'
      },

      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },

      columnStyles: {
        6: { cellWidth: 30 },   // Relieving Institute
        7: { cellWidth: 30 },   // Transfer Institute
        15: { cellWidth: 35 }   // Remarks
      },

      margin: { top: 10 }
    });

    doc.save('TransferRequests.pdf');
  }


  async Getjoining_VacantPostEmployee() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.joining_VacantPostEmployee(this.ddlCheckVacantPost)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.VacantPostEmployeeList = data['Data'];
          console.log(this.VacantPostEmployeeList, "VacantPostEmployeeList")
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

  async onSubmitRelieved_Revert(model: any, userSubmitData: any) {
    try {
      debugger
      this.RowlistData = { ...userSubmitData };
      console.log(this.RequestUpdateStatus, "modal");
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  async updateRelieved_Revert() {
    try {
      debugger
      this.RevertModel.ActionBy = this.sSOLoginDataModel.UserID;
      this.RevertModel.ServiceRequestId = this.RowlistData.ServiceRequestId;
      if (!this.RevertModel.Remarks || this.RevertModel.Remarks.trim() === '') {
        this.toastr.warning('Please Enter Remark!');
        return;
      }

      this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno;
      await this.childComponent.OpenOTPPopup();
      await this.childComponent.waitForVerification();

      await this.userRequestService.Iti_Update_Relieved_Revert(this.RevertModel)
        .then(async (data: any) => {
          debugger
          if (data.State == EnumStatus.Success) {
            this.toastr.success('Staff relieved status has been reverted successfully.')
            this.CloseModal();
            this.RevertModel = new Iti_Update_Relieved_RevertModel();
          }
          else 
          {
            this.toastr.warning('Failed to revert the staff relieved status. Please try again.')
          }
          
        })
    }
    catch (ex) { console.log(ex) }
  }

}
function saveAs(blob: any, arg1: string) {
  throw new Error('Function not implemented.');
}



