import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportedStudentReportComponent } from './report-for-admin.component';

const routes: Routes = [{ path: '', component: ReportedStudentReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportedStudentReportRoutingModule { }
