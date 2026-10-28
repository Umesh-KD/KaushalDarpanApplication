import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { PayLevelMasterService } from '../../../../Services/BTER/PayLevelMaster/pay-level-master.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { PayLevelMasterDataModel } from '../../../../Models/BTER/PayLevelMasterDataModel';
import { Router } from '@angular/router';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-pay-level-master',
  standalone: false,
  templateUrl: './pay-level-master.component.html',
  styleUrl: './pay-level-master.component.css'
})
export class PayLevelMasterComponent {
  public PayLevelMasterForm!: FormGroup;

  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new PayLevelMasterDataModel();

  public PayLevelMasterData: any = [];
  public MenuAllowedRoleList: any = [];

  modalReference: NgbModalRef | undefined;
  public isSubmitted: boolean = false
  public Table_SearchText: string = "";
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private modalService: NgbModal,
    private formBuilder:FormBuilder,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private payLevelMasterService: PayLevelMasterService,
    private routers: Router,
    private commonMasterService: CommonFunctionService,
  ){}

  async ngOnInit() {
    this.PayLevelMasterForm = this.formBuilder.group({
      PayLevel: ['', Validators.required],
    })

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetMenuPermission();
    await this.GetPayLevelMasterData();
  }

  get _PayLevelMasterForm() { return this.PayLevelMasterForm.controls; }

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
      await this.GetPayLevelMasterData_ByID(id);
    }
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'md', keyboard: true, centered: true });    
  }

  async GetPayLevelMasterData_ByID(id: number) {
    try {
      const request = new PayLevelMasterDataModel();
      request.PayLevelID = id;
      request.Action = 'GetData_ByID';

      await this.payLevelMasterService.GetPayLevelMasterData(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.request = data.Data[0];
        }
      })  
    } catch (error) {
      console.error(error);
    }
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
    this.request = new PayLevelMasterDataModel();
  }

  async GetPayLevelMasterData() {
    try {
      const request = new PayLevelMasterDataModel();
      request.Action = 'GetAllData';
      request.UserID = this.sSOLoginDataModel.UserID;

      await this.payLevelMasterService.GetPayLevelMasterData(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.PayLevelMasterData = data.Data;
        }
      })
    } catch (error) { 
      console.error(error);
    }
  }

  async onClickDelete(id: number) {
    try {
      const request = new PayLevelMasterDataModel();
      request.PayLevelID = id;
      request.UserID = this.sSOLoginDataModel.UserID;

      await this.payLevelMasterService.DeletePayLevel_ByID(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          await this.GetPayLevelMasterData();
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async SavePayLevelMasterData() {
    //Show Loading
    this.loaderService.requestStarted();

    try {
      if (this.PayLevelMasterForm.valid) {        
        this.request.UserID = this.sSOLoginDataModel.UserID;

        await this.payLevelMasterService.SavePayLevelMasterData(this.request)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State == EnumStatus.Success) {
              this.toastr.success(data.Message);
              this.CloseModalPopup();
              await this.GetPayLevelMasterData();
            } else {
              this.toastr.error(data.ErrorMessage)
            }
          });
      } else {
        this.toastr.error('Form is invalid');
        this.PayLevelMasterForm.markAllAsTouched();
      }
    } catch (ex) { 
      console.log(ex) 
    }
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

    this.PayLevelMasterData = [...this.PayLevelMasterData].sort((a: any, b: any) => {
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
}
