import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardSCVTComponent } from './admin-dashboard-scvt.component';

const routes: Routes = [{ path: '', component: AdminDashboardSCVTComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardSCVTRoutingModule { }


