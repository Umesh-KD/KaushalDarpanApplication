import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { TradeEquipmentsMappingService } from '../../../../Services/TradeEquipmentsMapping/trade-equipments-mapping.service';
import { EquipmentsMasterService } from '../../../../Services/EquipmentsMaster/equipments-master.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { DteInventoryManagementDashboardService } from '../../../../Services/DTEInventory/DTEInventoryManagementDashboard/dteinventory-management-dashboard.service';
import { DTEInventoryDashboardDataModel } from '../../../../Models/DTEInventory/DTEInventoryDashboardDataModel';

@Component({
  selector: 'app-dteinventory-management-dashboard',
  templateUrl: './dteinventory-management-dashboard.component.html',
  styleUrl: './dteinventory-management-dashboard.component.css',
  standalone: false
})
export class DTEInventoryManagementDashboardComponent {
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public searchRequest = new DTEInventoryDashboardDataModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public EquipmentsList: any = [];
  public InventoryDashboardList: any = [];

  constructor(
    private toastr: ToastrService,
    private dteInventoryManagementDashboardService: DteInventoryManagementDashboardService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal) { }

  async ngOnInit() {
    //this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetDTEInventoryDashboard();
  }

  
  async GetDTEInventoryDashboard() {
    
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.InventoryDashboardList = [];
    try {
      this.loaderService.requestStarted();
      await this.dteInventoryManagementDashboardService.GetDTEInventoryDashboard(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.InventoryDashboardList = data['Data'];
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }




}
