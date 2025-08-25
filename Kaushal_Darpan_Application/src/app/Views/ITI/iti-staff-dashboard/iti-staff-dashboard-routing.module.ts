import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiStaffDashboardComponent } from './iti-staff-dashboard.component';

const routes: Routes = [{ path: '', component: ItiStaffDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiStaffDashboardRoutingModule { }
