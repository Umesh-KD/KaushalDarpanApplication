import { Component } from '@angular/core';
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
    this.SearchStatus = EnumStaffTrainingStatus.Applied;
    debugger
    await this.commonFunctionService.GetCommonMasterDDLByType('StaffTrainingStatus')
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTrainingStatusList = data['Data'];
        this.StaffTrainingStatusSearchList = data['Data'];

        if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
          this.StaffTrainingStatusList = this.StaffTrainingStatusList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject  || item.ID == EnumStaffTrainingStatus.PrincipalApprove);
          this.StaffTrainingStatusSearchList = this.StaffTrainingStatusSearchList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.Applied || item.ID == EnumStaffTrainingStatus.PrincipalApprove);
        }else {
          this.StaffTrainingStatusList = this.StaffTrainingStatusList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Applied);
          this.StaffTrainingStatusSearchList = this.StaffTrainingStatusSearchList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Applied);
        }
        
      }, (error: any) => console.error(error));

    this.StaffTrainingDetailsCompleted_Search(EnumStaffTrainingStatus.Applied);
    

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
    }
}
