import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterEmStaffRequestRelievingJoiningReportComponent } from './BterEmStaffRequestRelievingJoiningReport.component';


const routes: Routes = [{ path: '', component: BterEmStaffRequestRelievingJoiningReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterEmStaffRequestRelievingJoiningReportRoutingModule { }
