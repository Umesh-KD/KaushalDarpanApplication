import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnlockExaminerGroupcodeRevalComponent } from './unlock-examiner-groupcode-reval.component';

const routes: Routes = [{ path: '', component: UnlockExaminerGroupcodeRevalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnlockExaminerGroupcodeRevalRoutingModule { }
