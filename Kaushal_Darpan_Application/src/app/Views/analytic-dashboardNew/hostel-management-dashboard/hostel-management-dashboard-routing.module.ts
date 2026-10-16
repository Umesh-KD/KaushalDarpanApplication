import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostelManagementDashboardComponent } from './hostel-management-dashboard.component';

const routes: Routes = [{ path: '', component: HostelManagementDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostelManagementDashboardRoutingModule { }
