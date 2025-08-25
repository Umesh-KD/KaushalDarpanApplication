import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExaminerDispatchRevalVerifyComponent } from './examiner-dispatch-reval-verify.component';

const routes: Routes = [{ path: '', component: ExaminerDispatchRevalVerifyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExaminerDispatchRevalVerifyRoutingModule { }
