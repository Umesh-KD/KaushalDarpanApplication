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
    selector: 'app-EM-Staff-New-Process-Training',
    standalone: false,
    templateUrl: './EM-Staff-New-Process-Training.component.html',
    styleUrl: './EM-Staff-New-Process-Training.component.css'
  })

  export class EMStaffNewProcessTrainingComponent {
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

  isSubmitted: boolean = false;
  Table_SearchText: string = '';
  public file!: File;
    public Uploadfile: string = '';
    selectedRows: any[] = [];
    isSingleSelection = false;
    public Status: string = '';
    public SearchStatus: number = 0;
    public Remark: string = '';
    public statusID: number = 0;
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

        if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID==EnumRole.PrincipalNon) {
          this.StaffTrainingStatusList = this.StaffTrainingStatusList.filter((item: any) =>  item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.PrincipalApprove)
          this.StaffTrainingStatusSearchList = this.StaffTrainingStatusSearchList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.Applied  || item.ID == EnumStaffTrainingStatus.PrincipalApprove)

          this.StaffTrainingDetailsNewTraining_Search(EnumStaffTrainingStatus.Applied);
        }
        else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_GAZETTED_STAFF || this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_NON_GAZETTED_STAFF) {
          this.StaffTrainingStatusList = this.StaffTrainingStatusList.filter((item: any) =>  item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.ADTE)
          this.StaffTrainingStatusSearchList = this.StaffTrainingStatusSearchList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.PrincipalApprove ||  item.ID == EnumStaffTrainingStatus.ADTE)

          this.StaffTrainingDetailsNewTraining_Search(EnumStaffTrainingStatus.PrincipalApprove);
        }
        else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE) {
          debugger
          this.StaffTrainingStatusList = this.StaffTrainingStatusList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.JDTE || item.ID == EnumStaffTrainingStatus.ADTE)
          this.StaffTrainingStatusSearchList = this.StaffTrainingStatusSearchList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.ADTE  || item.ID == EnumStaffTrainingStatus.JDTE)
          this.StaffTrainingDetailsNewTraining_Search(EnumStaffTrainingStatus.ADTE);
        }
        else if (this.sSOLoginDataModel.RoleID == EnumRole.DTE) {
          this.StaffTrainingStatusList = this.StaffTrainingStatusList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.DTE || item.ID == EnumStaffTrainingStatus.JDTE)
          this.StaffTrainingStatusSearchList = this.StaffTrainingStatusSearchList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.JDTE ||  item.ID == EnumStaffTrainingStatus.DTE)
          this.StaffTrainingDetailsNewTraining_Search(EnumStaffTrainingStatus.JDTE);
        }else{
          this.StaffTrainingStatusList = [];
          this.StaffTrainingDetailsNewTraining_Search(EnumStaffTrainingStatus.Applied);
        }
        
      }, (error: any) => console.error(error));


    
    
    }

    async StaffTrainingDetailsNewTraining_Search(statusID: number) {
      
      this.statusID = statusID;
      await this.StaffTrainingDetailsNewTraining_GetData();
    }

    
    async StaffTrainingDetailsNewTraining_GetData() {
      
      try {
        this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
        this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
        this.searchRequest.Action = "GetAllDataNewTraining";
        this.searchRequest.StatusID = this.statusID;
        await this.staffServiceDetailsService.StaffTrainingDetails_GetData(this.searchRequest).then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.StaffTrainingDetailsNewTrainingDataList = data.Data;
            if (this.statusID == 0) {
              this.StaffTrainingDetailsNewTrainingDataList = data.Data;
            }
          } else {
            this.StaffTrainingDetailsNewTrainingDataList = [];
          }
        })
      } catch (error) {
        console.error(error);
      }
    }

    checkboxthView_checkboxchange(isChecked: boolean) {
      
      this.AllSelect = isChecked;
      for (let item of this.StaffTrainingDetailsNewTrainingDataList) {
        item.Selected = isChecked;  // Set all checkboxes based on the parent checkbox state
      }

    }

    async TrainingStatusUpdate() {
      try {
        ;
        const selectedRows = this.StaffTrainingDetailsNewTrainingDataList
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

              this.StaffTrainingDetailsNewTrainingDataList =
                this.StaffTrainingDetailsNewTrainingDataList.map((item: any) => ({
                  ...item,
                  Selected: false
                }));
              await this.StaffTrainingDetailsNewTraining_GetData();
            } else {
              this.toastr.error(data.ErrorMessage);
            }
          });

      } catch (error) {
        console.error(error);
      }
    }


    
    

}
