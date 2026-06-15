import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { StaffDashService } from '../../../../Services/StaffDashboard/staff-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffDashboardSearchModel } from '../../../../Models/StaffDashboardDataModel';
import { CollegeMasterService } from '../../../../Services/CollegeMaster/college-master.service';
import { EnumEMProfileStatus, EnumRole } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { StaffMasterSearchModel } from '../../../../Models/StaffMasterDataModel';
import { StaffMasterService } from '../../../../Services/StaffMaster/staff-master.service';
import { AdminDashboardSearchModel, EM_JDTEDashboardSearchModel, EM_TransferRelievingDashSearchModel } from '../../../../Models/AdminDashboardDataModel';
import { AdminDashboardDataService } from '../../../../Services/AdminDashboard/admin-dashboard-data.service';
import { DteItemUnitMasterService } from '../../../../Services/DTEInventory/DTEItemUnitMaster/DTEItemunit-master.service';
import { DashboardRequestModel } from '../../../../Models/DTEInventory/DTEItemUnitModel';

@Component({
  selector: 'app-ITICommanDashboard',
  templateUrl: './ITI_CommanDashboard.component.html',
  styleUrls: ['./ITI_CommanDashboard.component.css'],
  standalone: false
})
export class ITI_CommanDashboardComponent {
  public viewPlacementDashboardList: any = [];
  public InventoryList: any = [];
  public Table_SearchText: string = "";
  public viewDashboard: any[] = [];
  public viewTransferDashboard: any[] = [];
  public viewRelievingDashboard: any[] = [];
  public StaffMasterList: any[] = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public searchRequest = new DashboardRequestModel();
  
  public staffSearchRequest = new StaffMasterSearchModel();

  isProfileComplete: boolean = false;
  RowBoxlength: number=0
  constructor(
    private StaffDashService: StaffDashService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private collegeMasterService: CollegeMasterService,
    private sweetAlert2: SweetAlert2,
    private staffMasterService: StaffMasterService,
    private router: Router,
    private AdminDashDataService: AdminDashboardDataService,
    private dteItemUnitMasterService: DteItemUnitMasterService,
  ) { }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDashboardData();
  }

 
  async GetDashboardData() {
    debugger
    this.searchRequest.Action = "";
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.UserID=this.sSOLoginDataModel.UserID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.searchRequest.Status = 0;
    try {
      this.loaderService.requestStarted();
      await this.dteItemUnitMasterService.GetBter_InventoryDashboard(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger
          this.viewDashboard = data['Data'];
          if (this.viewDashboard && this.viewDashboard.length > 0) {
            this.RowBoxlength = this.viewDashboard.length;
          } else {
            this.RowBoxlength = 0;
          }
          //this.viewTransferDashboard = this.viewDashboard.filter(s => s.ListType === 'Transfer');
          //this.viewRelievingDashboard = this.viewDashboard.filter(s => s.ListType === 'Relieving');
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
