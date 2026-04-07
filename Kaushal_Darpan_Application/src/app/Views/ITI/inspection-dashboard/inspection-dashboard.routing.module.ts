import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ITIInspectionDashboardComponent } from './inspection-dashboard.component';

const routes: Routes = [{ path: '', component: ITIInspectionDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIInspectionDashboardRoutingModule { }
