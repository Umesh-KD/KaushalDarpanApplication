import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodalDashboardITIComponent } from './nodal-dashboard-iti.component';

const routes: Routes = [{ path: '', component: NodalDashboardITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NodalDashboardITIRoutingModule { }
