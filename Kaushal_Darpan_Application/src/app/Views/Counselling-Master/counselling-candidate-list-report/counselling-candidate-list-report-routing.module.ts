import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounsellingCandidateListReportComponent } from './counselling-candidate-list-report.component';

const routes: Routes = [{ path: '', component: CounsellingCandidateListReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CounsellingCandidateListReportRoutingModule { }
