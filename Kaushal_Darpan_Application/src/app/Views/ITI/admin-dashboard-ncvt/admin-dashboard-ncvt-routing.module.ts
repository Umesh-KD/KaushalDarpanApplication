import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardNcvtComponent } from './admin-dashboard-ncvt.component';

const routes: Routes = [{ path: '', component: AdminDashboardNcvtComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardNcvtRoutingModule { }
