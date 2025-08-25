import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreExamStudentReportComponent } from './pre-exam-student-reoprt.component';

const routes: Routes = [{ path: '', component: PreExamStudentReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreExamStudentReportRoutingModule { }
