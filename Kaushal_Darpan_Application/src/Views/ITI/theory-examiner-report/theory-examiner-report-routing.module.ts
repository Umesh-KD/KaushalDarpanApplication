import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TheoryExaminerReportComponent } from './theory-examiner-report.component';

const routes: Routes = [{ path: '', component: TheoryExaminerReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TheoryExaminerReportRoutingModule { }
