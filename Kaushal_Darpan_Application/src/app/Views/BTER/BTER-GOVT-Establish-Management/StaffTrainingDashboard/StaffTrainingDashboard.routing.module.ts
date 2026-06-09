import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StaffTrainingDashboardComponent } from './StaffTrainingDashboard.component';


const routes: Routes = [{ path: '', component: StaffTrainingDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffTrainingDashboardRoutingModule { }
