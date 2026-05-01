import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumStatus, GlobalConstants, EnumStaffTrainingStatus, EnumRole, EnumTransferSystemStatus } from '../../../../Common/GlobalConstants';
import { EM_TransferSystemSearchModel, TransferSystemUpdateDataModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { BTEREMStaffServiceDetailsService } from '../../../../Services/BTER/BTER_EM_StaffServiceDetails/bter-em-staff-service-details.service';
import { DropdownValidators1 } from '../../../../Services/CustomValidators/custom-validators.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


  @Component({
    selector: 'app-TransferRequestProcessList',
    standalone: false,
    templateUrl: './TransferRequestProcessList.component.html',
    styleUrl: './TransferRequestProcessList.component.css'
  })

  export class TransferRequestProcessListComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
    public updateSearch = new TransferSystemUpdateDataModel();
    public request = new EM_TransferSystemSearchModel();
    public searchRequest = new EM_TransferSystemSearchModel();

  public AddTrainingDetailsFromGroup!: FormGroup;

  public EM_TrainingCourseTypeList: any = [];
   
    public EM_TransferProcessList: any = [];
    public AllSelect: boolean = false;
    public ExaminersList: any[] = [];
    public TransferSystemStatusList: any[] = [];
    public EM_TransferSystemEXTList: any[] = [];
    public EM_TransferSystemHSTList: any[] = [];
    public TransferSystemStatusSearchList: any[] = [];

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

    
    

    await this.commonFunctionService.GetCommonMasterDDLByAction1('TransferSystemStatus')
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TransferSystemStatusList = data['Data'];
        this.TransferSystemStatusSearchList = data['Data'];
        

         if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_GAZETTED_STAFF || this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_NON_GAZETTED_STAFF) {
           this.TransferSystemStatusSearchList = this.TransferSystemStatusSearchList.filter((item: any) => item.ID == EnumTransferSystemStatus.Submitted || item.ID == EnumTransferSystemStatus.UnderADTEReview || item.ID == EnumTransferSystemStatus.Rejected);
           this.TransferSystemStatusList = this.TransferSystemStatusList.filter((item: any) => item.ID == EnumTransferSystemStatus.UnderADTEReview || item.ID == EnumTransferSystemStatus.Rejected);
           this.SearchStatus = EnumTransferSystemStatus.Submitted;
           this.ShowCheckBoxId = 1;
           this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.Submitted);
        }
         else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE || this.sSOLoginDataModel.RoleID == EnumRole.EM_Secretary_BTER) {
           
           this.TransferSystemStatusSearchList = this.TransferSystemStatusSearchList.filter((item: any) => item.ID == EnumTransferSystemStatus.Rejected || item.ID == EnumTransferSystemStatus.UnderADTEReview || item.ID == EnumTransferSystemStatus.UnderJDTEReview);
           this.TransferSystemStatusList = this.TransferSystemStatusList.filter((item: any) => item.ID == EnumTransferSystemStatus.Rejected || item.ID == EnumTransferSystemStatus.UnderJDTEReview);
           this.SearchStatus = EnumTransferSystemStatus.UnderADTEReview;
           this.ShowCheckBoxId = 1;
           this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.UnderADTEReview);
        }
         else if (this.sSOLoginDataModel.RoleID == EnumRole.DTE) {
           this.TransferSystemStatusSearchList = this.TransferSystemStatusSearchList.filter((item: any) => item.ID == EnumTransferSystemStatus.Rejected || item.ID == EnumTransferSystemStatus.UnderJDTEReview || item.ID == EnumTransferSystemStatus.UnderDTEReview);
           this.TransferSystemStatusList = this.TransferSystemStatusList.filter((item: any) => item.ID == EnumTransferSystemStatus.Rejected  || item.ID == EnumTransferSystemStatus.UnderDTEReview )
           
           this.SearchStatus = EnumTransferSystemStatus.UnderJDTEReview;
           this.ShowCheckBoxId = 1;
           this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.UnderJDTEReview);
        }else{
          this.TransferSystemStatusList = [];
           this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.Submitted);
        }
        
      }, (error: any) => console.error(error));


    
    
    }

    async EM_TransferSystem_GetData_Search(statusID: number) {
      
      this.statusID = statusID;
      await this.EM_TransferSystem_GetData();
    }

    
    async EM_TransferSystem_GetData() {
      
      try {
        this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
        this.searchRequest.Action = "EM_TransferProcessListmain";
        this.searchRequest.StatusID = this.SearchStatus;
        await this.staffServiceDetailsService.GetEM_TransferSystemData(this.searchRequest).then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.EM_TransferProcessList = data.Data;
            if (this.statusID == 0) {
              this.EM_TransferProcessList = data.Data;
            }
          } else {
            this.EM_TransferProcessList = [];
          }
          
          if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_GAZETTED_STAFF) {
            if (this.EM_TransferProcessList?.length > 0) {
              this.EM_TransferProcessList = this.EM_TransferProcessList.filter((item: any) => item.ISNonGazetted == 1)
            }

          }
          else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_NON_GAZETTED_STAFF) {
            if (this.EM_TransferProcessList?.length > 0) {
              this.EM_TransferProcessList = this.EM_TransferProcessList.filter((item: any) => item.ISNonGazetted == 2)
            }
          }
          else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE) {
            if (this.EM_TransferProcessList?.length > 0) {
              this.EM_TransferProcessList = this.EM_TransferProcessList.filter((item: any) => item.ISNonGazetted == 1)
            }
          }
          else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_Secretary_BTER) {
            if (this.EM_TransferProcessList?.length > 0) {
              this.EM_TransferProcessList = this.EM_TransferProcessList.filter((item: any) => item.ISNonGazetted == 2)
            }
          }
          else if (this.sSOLoginDataModel.RoleID == EnumRole.DTE) {
            if (this.EM_TransferProcessList?.length > 0) {
              this.EM_TransferProcessList = this.EM_TransferProcessList;
            }
          }

          else {
            this.EM_TransferProcessList = [];
          }


        })
      } catch (error) {
        console.error(error);
      }
    }

    checkboxthView_checkboxchange(isChecked: boolean) {
      
      this.AllSelect = isChecked;
      for (let item of this.EM_TransferProcessList) {
        item.Selected = isChecked;  // Set all checkboxes based on the parent checkbox state
      }

    }

    async TransferSystemStatusUpdate() {
      try {
        ;
        const selectedRows = this.EM_TransferProcessList
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
          TransferSystemID: item.TransferSystemID,
          Status: this.Status,   
          Remark: this.Remark,
          CreatedBy: this.sSOLoginDataModel.UserID      
        }));
        this.updateSearch.jsonData = JSON.stringify(jsonData);
       
       
        await this.staffServiceDetailsService
          .EM_TransferSystemUpdateStatus(this.updateSearch)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State === EnumStatus.Success) {
              this.toastr.success(data.Message);
              this.updateSearch.jsonData = "";
              this.Status = "0";
              this.Remark = "";

              this.EM_TransferProcessList =
                this.EM_TransferProcessList.map((item: any) => ({
                  ...item,
                  Selected: false
                }));
              await this.EM_TransferSystem_GetData();
            } else {
              this.toastr.error(data.ErrorMessage);
            }
          });

      } catch (error) {
        console.error(error);
      }
    }


    async EM_TransferSystemHST_GetData(model: any, TransferSystemID: number) {
      try {
        this.loaderService.requestStarted();
        try {
          this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
          this.searchRequest.Action = "EM_TransferSystemHST";

          this.searchRequest.TransferSystemID = TransferSystemID;
          await this.staffServiceDetailsService.GetEM_TransferSystemData(this.searchRequest).then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {
              this.EM_TransferSystemHSTList = data.Data;
              if (this.statusID == 0) {
                this.EM_TransferSystemHSTList = data.Data;
              }
            } else {
              this.EM_TransferSystemHSTList = [];
            }
          })
        } catch (error) {
          console.error(error);
        }
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
    CloseModal() {
      this.modalService.dismissAll();
      this.modalReference?.close();
    }

    async onTransferSystemEXT(model: any, TransferSystemID: number) {
      try {
        this.loaderService.requestStarted();
        try {
          this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
          this.searchRequest.Action = "EM_TransferSystemEXT";
          this.searchRequest.StatusID = this.statusID;
          this.searchRequest.TransferSystemID = TransferSystemID;
          await this.staffServiceDetailsService.GetEM_TransferSystemData(this.searchRequest).then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {
              this.EM_TransferSystemEXTList = data.Data;
              if (this.statusID == 0) {
                this.EM_TransferProcessList = data.Data;
              }
            } else {
              this.EM_TransferSystemEXTList = [];
            }
          })
        } catch (error) {
          console.error(error);
        }
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
      debugger
      if (((this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_GAZETTED_STAFF || this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_NON_GAZETTED_STAFF) && EnumTransferSystemStatus.Submitted == this.SearchStatus)) {
        this.ShowCheckBoxId = 1;
      } 
      else if (((this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE || this.sSOLoginDataModel.RoleID == EnumRole.EM_Secretary_BTER) && EnumTransferSystemStatus.UnderADTEReview == this.SearchStatus)) {
        this.ShowCheckBoxId = 1;
      }
      else if (((this.sSOLoginDataModel.RoleID == EnumRole.DTE) && EnumTransferSystemStatus.UnderJDTEReview == this.SearchStatus)) {
        this.ShowCheckBoxId = 1;
      } 

      else {
        this.ShowCheckBoxId = 0;
      }
    }

}
