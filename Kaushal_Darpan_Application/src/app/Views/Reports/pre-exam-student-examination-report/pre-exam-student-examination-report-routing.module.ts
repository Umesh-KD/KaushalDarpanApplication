import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreExamStudentExaminationReportComponent } from './pre-exam-student-examination-report.component';

const routes: Routes = [{ path: '', component: PreExamStudentExaminationReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreExamStudentExaminationReportRoutingModule { }
