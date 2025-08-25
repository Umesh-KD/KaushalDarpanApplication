import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreExamStudentVerificationComponent } from './pre-exam-student-verification.component';

const routes: Routes = [{ path: '', component: PreExamStudentVerificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreExamStudentVerificationRoutingModule { }
