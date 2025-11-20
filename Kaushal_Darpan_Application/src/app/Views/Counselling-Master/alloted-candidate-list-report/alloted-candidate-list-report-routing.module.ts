import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllotedCandidateListReportComponent } from './alloted-candidate-list-report.component';

const routes: Routes = [{ path: '', component: AllotedCandidateListReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotedCandidateListReportRoutingModule { }
