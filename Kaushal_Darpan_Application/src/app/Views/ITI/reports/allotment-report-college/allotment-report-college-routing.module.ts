import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllotmentReportCollegeComponent } from './allotment-report-college.component';

const routes: Routes = [{ path: '', component: AllotmentReportCollegeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotmentReportCollegeRoutingModule { }
