import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { DTEInventoryDashboardDataModel } from '../../../../Models/DTEInventory/DTEInventoryDashboardDataModel';
import { ITIInventoryService } from '../../../../Services/ITI/ITIInventory/iti-inventory.service';

@Component({
  selector: 'app-iti-inventory-management-dashboard',
  templateUrl: './iti-inventory-management-dashboard.component.html',
  styleUrl: './iti-inventory-management-dashboard.component.css',
  standalone: false
})
export class ITIInventoryManagementDashboard {
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public searchRequest = new DTEInventoryDashboardDataModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public EquipmentsList: any = [];
  public InventoryDashboardList: any = [];

  constructor(
    private itiInventoryService: ITIInventoryService,
    private loaderService: LoaderService) { }

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
      await this.itiInventoryService.GetInventoryDashboard(this.searchRequest)
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
