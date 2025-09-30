import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CollegeWiseScholarshipReportComponent } from './college-wise-scholarship-report.component';





const routes: Routes = [{ path: '', component: CollegeWiseScholarshipReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeWiseScholarshipReportRoutingModule { }
