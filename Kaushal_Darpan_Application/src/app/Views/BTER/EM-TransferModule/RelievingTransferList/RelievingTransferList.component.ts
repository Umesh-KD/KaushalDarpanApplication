import { Component, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumStatus, GlobalConstants, EnumStaffTrainingStatus, EnumRole, EnumTransferSystemStatus, EnumTransferRelievingStatus } from '../../../../Common/GlobalConstants';
import { EM_TransferSystemSearchModel, TransferSystemUpdateDataModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { BTEREMStaffServiceDetailsService } from '../../../../Services/BTER/BTER_EM_StaffServiceDetails/bter-em-staff-service-details.service';
import { DropdownValidators1 } from '../../../../Services/CustomValidators/custom-validators.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ViewStaffProfileModalComponent } from '../../BTER-GOVT-Establish-Management/view-staff-profile-modal/view-staff-profile-modal.component';
import { firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
  @Component({
    selector: 'app-RelievingTransferList',
    standalone: false,
    templateUrl: './RelievingTransferList.component.html',
    styleUrl: './RelievingTransferList.component.css'
  })

  export class RelievingTransferListComponent {
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
    public isInstituteDisabled :boolean = false;

    public RelievingDoc: string = '';
    public RelievingDate: string = '';
    public RelievingDoc_Dis: string = '';
    public TransferSystemStatusUpdateList: any = [];
    public updateStatus: number = 0;
    public modelTsId: number = 0;
    public modelStaffId: number = 0;
    public isAnyApproved: boolean = false;
    public _EnumRole = EnumRole;
    isJDTECheck: boolean = false;
    EnumTransferSystemStatus = EnumTransferSystemStatus;
    public isShowDate: boolean = false;

    @ViewChild('Modal_StaffDetailsViewModal') childComponentViewStaffProfile!: ViewStaffProfileModalComponent;
    todayDate: string = new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .split('T')[0];

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

    if(this.sSOLoginDataModel.RoleID==this._EnumRole.PrincipalNon || this.sSOLoginDataModel.RoleID==this._EnumRole.Principal)
    {
      this.SearchInstituteID = this.sSOLoginDataModel.InstituteID
      this.isInstituteDisabled = true;
    }
    else{
      this.isInstituteDisabled=false;
    }

    await this.GetLoadData();
    this.updateStatus == EnumTransferRelievingStatus.Relieved;
    }

    async EM_TransferSystem_GetData_Search(statusID: number) {
      
      this.statusID = statusID;
      await this.EM_TransferSystem_GetData();

    }

    async GetLoadData() {
      try {
        this.loaderService.requestStarted();
          await this.commonFunctionService.InstituteMaster(1, 1, this.sSOLoginDataModel.EndTermID).then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.ItiCollegesListAll = data.Data;
          })

          await this.commonFunctionService.GetCommonMasterDDLByType('TransferRequest').then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.GetTransfercateList = data['Data'];
            console.log(this.GetTransfercateList, "GetTransfercateList");
          });
        
        await this.commonFunctionService.GetCommonMasterDDLByAction1('TransferRelievingStatus')
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.TransferSystemStatusList = data['Data'];
              this.TransferSystemStatusSearchList = data['Data'];
              this.TransferSystemStatusUpdateList = data['Data'];

              this.TransferSystemStatusUpdateList = this.TransferSystemStatusUpdateList.filter((item: any) => item.ID == EnumTransferRelievingStatus.Relieved || item.ID == EnumTransferRelievingStatus.Rejected);
             
              if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
                
                
                this.SearchStatus = EnumTransferRelievingStatus.RelievingPending;
               
                this.EM_TransferSystem_GetData_Search(EnumTransferRelievingStatus.RelievingPending);
              }
              else if (this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE || this.sSOLoginDataModel.RoleID == EnumRole.EM_Secretary_BTER) {
               this.SearchStatus = EnumTransferRelievingStatus.RelievingPending;
                this.EM_TransferSystem_GetData_Search(EnumTransferRelievingStatus.RelievingPending);
              }
              else if (this.sSOLoginDataModel.RoleID == EnumRole.DTE) {
                this.SearchStatus = EnumTransferRelievingStatus.RelievingPending;
                this.ShowCheckBoxId = 1;
                this.EM_TransferSystem_GetData_Search(EnumTransferRelievingStatus.RelievingPending);
              }else{
                this.TransferSystemStatusList = [];
                this.EM_TransferSystem_GetData_Search(EnumTransferRelievingStatus.RelievingPending);
              }
              
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
    
    async EM_TransferSystem_GetData() {
      debugger
      try {
        this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
        // this.searchRequest.Action = "EM_TransferProcessListmain";
        this.searchRequest.StatusID = this.SearchStatus;
        this.searchRequest.CategoryID = this.SearchCategoryID;
        this.searchRequest.EmployeeType = this.SearchEmployeeType;
        this.searchRequest.InstituteID = this.SearchInstituteID;
        await this.staffServiceDetailsService.GetEM_RelievingTransferData(this.searchRequest).then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.EM_TransferProcessList = data.Data;
            // if (this.statusID == 0) {
            //   this.EM_TransferProcessList = data.Data;
            // }
          } 
          else {
            this.EM_TransferProcessList = [];
          }
        })
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

      this.updateStatus = 0;
      this.Remark = "";
      this.RelievingDoc ="";
      this.RelievingDoc_Dis ="";
      this.modelStaffId = 0;
      this.modelTsId = 0;
    }

   
    


    async onRetievingAction(model: any, TransferSystemID: number, StaffID: number) {
      try {
        debugger

        this.modelTsId = TransferSystemID;
        this.modelStaffId = StaffID;
        this.loaderService.requestStarted();
        try {
          
          
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




    async TransferSystemRetievingUpdateStatus() {
      debugger
      try {

        if (!this.updateStatus || this.updateStatus == 0) {
          this.toastr.warning("Please select status");
          return;
        }
        if (!this.RelievingDoc == null || this.RelievingDoc == "") {
          this.toastr.warning("Please Upload Supporting Documents");
          return;
        }

        if (this.updateStatus == EnumTransferRelievingStatus.Rejected) {
          if (!this.Remark || this.Remark.trim() === '') {
            this.toastr.warning("Please enter a remark.");
            return;
          }
        }

        if (this.updateStatus != EnumTransferRelievingStatus.Rejected) {
          if (!this.RelievingDate || this.RelievingDate == '') {
            this.toastr.warning("Please enter a Relieving Date.");
            return;
          }

        }
      
        this.updateExtSearch.StatusID = this.updateStatus;
        this.updateExtSearch.Remark = this.Remark;
        this.updateExtSearch.RelievingDoc = this.RelievingDoc;
        this.updateExtSearch.RelievingDoc_Dis = this.RelievingDoc_Dis;
        this.updateExtSearch.StaffID = this.modelStaffId;
        this.updateExtSearch.TransferSystemID = this.modelTsId;
        this.updateExtSearch.RelievingDate = this.RelievingDate;
        


        await this.staffServiceDetailsService
          .TransferSystemRetievingUpdateStatus(this.updateExtSearch)
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


              this.GetLoadData();
             
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
                  this.RelievingDoc = data['Data'][0]["FileName"];
                  this.RelievingDoc_Dis = data['Data'][0]["Dis_FileName"];
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

    checkApproveStatus() {
      debugger
      this.isAnyApproved = this.EM_TransferSystemEXTList?.some(
        (item: any) => item.FinalApproveStatus == EnumTransferSystemStatus.Approved
      );
    }

    MainListApproveStatus() {
      this.isJDTECheck = this.EM_TransferProcessList?.some(
        (item: any) => item.FinalApproveStatus === 5
      );

     
    }

    async StructuredSummaryList() {
      window.open('/StructuredSummaryList', '_blank');
    }

    async TabutarTransferList() {
      window.open('/TabutarTransferList', '_blank');
    }

    

    async RelievingLetter(TransferSystemID: number) {
      try {
        debugger
        this.searchRequest.TransferSystemID = TransferSystemID;
        this.loaderService.requestStarted();

        const blob: any = await this.staffServiceDetailsService
          .DownloadRelievingLetterPDF(this.searchRequest);

        const now = new Date();
        const timestamp =
          now.getFullYear() + '-' +
          String(now.getMonth() + 1).padStart(2, '0') + '-' +
          String(now.getDate()).padStart(2, '0') + '_' +
          String(now.getHours()).padStart(2, '0') + '-' +
          String(now.getMinutes()).padStart(2, '0') + '-' +
          String(now.getSeconds()).padStart(2, '0');

        const fileName = `Relieving_Letter${timestamp}.pdf`;

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


    async OpenStaffProfileViewModal(StaffID: number, UserID: number) {
      debugger
      this.childComponentViewStaffProfile.StaffID = StaffID;
      this.childComponentViewStaffProfile.UserID = UserID;
      await this.childComponentViewStaffProfile.OpenStaffProfileViewModal();
    }
    async TransferSystemStatusChange() {
      if (this.updateStatus != EnumTransferRelievingStatus.Rejected) 
        {
          this.isShowDate = true;
        }
        else {
          this.isShowDate = false;
        }
      
      
    }


    exportToExcel(): void {

      if (this.EM_TransferProcessList.length == 0) {
        alert('No records available for Excel export.');
        return;
      }

      const unwantedColumns = [
        'TransferSystemID',
        'FinalApproveStatus',
        'ISNonGazetted',
        'StatusID',
        'StaffUserID',
        'StaffID'
      ];

      const filteredData = this.EM_TransferProcessList.map(
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
        `RelievingTransferList_${timestamp}.xlsx`
      );
    }
   
}
