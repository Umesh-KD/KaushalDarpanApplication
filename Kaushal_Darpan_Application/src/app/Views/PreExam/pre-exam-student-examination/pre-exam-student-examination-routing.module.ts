import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreExamStudentExaminationComponent } from './pre-exam-student-examination.component';

const routes: Routes = [{ path: '', component: PreExamStudentExaminationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreExamStudentExaminationRoutingModule { }
