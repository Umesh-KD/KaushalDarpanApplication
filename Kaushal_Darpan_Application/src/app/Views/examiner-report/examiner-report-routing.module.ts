import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExaminerReportComponent } from './examiner-report.component';

const routes: Routes = [{ path: '', component: ExaminerReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExaminerReportRoutingModule { }
