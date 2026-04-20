import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../../Common/appsetting.service';
import { EnumEMProfileStatus, EnumRole, EnumStatus, EnumTransferStatus } from '../../../../../Common/GlobalConstants';
import { RequestSearchModel } from '../../../../../Models/ITI/UserRequestModel';
import { JoiningLetterSearchModel, RelievingLetterSearchModel, RequestUpdateStatus } from '../../../../../Models/ITIGovtEMStaffMasterDataModel';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { ITIGovtEMStaffMaster } from '../../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { UserRequestService } from '../../../../../Services/UserRequest/user-request.service';

@Component({
  selector: 'app-user-request-list-transfer',
  standalone: false,
  templateUrl: './user-request-list-transfer.component.html',
  styleUrl: './user-request-list-transfer.component.css'
})
export class UserRequestListTransferComponent {
  groupForm!: FormGroup;
  public searchRequest = new RequestSearchModel();
  public searchRequestJoining = new JoiningLetterSearchModel();
  public searchRequestRelieving = new RelievingLetterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public RequestUpdateStatus = new RequestUpdateStatus();

  public UserRequestList: any[] = [];
  public filteredStatusList: any[] = [];
  public StaffTypeList: any[] = []
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  public OfficeList: any = [];
  public LevelList: any = [];
  public ExamOfLevelList: any = [];
  public ExamTypeList: any = [];
  public UserRequestHistoryList: any[] = [];
  public PostList: any = [];

  public DepartmentID: number = 0;
  public isSubmitted: boolean = false;
  public _EnumRole = EnumRole
  public type: string=''
  public RowlistData = new RequestUpdateStatus;
  public _EnumEMProfileStatus = EnumEMProfileStatus; 
  _EnumTransferStatus = EnumTransferStatus;
  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;
  closeResult: string | undefined;

  constructor(
    private commonMasterService: CommonFunctionService, 
    private ITIGovtEMStaffMasterService: ITIGovtEMStaffMaster,
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private modalService: NgbModal, 
    private userRequestService: UserRequestService, 
    private fb: FormBuilder, 
    public appsettingConfig: AppsettingService
  ) { }

  async ngOnInit() {

    this.groupForm = this.fb.group({
      txtRemark: ['', Validators.required],
      txtJoiningDate: ['', Validators.required],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetStatusList();
    await this.GetLevelList();
    await this.GetStaffTypeData();
    await this.GetPostList();
    
    await this.UserRequest_GetData();
  }
  get _groupForm() { return this.groupForm.controls; }

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
  async GetPostList() {
    try {
      await this.commonMasterService.GetCommonMasterData('PostMaster', -1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PostList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetLevelList() {
    try {
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
    this.isSubmitted = false;
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.searchRequest.RequestType = 0;
    this.searchRequest.LevelID = 0;
    this.searchRequest.PostID = 0;
    this.searchRequest.OfficeID = 0;
    this.searchRequest.StaffTypeID = 0;
    this.searchRequest.OrderNo = "";
    await this.UserRequest_GetData();
  }

  async UserRequest_GetData() {
    try {
      this.searchRequest.PageNumber =0
      this.searchRequest.PageSize = 0
      this.searchRequest.Action = "LIST";
      this.searchRequest.UserId = this.sSOLoginDataModel.UserID;
      this.loaderService.requestStarted();
      await this.userRequestService.UserRequest_GetData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserRequestList = data.Data;

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

  async JoiningLetter(UserID: number) {
    debugger
    try {
      this.searchRequestJoining.UserID = UserID;
      this.loaderService.requestStarted();

      await this.ITIGovtEMStaffMasterService.JoiningLetter(this.searchRequestJoining)
        .then((data: any) => {
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
            link.download = 'JoiningLetter.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(data.ErrorMessage)
          }
        }, (error: any) => {
          console.error(error);
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  
  async RelievingLetter(UserID: number) {
    debugger
    try {
      this.searchRequestRelieving.UserID = UserID;
      this.loaderService.requestStarted();

      await this.ITIGovtEMStaffMasterService.RelievingLetter(this.searchRequestRelieving)
        .then((data: any) => {
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
            link.download = 'RelievingLetter.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(data.ErrorMessage)
          }
        }, (error: any) => {
          console.error(error);
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async onUserRequestHistorylist(model: any, ServiceRequestId: number) {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.ServiceRequestId = ServiceRequestId;
      await this.userRequestService.UserRequestHistoryList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserRequestHistoryList = data.Data;

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

  CloseModalRequestHistorylist() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.isSubmitted = false;
  }

  async onSubmitStaffRequest(model: any, userSubmitData: any) {
    try {
      this.RowlistData = { ...userSubmitData };
      console.log(this.RequestUpdateStatus, "modal");
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async updateReqStatus() {
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }

    try {
      this.RequestUpdateStatus.CreatedBy = this.sSOLoginDataModel.UserID;
      this.RequestUpdateStatus.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.RequestUpdateStatus.ServiceRequestId = this.RowlistData.ServiceRequestId;
      this.RequestUpdateStatus.RequestType = this.RowlistData.RequestTypeID;
      this.RequestUpdateStatus.UserID = this.RowlistData.UserID;
      this.RequestUpdateStatus.StatusIDs = EnumTransferStatus.Request_for_Join;

      await this.userRequestService.UserRequestUpdateStatus(this.RequestUpdateStatus)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.CloseModal();
            await this.UserRequest_GetData();
            this.RequestUpdateStatus = new RequestUpdateStatus();
          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(data.Message)
          }
          else {
            this.toastr.error(data.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
  }
}
