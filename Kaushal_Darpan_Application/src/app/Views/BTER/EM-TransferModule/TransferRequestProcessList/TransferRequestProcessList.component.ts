import { Component, ViewChild } from '@angular/core';
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
import { ViewStaffProfileModalComponent } from '../../BTER-GOVT-Establish-Management/view-staff-profile-modal/view-staff-profile-modal.component';



  @Component({
    selector: 'app-TransferRequestProcessList',
    standalone: false,
    templateUrl: './TransferRequestProcessList.component.html',
    styleUrl: './TransferRequestProcessList.component.css'
  })

  export class TransferRequestProcessListComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
    public updateSearch = new TransferSystemUpdateDataModel();
    public updateExtSearch = new EM_TransferSystemSearchModel();
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
    public GazettedList: any[] = [
      { ID: 1, Name: 'Gazetted' },
      { ID: 2, Name: 'Non-Gazetted' }
    ];
    public GetTransfercateList: any = [];
    public ItiCollegesListAll: any = [];
    public SearchCategoryID: number = 0;
    public SearchInstituteID: number = 0;
    public SearchEmployeeType: number = 0;

    public SupportingDoc: string = '';
    public Dis_SupportingDoc: string = '';
    public TransferSystemStatusUpdateList: any = [];
    public updateStatus: number = 0;
    public isAnyApproved: boolean = false;
    public _EnumRole = EnumRole;
    isJDTECheck: boolean = false;
    EnumTransferSystemStatus = EnumTransferSystemStatus;
    isDisable: boolean = false;
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


    await this.commonFunctionService.InstituteMaster(1, 1, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.ItiCollegesListAll = data.Data;
      this.ItiCollegesListAll = this.ItiCollegesListAll.filter((item: any) => item.InstitutionManagementTypeID == 1);

    })

    await this.commonFunctionService.GetCommonMasterDDLByType('TransferRequest').then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.GetTransfercateList = data['Data'];
      console.log(this.GetTransfercateList, "GetTransfercateList");
    });
    

    await this.commonFunctionService.GetCommonMasterDDLByAction1('TransferSystemStatus')
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TransferSystemStatusList = data['Data'];
        this.TransferSystemStatusSearchList = data['Data'];
        this.TransferSystemStatusUpdateList = data['Data'];

        this.TransferSystemStatusUpdateList = this.TransferSystemStatusUpdateList.filter((item: any) => item.ID == EnumTransferSystemStatus.Rejected);

         if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_GAZETTED_STAFF || this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_NON_GAZETTED_STAFF) {
           //this.TransferSystemStatusSearchList = this.TransferSystemStatusSearchList.filter((item: any) => item.ID == EnumTransferSystemStatus.Submitted || item.ID == EnumTransferSystemStatus.UnderADTEReview || item.ID == EnumTransferSystemStatus.Rejected);

           if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_GAZETTED_STAFF) {
             this.SearchEmployeeType=1
             this.isDisable = true;
           }

           if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_NON_GAZETTED_STAFF) {
             this.SearchEmployeeType = 2
             this.isDisable = true;
           }


           this.TransferSystemStatusSearchList = this.TransferSystemStatusSearchList
             .filter((item: any) =>
               item.ID == EnumTransferSystemStatus.Submitted ||
               item.ID == EnumTransferSystemStatus.UnderADTEReview ||
               item.ID == EnumTransferSystemStatus.Rejected
             )
             .map((item: any) => {
               if (item.ID == EnumTransferSystemStatus.Submitted) {
                 item.Name = 'Under ADTE Review';
               }

               if (item.ID == EnumTransferSystemStatus.UnderADTEReview) {
                 item.Name = 'ADTE Reviewed';
               }

               return item;
             });

           this.TransferSystemStatusList = this.TransferSystemStatusList.filter((item: any) => item.ID == EnumTransferSystemStatus.UnderADTEReview || item.ID == EnumTransferSystemStatus.Rejected);
           this.SearchStatus = EnumTransferSystemStatus.Submitted;
           this.ShowCheckBoxId = 1;
           this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.Submitted);
        }
         else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE || this.sSOLoginDataModel.RoleID == EnumRole.EM_Secretary_BTER) {

           if (this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE) {
             this.SearchEmployeeType = 1
             this.isDisable = true;
           }

           if (this.sSOLoginDataModel.RoleID == EnumRole.EM_Secretary_BTER) {
             this.SearchEmployeeType = 2
             this.isDisable = true;
           }


           //this.TransferSystemStatusSearchList = this.TransferSystemStatusSearchList.filter((item: any) => item.ID == EnumTransferSystemStatus.Rejected
           //|| item.ID == EnumTransferSystemStatus.UnderADTEReview || item.ID == EnumTransferSystemStatus.UnderJDTEReview);

           this.TransferSystemStatusSearchList = this.TransferSystemStatusSearchList
             .filter((item: any) =>
               item.ID == EnumTransferSystemStatus.UnderADTEReview ||
               item.ID == EnumTransferSystemStatus.UnderJDTEReview ||
               item.ID == EnumTransferSystemStatus.Rejected
             )
             .map((item: any) => {
               if (item.ID == EnumTransferSystemStatus.UnderADTEReview) {
                 item.Name = 'Under JDTE Review';
               }

               if (item.ID == EnumTransferSystemStatus.UnderJDTEReview) {
                 item.Name = 'JDTE Reviewed';
               }

               return item;
             });


           this.TransferSystemStatusList = this.TransferSystemStatusList.filter((item: any) => item.ID == EnumTransferSystemStatus.Rejected || item.ID == EnumTransferSystemStatus.UnderJDTEReview);
           this.SearchStatus = EnumTransferSystemStatus.UnderADTEReview;
           this.ShowCheckBoxId = 1;
           this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.UnderADTEReview);
        }
         else if (this.sSOLoginDataModel.RoleID == EnumRole.DTE) {

           this.isDisable = false;
          //this.TransferSystemStatusSearchList = this.TransferSystemStatusSearchList.filter((item: any) => item.ID ==
           //EnumTransferSystemStatus.Rejected || item.ID == EnumTransferSystemStatus.UnderJDTEReview || item.ID == EnumTransferSystemStatus.UnderDTEReview);

           this.TransferSystemStatusSearchList = this.TransferSystemStatusSearchList
             .filter((item: any) =>
               item.ID == EnumTransferSystemStatus.UnderJDTEReview ||
               item.ID == EnumTransferSystemStatus.UnderDTEReview ||
               item.ID == EnumTransferSystemStatus.Rejected
             )
             .map((item: any) => {
               if (item.ID == EnumTransferSystemStatus.UnderJDTEReview) {
                 item.Name = 'Under DTE Review';
               }

               if (item.ID == EnumTransferSystemStatus.UnderDTEReview) {
                 item.Name = 'DTE Reviewed';
               }

               return item;
             });

           this.TransferSystemStatusList = this.TransferSystemStatusList.filter((item: any) => item.ID == EnumTransferSystemStatus.Rejected  || item.ID == EnumTransferSystemStatus.UnderDTEReview )
           
           this.SearchStatus = EnumTransferSystemStatus.UnderJDTEReview;
           this.ShowCheckBoxId = 1;
           this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.UnderJDTEReview);
         } else {
           this.isDisable = false;
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
      debugger
      try {
        this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
        this.searchRequest.Action = "EM_TransferProcessListmain";
        this.searchRequest.StatusID = this.SearchStatus;
        this.searchRequest.CategoryID = this.SearchCategoryID;
        this.searchRequest.EmployeeType = this.SearchEmployeeType;
        this.searchRequest.InstituteID = this.SearchInstituteID;
        this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
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
              this.EM_TransferProcessList = this.EM_TransferProcessList.filter((item: any) => item.ISNonGazetted == 1);
              this.isAnyApproved = true;
            }

          }
          else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_NON_GAZETTED_STAFF) {
            if (this.EM_TransferProcessList?.length > 0) {
              this.EM_TransferProcessList = this.EM_TransferProcessList.filter((item: any) => item.ISNonGazetted == 2);
              this.isAnyApproved = true;
            }
          }
          else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE || this.sSOLoginDataModel.RoleID == EnumRole.EM_Secretary_BTER) {
            if (this.EM_TransferProcessList?.length > 0) {
              this.EM_TransferProcessList = this.EM_TransferProcessList.filter((item: any) => item.ISNonGazetted == 1 || item.ISNonGazetted == 2);
              //this.MainListApproveStatus();
            }
          }
          //else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_Secretary_BTER) {
          //  if (this.EM_TransferProcessList?.length > 0) {
          //    this.EM_TransferProcessList = this.EM_TransferProcessList.filter((item: any) => item.ISNonGazetted == 2);
          //    //this.MainListApproveStatus();

          //  }
          //}
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
              /*this.checkApproveStatus();*/
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


    async TransferSystemEXTStatusUpdate() {
      debugger
      try {

        if (!this.updateStatus || this.updateStatus == 0) {
          this.toastr.warning("Please select status");
          return;
        }
        if (!this.SupportingDoc==null || this.SupportingDoc == "") {
          this.toastr.warning("Please Upload Supporting Documents");
          return;
        }
        const selectedRows = this.EM_TransferSystemEXTList
          .filter((item: any) => item.Selected === true);

        if (selectedRows.length === 0) {
          this.toastr.warning("Please select one record");
          return;
        }

        //if (selectedRows.length > 1) {
        //  this.toastr.warning("Please select only one record");
        //  return;
        //}

        
        const jsonData = selectedRows.map((item: any) => ({
          TransferSystemID: item.TransferSystemID,
          ID: item.ID,
          Status: this.EnumTransferSystemStatus.Rejected,
          Remark: this.Remark,
          CreatedBy: this.sSOLoginDataModel.UserID,
          SupportingDoc: this.SupportingDoc,
          Dis_SupportingDoc: this.Dis_SupportingDoc,

        }));
        this.updateExtSearch.jsonData = JSON.stringify(jsonData);


        await this.staffServiceDetailsService
          .TransferSystemEXTStatusUpdate(this.updateExtSearch)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State === EnumStatus.Success) {
              this.toastr.success(data.Message);
              this.updateSearch.jsonData = "";
              this.Status = "0";
              this.Remark = "";
              this.CloseModal();

              this.EM_TransferProcessList =
                this.EM_TransferProcessList.map((item: any) => ({
                  ...item,
                  Selected: false
                }));
             
            } else {
              this.toastr.error(data.ErrorMessage);
            }
          });

      } catch (error) {
        console.error(error);
      }
    }


    async onFilechange(event: any, Name: any) {
      debugger
      try {
        this.file = event.target.files[0];
        if (this.file) {
          // Type validation
          if (this.file.type === 'application/pdf' || this.file.type === 'image/jpeg' || this.file.type === 'image/png') {
            // Size validation
            if (this.file.size > 2000000) {
              this.toastr.error('Select less than 2MB File');
              return;
            }
          }
          else {
            this.toastr.error('Select valid file type jpg/jpeg/png/pdf');
            this.Uploadfile = '';
            event.target.value = null;
            return;
          }

          //upload model
          let uploadModel = new UploadFileModel();
          uploadModel.FileExtention = this.file.type ?? "";
          uploadModel.MinFileSize = "";
          uploadModel.MaxFileSize = "2000000";
          uploadModel.FolderName = "BTER_Establishment/TransferRequestDocument";

          //Upload to server folder
          await this.commonFunctionService.UploadDocument(this.file, uploadModel)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data.State === EnumStatus.Success) {
                if (Name == 'SupportingDocuments') {
                  this.SupportingDoc = data['Data'][0]["FileName"];
                  this.Dis_SupportingDoc = data['Data'][0]["Dis_FileName"];
                } else {
                  this.toastr.warning("no action provided")
                }
              }

              if (data.State === EnumStatus.Error) {
                this.toastr.error(data.ErrorMessage);

              } else if (data.State === EnumStatus.Warning) {
                this.toastr.warning(data.ErrorMessage);
              }
            });
        }
      } catch (Ex) {
        console.log(Ex);
      } finally {
        this.loaderService.requestEnded();
      }
    }

 

    checkboxthViewUpdate(isChecked: boolean) {

      this.AllSelect = isChecked;
      for (let item of this.EM_TransferSystemEXTList) {
        item.Selected = isChecked;  // Set all checkboxes based on the parent checkbox state
      }

    }

    //checkApproveStatus() {
    //  debugger
    //  this.isAnyApproved = this.EM_TransferSystemEXTList?.some(
    //    (item: any) => item.FinalApproveStatus == EnumTransferSystemStatus.Rejected
    //  );
    //}

    //MainListApproveStatus() {
    //  this.isJDTECheck = this.EM_TransferProcessList?.some(
    //    (item: any) => item.FinalApproveStatus === 5
    //  );


    //}


    async StructuredSummaryList() {
      window.open('/StructuredSummaryList', '_blank');
    }

    async TabutarTransferList() {
      window.open('/TabularTransferList', '_blank');
    }


    isLastEligibleRow(index: number): boolean {

      const validRows = this.EM_TransferSystemEXTList
        .map((row, i) => ({ row, i }))
        .filter(x => x.row.FinalApproveStatus != 6);

      if (validRows.length === 0) return false;

      const lastIndex = validRows[validRows.length - 1].i;

      return index === lastIndex;
    }

    async OpenStaffProfileViewModal(StaffID: number, UserID: number) {
      debugger
      this.childComponentViewStaffProfile.StaffID = StaffID;
      this.childComponentViewStaffProfile.UserID = UserID;
      await this.childComponentViewStaffProfile.OpenStaffProfileViewModal();
    }
}
