import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InternalMarksReportCollegeWiseComponent } from './InternalMarksReportCollegeWise.component';





const routes: Routes = [{ path: '', component: InternalMarksReportCollegeWiseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalMarksReportCollegeWiseRoutingModule { }
