import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StaffDashReportComponent } from './staff-dash-report.component';

const routes: Routes = [{ path: '', component: StaffDashReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffDashReportRoutingModule { }
