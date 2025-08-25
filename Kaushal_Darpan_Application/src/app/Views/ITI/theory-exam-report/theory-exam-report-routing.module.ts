import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TheoryExamReportComponent } from './theory-exam-report.component';

const routes: Routes = [{ path: '', component: TheoryExamReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TheoryExamReportRoutingModule { }
