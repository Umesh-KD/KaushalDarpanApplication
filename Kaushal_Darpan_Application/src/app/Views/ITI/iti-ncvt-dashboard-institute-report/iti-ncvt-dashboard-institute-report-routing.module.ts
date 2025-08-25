import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITINcvtDashboardInstituteReportComponent } from './iti-ncvt-dashboard-institute-report.component';

const routes: Routes = [{ path: '', component: ITINcvtDashboardInstituteReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITINcvtDashboardInstituteReportRoutingModule { }
