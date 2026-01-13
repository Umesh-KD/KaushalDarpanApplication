import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateAllotmentListReportComponent } from './candidate-allotment-report.component';

const routes: Routes = [{ path: '', component: CandidateAllotmentListReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateAllotmentListReportRoutingModule { }
