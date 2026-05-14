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
          if (this.sSOLoginDataModel.RoleID == EnumRole.EM_JDTE || this.sSOLoginDataModel.RoleID == EnumRole.EM_Secretary_BTER) {
            this.TransferSystemStatusSearchList = this.TransferSystemStatusSearchList.filter((item: any) => item.ID == EnumTransferSystemStatus.UnderJDTEReview);

            this.TransferSystemStatusSearchList = this.TransferSystemStatusSearchList
              .filter((item: any) =>
                item.ID == EnumTransferSystemStatus.UnderJDTEReview 
               
              )
              .map((item: any) => {
                if (item.ID == EnumTransferSystemStatus.UnderJDTEReview) {
                  item.Name = 'JDTE Reviewed';
                }
                return item;
              });

            this.SearchStatus = EnumTransferSystemStatus.UnderJDTEReview;
            this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.UnderJDTEReview);
        }
         else{
          this.TransferSystemStatusList = [];
            this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.UnderJDTEReview);
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
        this.searchRequest.Action = "StructuredSummaryList";
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
    
    exportToExcel(): void {
      const selectedRows = this.EM_TransferProcessList
        .filter((item: any) => item.Selected === true);

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

        // Add Serial Number
        filteredItem["Sr. No"] = index + 1;

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

      const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
      XLSX.writeFile(wb, `GenerateStructuredSummaryList_${timestamp}.xlsx`);
    }
    //exportToExcel(): void {
    //  debugger
    //  const selectedRows = this.EM_TransferProcessList
    //    .filter((item: any) => item.Selected === true);

    //  if (selectedRows.length === 0) {
    //    this.toastr.warning("Please select one record");
    //    return;
    //  }

    //  if (!this.EM_TransferProcessList || this.EM_TransferProcessList.length === 0) {
    //    this.toastr.warning("No data available to export.");
    //    return;
    //  }
    //  const unwantedColumns = ['ISNonGazetted', 'StatusID', 'TransferSystemID', 'Selected', 'SupportingDocumentsDis','SupportingDocuments'];
    //  const filteredData = this.EM_TransferProcessList.map((item: any) => {
    //    const filteredItem: any = {};
    //    Object.keys(item).forEach(key => {
    //      if (!unwantedColumns.includes(key)) {
    //        filteredItem[key] = item[key];
    //      }
    //    });
    //    return filteredItem;
    //  });

    //  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //  XLSX.utils.book_append_sheet(wb, ws, 'Report');

    //  const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    //  XLSX.writeFile(wb, `GenerateStructuredSummaryList_${timestamp}.xlsx`);
    //}
 
}
