import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumStatus, GlobalConstants, EnumStaffTrainingStatus, EnumRole, EnumTransferSystemStatus } from '../../../../Common/GlobalConstants';
import { EM_TransferSystemSearchModel, TransferSystemGeneratorDataModel, TransferSystemUpdateDataModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { BTEREMStaffServiceDetailsService } from '../../../../Services/BTER/BTER_EM_StaffServiceDetails/bter-em-staff-service-details.service';
import { DropdownValidators1 } from '../../../../Services/CustomValidators/custom-validators.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

  @Component({
    selector: 'app-TabutarTransferList',
    standalone: false,
    templateUrl: './TabutarTransferList.component.html',
    styleUrl: './TabutarTransferList.component.css'
  })

  export class TabutarTransferListComponent {
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
    public requestUp = new TransferSystemGeneratorDataModel();
    public UpdateTransferRequest!: FormGroup;
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

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.Status = "0";

    await this.commonFunctionService.InstituteMaster(1, 1, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.ItiCollegesListAll = data.Data;
    })

    await this.commonFunctionService.GetCommonMasterDDLByType('TransferRequest').then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.GetTransfercateList = data['Data'];
      console.log(this.GetTransfercateList, "GetTransfercateList");
    });
    

    await this.commonFunctionService.GetCommonMasterDDLByAction1('TransferSystemStatus')
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        this.TransferSystemStatusSearchList = data['Data'];
          if (this.sSOLoginDataModel.RoleID == EnumRole.DTE) {
            this.TransferSystemStatusSearchList = this.TransferSystemStatusSearchList.filter((item: any) => item.ID == EnumTransferSystemStatus.Appnoved || item.ID == EnumTransferSystemStatus.UnderDTEReview);
            this.SearchStatus = EnumTransferSystemStatus.UnderDTEReview;
            this.onChangeSearchStatus();
            this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.UnderDTEReview);
        }
         else{
          this.TransferSystemStatusList = [];
            this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.UnderDTEReview);
        }
      }, (error: any) => console.error(error));
    }


    get _UpdateTransferRequestForm() {
      return this.UpdateTransferRequest.controls;
    }
    async EM_TransferSystem_GetData_Search(statusID: number) {
      
      this.statusID = statusID;
      await this.EM_TransferSystem_GetData();
    }
    async EM_TransferSystem_GetData() {
      debugger
      try {
        this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
        this.searchRequest.Action = "TabutarTransferList";
        this.searchRequest.StatusID = this.SearchStatus;
        this.searchRequest.CategoryID = this.SearchCategoryID;
        this.searchRequest.EmployeeType = this.SearchEmployeeType;
        this.searchRequest.InstituteID = this.SearchInstituteID;
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
                  this.requestUp.OrderSupportingDocument = data['Data'][0]["FileName"];
                  this.requestUp.OrderSupportingDocument_Dis = data['Data'][0]["Dis_FileName"];
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

  

    async TransferSystemGeneratorUpdate() {
      debugger
      try {
        if (!this.requestUp.DispatchNo || this.requestUp.DispatchNo == "") {
          this.toastr.warning("Please enter DispatchNo");
          return;
        }

        if (!this.requestUp.OrderDate || this.requestUp.OrderDate == "") {
          this.toastr.warning("Please enter Date");
          return;
        }
        if (!this.requestUp.OrderSupportingDocument || this.requestUp.OrderSupportingDocument == "") {
          this.toastr.warning("Please Upload Doc");
          return;
        }

        const selectedRows = this.EM_TransferProcessList
          .filter((item: any) => item.Selected === true);

        if (selectedRows.length === 0) {
          this.toastr.warning("Please select at least one record");
          return;
        }
        const jsonData = selectedRows.map((item: any) => ({
          TransferSystemID: item.TransferSystemID,
          Status: EnumTransferSystemStatus.Appnoved,
          DispatchNo: this.requestUp.DispatchNo,
          OrderSupportingDocument: this.requestUp.OrderSupportingDocument,
          OrderSupportingDocument_Dis: this.requestUp.OrderSupportingDocument_Dis,
          OrderDate: this.requestUp.OrderDate,
          CreatedBy: this.sSOLoginDataModel.UserID
        }));
        this.updateSearch.jsonData = JSON.stringify(jsonData);


        await this.staffServiceDetailsService
          .TransferSystemGeneratorUpdate(this.updateSearch)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State === EnumStatus.Success) {
              this.toastr.success(data.Message);
              this.updateSearch.jsonData = "";
              this.EM_TransferProcessList =
                this.EM_TransferProcessList.map((item: any) => ({
                  ...item,
                  Selected: false
                }));
              this.requestUp = new  TransferSystemGeneratorDataModel();
              await this.EM_TransferSystem_GetData();
            } else {
              this.toastr.error(data.ErrorMessage);
            }
          });

      } catch (error) {
        console.error(error);
      }
    }

    async onChangeSearchStatus() {

      if (this.sSOLoginDataModel.RoleID == EnumRole.DTE && EnumTransferSystemStatus.UnderDTEReview == this.SearchStatus) {
        this.ShowCheckBoxId = 1;
      }

      else {
        this.ShowCheckBoxId = 0;
      }
    }

 
}
