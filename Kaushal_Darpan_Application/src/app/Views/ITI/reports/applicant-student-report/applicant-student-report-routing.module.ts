import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicantStudentReportComponent } from './applicant-student-report.component';

const routes: Routes = [{ path: '', component: ApplicantStudentReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicantStudentReportRoutingModule { }
