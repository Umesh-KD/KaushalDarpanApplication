import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdmissionAllotmentReportComponent } from './admission-allotment-report.component';





const routes: Routes = [{ path: '', component: AdmissionAllotmentReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmissionAllotmentReportRoutingModule { }
