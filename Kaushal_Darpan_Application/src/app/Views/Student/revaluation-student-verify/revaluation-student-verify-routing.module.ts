import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevaluationStudentVerifyComponent } from './revaluation-student-verify.component';

const routes: Routes = [{ path: '', component: RevaluationStudentVerifyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevaluationStudentVerifyRoutingModule { }
