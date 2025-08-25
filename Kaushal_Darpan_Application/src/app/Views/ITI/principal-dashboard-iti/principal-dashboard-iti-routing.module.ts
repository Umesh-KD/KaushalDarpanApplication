import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalDashboardITIComponent } from './principal-dashboard-iti.component';

const routes: Routes = [{ path: '', component: PrincipalDashboardITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalDashboardITIRoutingModule { }
