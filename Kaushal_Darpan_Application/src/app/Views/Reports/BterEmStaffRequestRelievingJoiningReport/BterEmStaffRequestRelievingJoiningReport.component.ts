import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel, ITIGovtEMStaffMasterDataModel, ITI_Govt_EM_ZonalOFFICERSSearchDataModel, ITI_Govt_EM_ZonalOFFICERSDataModel, UpdateSSOIDByPricipleModel, ITI_Govt_EM_OFFICERSSearchDataModel, ITI_Govt_EM_OFFICERSDataModel, ITI_Govt_EM_PersonalDetailByUserIDSearchModel, RequestUpdateStatus, RelievingLetterSearchModel, JoiningLetterSearchModel, BTERRequestUpdateStatus, Bter_Govt_EM_SanctionedPostBasedInstituteSearchDataModel, BterStaffUserRequestReportSearchModel } from '../../../Models/ITIGovtEMStaffMasterDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ITIGovtEMStaffMaster } from '../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff, EnumProfileStatus, EnumEMProfileStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ItiSeatIntakeService } from '../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITICollegeTradeSearchModel } from '../../../Models/ITI/SeatIntakeDataModel';
import { RequestSearchModel, BterRequestSearchModel } from '../../../Models/ITI/UserRequestModel';
import { UserRequestService } from '../../../Services/UserRequest/user-request.service';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
  selector: 'app-BterEmStaffRequestRelievingJoiningReport',
  standalone: false,
  
  templateUrl: './BterEmStaffRequestRelievingJoiningReport.component.html',
  styleUrl: './BterEmStaffRequestRelievingJoiningReport.component.css'
})
export class BterEmStaffRequestRelievingJoiningReportComponent implements OnInit {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel();
  public isSubmitted: boolean = false;
  groupForm!: FormGroup;
  public searchRequest = new BterStaffUserRequestReportSearchModel();
  public searchRequestUpdateSSOIDByPricipleModel = new UpdateSSOIDByPricipleModel();
  staffDetailsFormData = new ITIGovtEMStaffMasterDataModel();
  public searchRequestITi = new ITICollegeTradeSearchModel();
  public isLoading: boolean = false;

  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RoleMasterList: any[] = [];
  public UserRequestList: any[] = [];
  public filteredStatusList: any[] = [];
  public DesignationMasterList: any[] = [];
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
  public PostList: any = [];
  public ExamTypeList: any = [];
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
  public RequestUpdateStatus = new BTERRequestUpdateStatus();
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



  constructor(private commonMasterService: CommonFunctionService, private ITIGovtEMStaffMasterService: ITIGovtEMStaffMaster,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
    private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2,
    private ITICollegeTradeService: ItiSeatIntakeService,
    private userRequestService: UserRequestService, private fb: FormBuilder, public appsettingConfig: AppsettingService


  ) {

  }



  async ngOnInit() {
    this.groupForm = this.fb.group({
      ddlStatus: [0, [DropdownValidators]],
      txtRemark: ['', Validators.required],
      txtLastworkingDate: [''],
      txtJoiningDate: [''],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;    

    this.QueryReqFormGroup = this.formBuilder.group({
      txtSSOID: ['',[Validators.required]]
    });

    this.GetStatusList();
    this.searchRequest.RequestType = 1;
    this.formData.LevelOfExamID = 0;
    this.formData.ExamTypeID = 0;
    this.GetLevelList();
    this.GetPostList();
    this.GetStaffTypeData();
    
    this.GetOfficeList();
    this.getlist();
    }

  async getlist() {
    debugger
    try {
      this.searchRequest.PageNumber =0
      this.searchRequest.PageSize = 0
      this.searchRequest.userID = this.sSOLoginDataModel.UserID;
      this.searchRequest.departmentID = this.sSOLoginDataModel.DepartmentID;
      if (this.searchRequest.RequestType == 1)
      {
        this.searchRequest.action = "StaffRelievingReport";
      }
      if (this.searchRequest.RequestType == 2) {
        this.searchRequest.action = "StaffJoiningReport";
      }
     
      this.loaderService.requestStarted();
      await this.userRequestService.BterGovtEM_Govt_EstablishUserRequestReportRelievingAndJoing(this.searchRequest)
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

    //if (this.searchRequest.RequestType == 1) {

    //  if (this.RequestUpdateStatus.StatusIDs == 247) {
    //    this.groupForm.controls['txtLastworkingDate'].setValidators([Validators.required]);
    //    //lastWorkingDateControl.setValidators(Validators.required);
    //  } else {
    //    this.groupForm.controls['txtLastworkingDate'].clearValidators();
    //  }

    //  this.groupForm.controls['txtLastworkingDate'].updateValueAndValidity();

    //}

    //if (this.searchRequest.RequestType == 2) {

    //  if (this.RequestUpdateStatus.StatusIDs == 247) {
    //    this.groupForm.controls['txtJoiningDate'].setValidators([Validators.required]);
    //    //lastWorkingDateControl.setValidators(Validators.required);
    //  } else {
    //    this.groupForm.controls['txtJoiningDate'].clearValidators();
    //  }

    //  this.groupForm.controls['txtJoiningDate'].updateValueAndValidity();

    //}

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

  async GetPostList() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignationAndPostMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PostList = data['Data'];
          /*this.PostList = this.PostList.filter((itme: any) => itme.IsPostTypeID == 1)*/
          console.log(this.PostList, "PostList")
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

  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.RequestUpdateStatus.StatusIDs = 0;
    this.RequestUpdateStatus.Remark = '';
    this.isSubmitted = false;
  }

 

  

  async ResetControl() {
    this.isSubmitted = false;
   
    this.UserRequestList = [];

    //await this.getlist();
  }

  CloseModalRequestHistorylist() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.isSubmitted = false;
  }
  async onSubmitJoiningRequest(model: any, userSubmitData: any) {
    
    try {
      this.RowlistData = { ...userSubmitData };
      console.log(this.RequestUpdateStatus, "modal");
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


  async RelievingLetter(UserID: number) {
    debugger
    try {
      this.searchRequestRelieving.UserID = UserID;
      this.loaderService.requestStarted();

      await this.userRequestService.BterEmRelievingLetter(this.searchRequestRelieving)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
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
            link.download = 'RelievingLetterBTER.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async JoiningLetter(UserID: number) {
    debugger
    try {
      this.searchRequestJoining.UserID = UserID;
      this.loaderService.requestStarted();

      await this.userRequestService.BterEmJoiningLetter(this.searchRequestJoining)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
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
            link.download = 'JoiningLetterBTER.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
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

   }






