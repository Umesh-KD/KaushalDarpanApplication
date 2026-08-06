import { Component, OnInit } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { EnumStatus } from '../../Common/GlobalConstants';
import { ToastrService } from 'ngx-toastr';
import { DashboardSignalrService } from '../../Services/signalr/dashboardsignalr.service';


@Component({
  selector: 'app-signal-r-dashboard',
  standalone: false,
  templateUrl: './signal-r-dashboard.component.html',
  styleUrl: './signal-r-dashboard.component.css'
})

export class SignalRDashboardComponent implements OnInit {
  readonly APIUrl = this.appsettingConfig.apiURL + "DashboardSignalR";
  public dashboard: any = {};

  constructor(
    private dashboardsignalrService: DashboardSignalrService,
    private appsettingConfig: AppsettingService,
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService) {
  }

  async ngOnInit() {
    // load
    this.dashboardsignalrService.StartSignalRConnection(); // start signal-r connection
    // refresh the dashboard count signal-r
    await this.refreshDashboardCount();
    // get count
    await this.loadDashboardCount();
  }

  async loadDashboardCount() {
    try {
      //debugger;
      this.dashboard = {};
      await this.commonFunctionService.GetDashboardCountSignalR(`${this.APIUrl}/GetDashboardCount`)
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            this.dashboard = data.Data;
          } else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(data.Message);
          } else {
            this.toastr.error(data.Message);
          }
        })
    } catch (error) {
      console.error(error);
    }
  }

  async refreshDashboardCount() {
    try {
      //debugger;
      this.dashboard = {};
      this.dashboardsignalrService.RefreshDashboardCount((data: any) => {
        if (data.State == EnumStatus.Success) {
          this.dashboard = data.Data;
        } else if (data.State == EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.Message);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async saveDashboardCount() {
    try {
      //debugger;
      this.dashboard = {};
      await this.commonFunctionService.SaveDashboardCountSignalR(`${this.APIUrl}/SaveDashboardCount`)
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
          } else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(data.Message);
          } else {
            this.toastr.error(data.Message);
          }
        })
    } catch (error) {
      console.error(error);
    }
  }
}
