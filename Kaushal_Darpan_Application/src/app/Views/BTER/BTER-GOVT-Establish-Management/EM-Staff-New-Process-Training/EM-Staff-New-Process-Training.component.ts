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
import * as XLSX from 'xlsx';

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
    modalReference: NgbModalRef | undefined;
    public StaffTrainingHTS_GetDataList: any = [];
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
          this.StaffTrainingStatusList = this.StaffTrainingStatusList.filter((item: any) =>  item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.PrincipalApprove)
          this.StaffTrainingStatusSearchList = this.StaffTrainingStatusSearchList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.Applied  || item.ID == EnumStaffTrainingStatus.PrincipalApprove)

          this.StaffTrainingDetailsNewTraining_Search(EnumStaffTrainingStatus.Applied);
        }
        else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_GAZETTED_STAFF || this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_NON_GAZETTED_STAFF) {
          this.SearchStatus = EnumStaffTrainingStatus.PrincipalApprove;
          this.StaffTrainingStatusList = this.StaffTrainingStatusList.filter((item: any) =>  item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.ADTE)
          this.StaffTrainingStatusSearchList =
            this.StaffTrainingStatusSearchList
              .filter((item: any) =>
                item.ID == EnumStaffTrainingStatus.Reject ||
                item.ID == EnumStaffTrainingStatus.PrincipalApprove ||
                item.ID == EnumStaffTrainingStatus.ADTE
              )
              .map((item: any) => {
                if (item.ID == EnumStaffTrainingStatus.PrincipalApprove) {
                  return {
                    ...item,
                    Name: 'Under Review'
                  };
                }
                return item;
              });
          //this.StaffTrainingStatusSearchList = this.StaffTrainingStatusSearchList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.PrincipalApprove ||  item.ID == EnumStaffTrainingStatus.ADTE)

          this.StaffTrainingDetailsNewTraining_Search(EnumStaffTrainingStatus.PrincipalApprove);
        }
        else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE) {
          debugger
          this.SearchStatus = EnumStaffTrainingStatus.ADTE;
          this.StaffTrainingStatusList = this.StaffTrainingStatusList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.JDTE )
          this.StaffTrainingStatusSearchList =
            this.StaffTrainingStatusSearchList
              .filter((item: any) =>
                item.ID == EnumStaffTrainingStatus.Reject ||
                item.ID == EnumStaffTrainingStatus.JDTE ||
                item.ID == EnumStaffTrainingStatus.ADTE
              )
              .map((item: any) => {

                if (item.ID == EnumStaffTrainingStatus.ADTE) {
                  return {
                    ...item,
                    Name: 'Under Review'
                  };
                }

                return item;
              });
          //this.StaffTrainingStatusSearchList = this.StaffTrainingStatusSearchList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.JDTE || item.ID == EnumStaffTrainingStatus.ADTE)
          this.StaffTrainingDetailsNewTraining_Search(EnumStaffTrainingStatus.ADTE);
        }
        else if (this.sSOLoginDataModel.RoleID == EnumRole.DTE) {
          this.SearchStatus = EnumStaffTrainingStatus.JDTE;
          this.StaffTrainingStatusList = this.StaffTrainingStatusList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.DTE )
          this.StaffTrainingStatusSearchList =
            this.StaffTrainingStatusSearchList
              .filter((item: any) =>
                item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.JDTE || item.ID == EnumStaffTrainingStatus.DTE
              )
              .map((item: any) => {

                if (
                  item.ID == EnumStaffTrainingStatus.JDTE
                ) {
                  return {
                    ...item,
                    Name: 'Under Review'
                  };
                }

                return item;
              });
          //this.StaffTrainingStatusSearchList = this.StaffTrainingStatusSearchList.filter((item: any) => item.ID == EnumStaffTrainingStatus.Reject || item.ID == EnumStaffTrainingStatus.JDTE ||  item.ID == EnumStaffTrainingStatus.DTE)
          this.StaffTrainingDetailsNewTraining_Search(EnumStaffTrainingStatus.JDTE);
        }else{
          this.StaffTrainingStatusList = [];
          this.SearchStatus = EnumStaffTrainingStatus.Applied;
          this.StaffTrainingDetailsNewTraining_Search(EnumStaffTrainingStatus.Applied);
        }
        
      }, (error: any) => console.error(error));


    
    
    }

    async StaffTrainingDetailsNewTraining_Search(statusID: number) {
    
      this.statusID = statusID;
      await this.StaffTrainingDetailsNewTraining_GetData();
      await this.onChangeSearchStatus();
    }
    async StaffTrainingDetailsNewTraining_GetData() {
      debugger;

      try {
        this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID;
        this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
        this.searchRequest.Action = "GetAllDataNewTraining";
        this.searchRequest.StatusID = this.statusID;

        const response: any = await this.staffServiceDetailsService
          .StaffTrainingDetails_GetData(this.searchRequest);

        const data = JSON.parse(JSON.stringify(response));

        if (data.State === EnumStatus.Success) {
          this.StaffTrainingDetailsNewTrainingDataList = data.Data || [];
        } else {
          this.StaffTrainingDetailsNewTrainingDataList = [];
        }

        debugger;

        // Apply Role Based Filter
        if (this.StaffTrainingDetailsNewTrainingDataList.length > 0) {

          if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_GAZETTED_STAFF) {
            debugger
            this.StaffTrainingDetailsNewTrainingDataList =
              this.StaffTrainingDetailsNewTrainingDataList.filter(
                (item: any) => item.ISNonGazetted == 1
              );

          } else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_NON_GAZETTED_STAFF) {
            debugger
            this.StaffTrainingDetailsNewTrainingDataList =
              this.StaffTrainingDetailsNewTrainingDataList.filter(
                (item: any) => item.ISNonGazetted == 2
              );

          } else if (
            this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE ||
            this.sSOLoginDataModel.RoleID == EnumRole.EM_Secretary_BTER
          ) {

            this.StaffTrainingDetailsNewTrainingDataList =
              this.StaffTrainingDetailsNewTrainingDataList.filter(
                (item: any) =>
                  item.ISNonGazetted == 1 || item.ISNonGazetted == 2
              );
          }
        }

      } catch (error) {
        console.error(error);
        this.StaffTrainingDetailsNewTrainingDataList = [];
      }
    }
    
    //async StaffTrainingDetailsNewTraining_GetData() {
    //  debugger
    //  try {
    //    this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
    //    this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
    //    this.searchRequest.Action = "GetAllDataNewTraining";
    //    this.searchRequest.StatusID = this.statusID;
    //    await this.staffServiceDetailsService.StaffTrainingDetails_GetData(this.searchRequest).then(async (data: any) => {
    //      data = JSON.parse(JSON.stringify(data));
    //      if (data.State === EnumStatus.Success) {
    //        this.StaffTrainingDetailsNewTrainingDataList = data.Data;
    //        if (this.statusID == 0) {
    //          this.StaffTrainingDetailsNewTrainingDataList = data.Data;
    //        }
    //      }
    //      else {
    //        this.StaffTrainingDetailsNewTrainingDataList = [];
    //      }
    //      debugger
    //      if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_GAZETTED_STAFF) {
    //        if (this.StaffTrainingDetailsNewTrainingDataList?.length > 0) {
    //          this.StaffTrainingDetailsNewTrainingDataList = this.StaffTrainingDetailsNewTrainingDataList.filter((item: any) => item.ISNonGazetted == 1)
    //        }

    //      }
    //      else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_NON_GAZETTED_STAFF) {
    //        if (this.StaffTrainingDetailsNewTrainingDataList?.length > 0) {
    //          this.StaffTrainingDetailsNewTrainingDataList = this.StaffTrainingDetailsNewTrainingDataList.filter((item: any) => item.ISNonGazetted == 2)
    //        }
    //      }
    //      else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE || this.sSOLoginDataModel.RoleID == EnumRole.EM_Secretary_BTER) {
    //        if (this.StaffTrainingDetailsNewTrainingDataList?.length > 0) {
    //          this.StaffTrainingDetailsNewTrainingDataList = this.StaffTrainingDetailsNewTrainingDataList.filter((item: any) => item.ISNonGazetted == 1 || item.ISNonGazetted == 2)
    //        }
    //      }
    //      //else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_Secretary_BTER) {
    //      //  if (this.StaffTrainingDetailsNewTrainingDataList?.length > 0) {
    //      //    this.StaffTrainingDetailsNewTrainingDataList = this.StaffTrainingDetailsNewTrainingDataList.filter((item: any) => item.ISNonGazetted == 2)
    //      //  }
    //      //}
    //      else {
    //        this.StaffTrainingDetailsNewTrainingDataList = this.StaffTrainingDetailsNewTrainingDataList;
    //      }


    //    })
    //  } catch (error) {
    //    console.error(error);
    //  }
    //}

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
        this.updateSearch.RoleID = this.sSOLoginDataModel.RoleID;
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
      else if (((this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE || this.sSOLoginDataModel.RoleID == EnumRole.EM_Secretary_BTER) && EnumStaffTrainingStatus.ADTE == this.SearchStatus)) {
        this.ShowCheckBoxId = 1;
      }
      else if (((this.sSOLoginDataModel.RoleID == EnumRole.DTE) && EnumStaffTrainingStatus.JDTE == this.SearchStatus)) {
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

    exportToExcelNew(): void {

      if (this.StaffTrainingDetailsNewTrainingDataList.length == 0) {
        alert('No records available for Excel export.');
        return;
      }

      const unwantedColumns = [
        'StaffTrainingDetailID',
        'StaffID',
        'UserID',
        'StaffTypeID',
        'StatusID',
        'ISNonGazetted',
        'RoleID',
        'StaffUserID'
      ];

      const filteredData = this.StaffTrainingDetailsNewTrainingDataList.map(
        (item: any, index: number) => {

          const filteredItem: any = {};

          // Add Serial Number
          filteredItem["Sr. No"] = index + 1;

          Object.keys(item).forEach(key => {
            if (!unwantedColumns.includes(key)) {
              filteredItem[key] = item[key];
            }
          });

          return filteredItem;
        });

      const ws: XLSX.WorkSheet =
        XLSX.utils.json_to_sheet(filteredData);

      const wb: XLSX.WorkBook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, 'Report');

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.-]/g, '_');

      XLSX.writeFile(
        wb,
        `StaffDetailsNewTraining_${timestamp}.xlsx`
      );
    }
}
