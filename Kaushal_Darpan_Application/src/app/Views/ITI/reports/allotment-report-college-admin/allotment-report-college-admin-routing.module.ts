import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllotmentReportCollegeAdminComponent } from './allotment-report-college-admin.component';

const routes: Routes = [{ path: '', component: AllotmentReportCollegeAdminComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotmentReportCollegeAdminRoutingModule { }
