import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIExaminerDispatchVerifyComponent } from './ITI-Examiner-Dispatch-Verify.component';

const routes: Routes = [{ path: '', component: ITIExaminerDispatchVerifyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIExaminerDispatchVerifyRoutingModule { }
