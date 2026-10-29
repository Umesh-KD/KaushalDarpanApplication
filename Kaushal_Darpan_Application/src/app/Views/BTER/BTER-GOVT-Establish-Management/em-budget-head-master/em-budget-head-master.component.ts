import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumITIBudgetDDLAction, EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ITI_BGT_HeadMasterSearchModel, ITI_BGT_HeadMasterDataModel } from '../../../../Models/ITI/ItiBGTHeadMasterDataModel';
import { ITIBudgetDropdownDataModel } from '../../../../Models/ITI/ITIBudgetCreateDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { ITI_BGTHeadmasterService } from '../../../../Services/ITI/ITI_BGT_Headmaster/ITI_BGTHeadmaster.Service';
import { ITIBudgetCreateService } from '../../../../Services/ITI/ITIBudgetCreate/itibudget-create.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-em-budget-head-master',
  standalone: false,
  templateUrl: './em-budget-head-master.component.html',
  styleUrl: './em-budget-head-master.component.css'
})
export class EMBudgetHeadMasterComponent {
  public BGTHeadForm!: FormGroup;

  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest: any = {};
  public request: any = {}

  public UCHeadDataList: any = [];
  public ddlBudgetTypeList: any = [];
  public MenuAllowedRoleList: any = [];

  modalReference: NgbModalRef | undefined;
  public isSubmitted: boolean = false
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(
    private modalService: NgbModal,
    private formBuilder:FormBuilder,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
    private commonMasterService: CommonFunctionService,
    private ItiBGTHeadmasterServices: ITI_BGTHeadmasterService,
    private budgetCreateService: ITIBudgetCreateService,
    private bterEstablishManagementService: BTEREstablishManagementService,
    private routers: Router
  ) {}

  async ngOnInit() {
    this.BGTHeadForm=this.formBuilder.group({
      HeadName: ['', Validators.required],
      HeadDescription: [''],
      BudgetTypeID: ['', [DropdownValidators]],
    })
    this.request.BudgetTypeID = 0
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetMenuPermission();
    await this.GetBudgetHeadMasterData_EM();
  }

  get _BGTHeadForm() { return this.BGTHeadForm.controls; }

  async GetMenuPermission() {
 
    const baseRoute = this.routers.url.split('?')[0].split('/').filter(Boolean)[0] ?? '';
 
    var request: any = {
      FilterBy: baseRoute,
      MasterCode: "GetAllowedRoleForMenu"
    }
 
    await this.commonMasterService.CommonMasterDataByAction(request).then((data: any) => {
      data =  JSON.parse(JSON.stringify(data));
      if(data.State == EnumStatus.Success){
        this.MenuAllowedRoleList=data.Data
 
        if (!this.MenuAllowedRoleList.some(
          (item: any) => Number(item.RoleID) == Number(this.sSOLoginDataModel.RoleID)
        )) {
          // Navigate to dashboard if RoleID is not allowed
          this.routers.navigate(['/dashboard']);
        }
      }      
    })
  }
  async ViewandUpdate(content: any, id : number = 0) {
    if(id > 0) {
      await this.GetBudgetHeadById_EM(id);
    }
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });    
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
    this.request = {}
    // this.AppointExaminer = new ExaminerDataModel();
  }

  async GetBudgetHeadMasterData_EM() {
    try {
      this.searchRequest.Action = "GetAllData"

      await this.bterEstablishManagementService.GetBudgetHeadMasterData_EM(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.UCHeadDataList = data.Data;
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async GetBudgetHeadById_EM(id: number) {
    try {
      await this.bterEstablishManagementService.GetBudgetHeadById_EM(id).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          // this.BGTHeadForm.patchValue(data.Data[0]);
          this.request = data.Data[0];
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async onDeleteClick(id: number) {
    try {
      await this.bterEstablishManagementService.DeleteBudgetHeadById_EM(id, this.sSOLoginDataModel.UserID).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          await this.GetBudgetHeadMasterData_EM();
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async EM_BudgetHeadMaster_Save() {
    //Show Loading
    this.loaderService.requestStarted();

    try {
      if (this.BGTHeadForm.valid) {        
        this.request.CreatedBy = this.sSOLoginDataModel.UserID.toString();
        this.request.FinYearID = this.sSOLoginDataModel.FinancialYearID;
        this.request.UserID = this.sSOLoginDataModel.UserID;
        console.log('Form Submitted:request', this.request);

        await this.bterEstablishManagementService.EM_BudgetHeadMaster_Save(this.request)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State == EnumStatus.Success) {
              this.toastr.success(data.Message);
              this.CloseModalPopup();
              this.ngOnInit();
            } else {
              this.toastr.error(data.ErrorMessage)
            }
          });
      } else {
        this.toastr.error('Form is invalid');
        this.BGTHeadForm.markAllAsTouched();
      }
    } catch (ex) { 
      console.log(ex) 
    }
  }
  
  async onResetSearch() {
    this.searchRequest = {};
    await this.GetBudgetHeadMasterData_EM();
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    const dir = this.sortDirection === 'asc' ? 1 : -1;
    const isDateCol = column === 'CreatedDate' || column === 'ModifyDate';
    const isNumCol = column === 'ActiveStatus';

    this.UCHeadDataList = [...this.UCHeadDataList].sort((a: any, b: any) => {
      let x = a[column];
      let y = b[column];

      if (isDateCol) {
        x = this.parseDateOrNull(x) ?? 0;
        y = this.parseDateOrNull(y) ?? 0;
      } else if (isNumCol) {
        x = Number(x) || 0;
        y = Number(y) || 0;
      } else {
        x = (x ?? '').toString().toLowerCase();
        y = (y ?? '').toString().toLowerCase();
      }

      if (x < y) return -1 * dir;
      if (x > y) return 1 * dir;
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'ti ti-arrows-sort';
    return this.sortDirection === 'asc' ? 'ti ti-sort-ascending' : 'ti ti-sort-descending';
  }

  // Parses 'dd-MM-yyyy HH:mm:ss' or 'dd-MM-yyyy hh:mm:ss tt'
  private parseDateOrNull(value: string): number | null {
    if (!value) return null;
    const m = value.match(/^(\d{2})-(\d{2})-(\d{4})[ T](\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)?$/i);
    if (!m) return null;
    let hours = parseInt(m[4], 10);
    if (m[7]) {
      hours = hours % 12;
      if (m[7].toUpperCase() === 'PM') hours += 12;
    }
    return new Date(+m[3], +m[2] - 1, +m[1], hours, +m[5], +m[6]).getTime();
  }

  exportToExcel(): void {
    if (!this.UCHeadDataList || this.UCHeadDataList.length === 0) {
      this.toastr.warning("No data available to export.");
      return;
    }
    const unwantedColumns = ['StreamID'];

    const columnOrder = [
      'BudgetType_str', 'HeadName', 'HeadDescription', 'CreatedBy', 'CreatedDate', 'ModifyBy', 'ModifyDate'
    ];

    const filteredData = this.UCHeadDataList.map((item: any) => {
      const row: any = {};
      columnOrder.forEach(col => {
        if (!unwantedColumns.includes(col)) {
          row[col] = item[col] ?? ''; // fallback if value missing
        }
      });

      return row;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory Report');

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    XLSX.writeFile(wb, `Branch_master_${timestamp}.xlsx`);
  }

}
