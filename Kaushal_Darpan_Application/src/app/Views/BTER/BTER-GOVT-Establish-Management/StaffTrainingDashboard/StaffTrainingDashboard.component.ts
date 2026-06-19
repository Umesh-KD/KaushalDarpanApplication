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
import { AdminDashboardSearchModel, EM_JDTEDashboardSearchModel, EM_StaffTrainingDashboardSearchModel, EM_TransferRelievingDashSearchModel } from '../../../../Models/AdminDashboardDataModel';
import { AdminDashboardDataService } from '../../../../Services/AdminDashboard/admin-dashboard-data.service';

@Component({
  selector: 'app-StaffTrainingDashboard',
  templateUrl: './StaffTrainingDashboard.component.html',
  styleUrls: ['./StaffTrainingDashboard.component.css'],
  standalone: false
})
export class StaffTrainingDashboardComponent {
  public viewPlacementDashboardList: any = [];
  public InventoryList: any = [];
  public Table_SearchText: string = "";
  public viewDashboard: any[] = [];
  public viewCompletedStaffTrainingDashboard: any[] = [];
  public viewNewStaffTrainingDashboard: any[] = [];
  public StaffMasterList: any[] = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public searchRequest = new EM_StaffTrainingDashboardSearchModel();
  
  public staffSearchRequest = new StaffMasterSearchModel();

  isProfileComplete: boolean = false;
  constructor(
    private StaffDashService: StaffDashService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private collegeMasterService: CollegeMasterService,
    private sweetAlert2: SweetAlert2,
    private staffMasterService: StaffMasterService,
    private router: Router,
    private AdminDashDataService: AdminDashboardDataService,
  ) { }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
      await this.GetAllData();
  }

 
  async GetAllData() {
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.UserID=this.sSOLoginDataModel.UserID;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    try {

      this.loaderService.requestStarted();
      await this.AdminDashDataService.GetStaffTrainingDashboardData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.viewDashboard = data['Data'];
          this.viewCompletedStaffTrainingDashboard = this.viewDashboard.filter(s => s.ListType === 'CompletedTraining');
          this.viewNewStaffTrainingDashboard = this.viewDashboard.filter(s => s.ListType === 'NewTraining');
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
