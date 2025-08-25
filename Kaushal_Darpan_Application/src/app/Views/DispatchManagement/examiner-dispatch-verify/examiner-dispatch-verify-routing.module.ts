import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExaminerDispatchVerifyComponent } from './examiner-dispatch-verify.component';

const routes: Routes = [{ path: '', component: ExaminerDispatchVerifyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExaminerDispatchVerifyRoutingModule { }
