import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardITIComponent } from './admin-dashboard-iti.component';

const routes: Routes = [{ path: '', component: AdminDashboardITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardITIRoutingModule { }
