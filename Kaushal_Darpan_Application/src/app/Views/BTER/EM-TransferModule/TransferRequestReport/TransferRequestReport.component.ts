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
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-TransferRequestReport',
  standalone: false,
  templateUrl: './TransferRequestReport.component.html',
  styleUrl: './TransferRequestReport.component.css'
})

export class TransferRequestReportComponent {
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
  isDisable: boolean = false;
  public ID: number = 0;
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
    this.sSOLoginDataModel = JSON.parse(
      String(localStorage.getItem('SSOLoginUser'))
    );

   
      this.ID = Number(
        this.activatedRoute.snapshot.queryParamMap.get('status')
      );

    this.Status = "0";

    try {

      const instituteData: any = await this.commonFunctionService.InstituteMaster(1,1,this.sSOLoginDataModel.EndTermID);

      this.ItiCollegesListAll = instituteData.Data;

   
      const transferCategoryData: any =
        await this.commonFunctionService.GetCommonMasterDDLByType('TransferRequest');

      this.GetTransfercateList = transferCategoryData.Data;
      console.log(this.GetTransfercateList, "GetTransfercateList");

      const statusData: any =
        await this.commonFunctionService.GetCommonMasterDDLByAction1(
          'TransferSystemStatus'
        );

      this.TransferSystemStatusSearchList = statusData.Data;

      if (
        this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_GAZETTED_STAFF ||
        this.sSOLoginDataModel.RoleID == EnumRole.EM_ADTE_NON_GAZETTED_STAFF
      ) {
        

        this.TransferSystemStatusSearchList =
          this.TransferSystemStatusSearchList
            .filter(
              (item: any) =>
                item.ID == EnumTransferSystemStatus.Submitted ||
                item.ID == EnumTransferSystemStatus.UnderADTEReview ||
                item.ID == EnumTransferSystemStatus.Rejected
            )
            .map((item: any) => {
              if (item.ID == EnumTransferSystemStatus.Submitted) {
                item.Name = 'Under Review';
              }

              if (item.ID == EnumTransferSystemStatus.UnderADTEReview) {
                item.Name = 'Reviewed';
              }

              return item;
            });

        if (this.ID > 0) {
          this.SearchStatus = this.ID;
          await this.EM_TransferSystem_GetData_Search(this.ID);
        } 
        
       
      }
      else if (
        this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE ||
        this.sSOLoginDataModel.RoleID == EnumRole.EM_Secretary_BTER
      ) {
        this.TransferSystemStatusSearchList =
          this.TransferSystemStatusSearchList
            .filter(
              (item: any) =>
                item.ID == EnumTransferSystemStatus.UnderADTEReview ||
                item.ID == EnumTransferSystemStatus.UnderJDTEReview ||
                item.ID == EnumTransferSystemStatus.Rejected
            )
            .map((item: any) => {
              if (item.ID == EnumTransferSystemStatus.UnderADTEReview) {
                item.Name = 'Under Review';
              }

              if (item.ID == EnumTransferSystemStatus.UnderJDTEReview) {
                item.Name = 'Reviewed';
              }

              return item;
            });

        if (this.ID > 0) {
          this.SearchStatus = this.ID;
          await this.EM_TransferSystem_GetData_Search(this.ID);
        }

      }
      else if (
        this.sSOLoginDataModel.RoleID == EnumRole.DTE
      ) {
        this.TransferSystemStatusSearchList =
          this.TransferSystemStatusSearchList
            .filter(
              (item: any) =>
                item.ID == EnumTransferSystemStatus.UnderJDTEReview ||
                item.ID == EnumTransferSystemStatus.UnderDTEReview ||
                item.ID == EnumTransferSystemStatus.Rejected
            )
            .map((item: any) => {
              if (item.ID == EnumTransferSystemStatus.UnderJDTEReview) {
                item.Name = 'Under Review';
              }

              if (item.ID == EnumTransferSystemStatus.UnderDTEReview) {
                item.Name = 'Reviewed';
              }

              return item;
            });

        if (this.ID > 0) {
          this.SearchStatus = this.ID;
          await this.EM_TransferSystem_GetData_Search(this.ID);
        }

       
      }
      else {
      
        await this.EM_TransferSystem_GetData_Search(
          EnumTransferSystemStatus.Submitted
        );
      }

    } catch (error) {
      console.error(error);
    }

   


  }

  async EM_TransferSystem_GetData_Search(statusID: number) {
    await this.EM_TransferRequest_GetData();
  }

  async EM_TransferRequest_GetData() {
    debugger
    try {
      this.EM_TransferProcessList = [];
      this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID;
      this.searchRequest.Action = "TransferRequestReport";
      this.searchRequest.StatusID = this.SearchStatus;
      this.searchRequest.CategoryID = this.SearchCategoryID;
      this.searchRequest.EmployeeType = this.SearchEmployeeType;
      this.searchRequest.InstituteID = this.SearchInstituteID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;

      const data: any =
        await this.staffServiceDetailsService.GetTransferRequestReport(
          this.searchRequest
        );

      if (data.State === EnumStatus.Success) {

        this.EM_TransferProcessList = data.Data || [];

        if (this.statusID == 0) {
          this.EM_TransferProcessList = data.Data;
        }

      } else {
        this.EM_TransferProcessList = [];
      }

    } catch (error) {
      console.error(error);
      this.EM_TransferProcessList = [];
    }
  }

  checkboxthView_checkboxchange(isChecked: boolean) {

    this.AllSelect = isChecked;

    this.EM_TransferProcessList.forEach((item: any) => {
      item.Selected = isChecked;
    });
  }

  exportToExcel(): void {

    const selectedRows = this.EM_TransferProcessList.filter(
      (item: any) => item.Selected === true
    );

    if (selectedRows.length === 0) {
      this.toastr.warning("Please select at least one record");
      return;
    }

    const unwantedColumns = [
      'ISNonGazetted',
      'StatusID',
      'TransferSystemID',
      'Selected',
      'SupportingDocumentsDis',
      'SupportingDocuments'
    ];

    const filteredData = selectedRows.map((item: any, index: number) => {

      const filteredItem: any = {};

      filteredItem['Sr. No'] = index + 1;

      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });

      return filteredItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.-]/g, '_');

    XLSX.writeFile(
      wb,
      `GenerateTransferRequestReport_${timestamp}.xlsx`
    );
  }
}
