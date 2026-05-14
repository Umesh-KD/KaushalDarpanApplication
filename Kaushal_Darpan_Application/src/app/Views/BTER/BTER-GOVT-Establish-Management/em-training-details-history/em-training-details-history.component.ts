import { Component, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumStatus, GlobalConstants, EnumStaffTrainingStatus, EnumRole } from '../../../../Common/GlobalConstants';
import { StaffTrainingDetailDataModel, StaffTrainingDetailSearchData, StaffTrainingStatusUpdateDataModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { BTEREMStaffServiceDetailsService } from '../../../../Services/BTER/BTER_EM_StaffServiceDetails/bter-em-staff-service-details.service';
import { DropdownValidators1 } from '../../../../Services/CustomValidators/custom-validators.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ViewStaffProfileModalComponent } from '../view-staff-profile-modal/view-staff-profile-modal.component';
  @Component({
    selector: 'app-em-training-details-history',
    standalone: false,
    templateUrl: './em-training-details-history.component.html',
    styleUrl: './em-training-details-history.component.css'
  })

export class emtrainingdetailshistoryComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
    public updateSearch = new StaffTrainingStatusUpdateDataModel();
  public request = new StaffTrainingDetailDataModel();
  public searchRequest = new StaffTrainingDetailSearchData();

  public AddTrainingDetailsFromGroup!: FormGroup;

  public EM_TrainingCourseTypeList: any = [];
    public StaffTrainingDetailsCompletedTrainingDataList: any = [];
    public StaffTrainingDetailsNewTrainingDataList: any = [];
    public AllSelect: boolean = false;
    public ExaminersList: any[] = [];
    public StaffTrainingStatusList: any[] = [];
    public StaffTrainingStatusSearchList: any[] = [];
    public SearchStatus: number = 0;
    public statusID: number = 0;

  isSubmitted: boolean = false;
  Table_SearchText: string = '';
  public file!: File;
    public Uploadfile: string = '';
    selectedRows: any[] = [];
    isSingleSelection = false;
    public Status: string = '';
    public Remark: string = '';
    public StaffTrainingHTS_GetDataList: any = [];
    modalReference: NgbModalRef | undefined;
    public ShowCheckBoxId: number = 0;
    @ViewChild('Modal_StaffDetailsViewModal') childComponentViewStaffProfile!: ViewStaffProfileModalComponent;
  constructor(
    private toastr: ToastrService,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private bterEstablishManagementService: BTEREstablishManagementService,
    private staffServiceDetailsService: BTEREMStaffServiceDetailsService,
    private appsettingConfig: AppsettingService,
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {
    debugger
    this.AddTrainingDetailsFromGroup = this.formBuilder.group({
      OrganizinglnstituteName: ['', [Validators.required]],
      CourseType: ['', [DropdownValidators1]],
      CourseName: ['', [Validators.required]],
      DurationUnit: ['', [DropdownValidators1]],
      Duration: ['', [Validators.required]],
      StartDate: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
      ModeOfTraining: ['', [DropdownValidators1]],
      Venue: ['', [Validators.required]],
      TrainingDoc: ['', [Validators.required]],
      IsCompletedTraining: [false],
      IsNewTraining: [false],
      ComplitionTrainingDoc: ['']
      
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.Status = "0";
    

    debugger
    await this.commonFunctionService.GetCommonMasterDDLByType('StaffTrainingStatus')
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTrainingStatusList = data['Data'];
        this.StaffTrainingStatusSearchList = data['Data'];

        if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
          this.SearchStatus = EnumStaffTrainingStatus.Applied;
          this.StaffTrainingDetailsCompleted_Search(this.SearchStatus);
          this.StaffTrainingStatusList = this.StaffTrainingStatusList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject  || item.ID == EnumStaffTrainingStatus.PrincipalApprove);
          this.StaffTrainingStatusSearchList = this.StaffTrainingStatusSearchList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.Applied || item.ID == EnumStaffTrainingStatus.PrincipalApprove);
        }
        else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_GAZETTED_STAFF || this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_NON_GAZETTED_STAFF) {
          this.SearchStatus = EnumStaffTrainingStatus.Applied;
          this.StaffTrainingDetailsCompleted_Search(this.SearchStatus);
          this.StaffTrainingStatusList = this.StaffTrainingStatusList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject  || item.ID == EnumStaffTrainingStatus.ADTE);
          this.StaffTrainingStatusSearchList = this.StaffTrainingStatusSearchList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.ADTE || item.ID == EnumStaffTrainingStatus.PrincipalApprove);
        }
        else {
          this.SearchStatus = EnumStaffTrainingStatus.Applied;
          this.StaffTrainingStatusList = this.StaffTrainingStatusList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Applied);
          this.StaffTrainingStatusSearchList = this.StaffTrainingStatusSearchList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Applied);
        }
        
      }, (error: any) => console.error(error));

    
    

    }

   

    async StaffTrainingDetailsCompletedTraining_GetData() {
    debugger
    try {
      this.searchRequest.StaffID=this.sSOLoginDataModel.StaffID
      this.searchRequest.UserID=this.sSOLoginDataModel.UserID
      this.searchRequest.Action = "GetAllDataCompletedTraining";
      this.searchRequest.StatusID = this.SearchStatus;

      await this.staffServiceDetailsService.StaffTrainingDetails_GetData(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.StaffTrainingDetailsCompletedTrainingDataList = data.Data;
        }
        else {
          this.StaffTrainingDetailsNewTrainingDataList = [];
        }

        if (this.statusID != 0) {
          this.StaffTrainingDetailsCompletedTrainingDataList = this.StaffTrainingDetailsCompletedTrainingDataList.filter((item: any) => item.StatusID == this.statusID);
        } else {
          this.StaffTrainingDetailsCompletedTrainingDataList = data.Data;
        }

        if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_GAZETTED_STAFF) {
          if (this.StaffTrainingDetailsNewTrainingDataList?.length > 0) {
            this.StaffTrainingDetailsNewTrainingDataList = this.StaffTrainingDetailsNewTrainingDataList.filter((item: any) => item.ISNonGazetted == 1 && (item.RoleID == 7 || item.RoleID == 13) )
          }
        }
         if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_NON_GAZETTED_STAFF) {
           if (this.StaffTrainingDetailsNewTrainingDataList?.length > 0) {
            this.StaffTrainingDetailsNewTrainingDataList = this.StaffTrainingDetailsNewTrainingDataList.filter((item: any) => item.ISNonGazetted == 2 && (item.RoleID == 7 || item.RoleID == 13))
          }
        }



      })
    } catch (error) {
      console.error(error);
    }
    }
   

    checkboxthView_checkboxchange(isChecked: boolean) {
      debugger
      this.AllSelect = isChecked;
      for (let item of this.StaffTrainingDetailsCompletedTrainingDataList) {
        item.Selected = isChecked;  // Set all checkboxes based on the parent checkbox state
      }

    }

    async TrainingStatusUpdate() {
      try {
        debugger;
        const selectedRows = this.StaffTrainingDetailsCompletedTrainingDataList
          .filter((item: any) => item.Selected === true);

        if (selectedRows.length === 0) {
          this.toastr.warning("Please select at least one record");
          return;
        }

        if (!this.Status || this.Status == "0") {
          this.toastr.warning("Please select status");
          return;
        }

        if (!this.Remark || this.Remark.trim() === "") {
          this.toastr.warning("Please enter remark");
          return;
        }


        const jsonData = selectedRows.map((item: any) => ({
          StaffTrainingDetailID: item.StaffTrainingDetailID,
          TrainingStatus: this.Status,   
          Remark: this.Remark,
          CreatedBy: this.sSOLoginDataModel.UserID      
        }));
        this.updateSearch.jsonData = JSON.stringify(jsonData);
       
       
        await this.staffServiceDetailsService
          .StaffTrainingStatusUpdate(this.updateSearch)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State === EnumStatus.Success) {
              this.toastr.success(data.Message);
              this.updateSearch.jsonData = "";
              this.Status = "0";
              this.Remark = "";

              this.StaffTrainingDetailsCompletedTrainingDataList =
                this.StaffTrainingDetailsCompletedTrainingDataList.map((item: any) => ({
                  ...item,
                  Selected: false
                }));

  

              await this.StaffTrainingDetailsCompletedTraining_GetData();
            } else {
              this.toastr.error(data.ErrorMessage);
            }
          });

      } catch (error) {
        console.error(error);
      }
    }

    async StaffTrainingDetailsCompleted_Search(statusID: number) {

      this.statusID = statusID;
      await this.StaffTrainingDetailsCompletedTraining_GetData();
      await this.onChangeSearchStatus();
    }

    async StaffTrainingHTS_GetData(id: number) {
      try {
        debugger
        this.searchRequest.StaffTrainingDetailID = id;
        await this.staffServiceDetailsService.StaffTrainingHTS_GetData(this.searchRequest).then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.StaffTrainingHTS_GetDataList = data.Data;
          }
          else {
            this.StaffTrainingHTS_GetDataList = [];
          }
        })
      } catch (error) {
        console.error(error);
      }
    }

    CloseModal() {
      this.modalService.dismissAll();
      this.modalReference?.close();
    }

    async onEmtrainingStatusHistory(model: any, StaffTrainingDetailId: number) {
      debugger
      try {
        this.loaderService.requestStarted();
        this.StaffTrainingHTS_GetData(StaffTrainingDetailId)
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


    async onChangeSearchStatus() {
      if (((this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) && EnumStaffTrainingStatus.Applied == this.SearchStatus)) {
        this.ShowCheckBoxId = 1;
      }
      else if (((this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_GAZETTED_STAFF || this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_NON_GAZETTED_STAFF) && EnumStaffTrainingStatus.PrincipalApprove == this.SearchStatus)) {
        this.ShowCheckBoxId = 1;
      }
      else {
        this.ShowCheckBoxId = 0;
      }



    }

    async OpenStaffProfileViewModal(StaffID: number, UserID: number) {
      debugger
      this.childComponentViewStaffProfile.StaffID = StaffID;
      this.childComponentViewStaffProfile.UserID = UserID;
      await this.childComponentViewStaffProfile.OpenStaffProfileViewModal();
    }

}
