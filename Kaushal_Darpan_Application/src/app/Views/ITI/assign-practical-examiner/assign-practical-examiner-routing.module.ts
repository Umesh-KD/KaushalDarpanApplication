import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignPracticalExaminerComponent } from './assign-practical-examiner.component';

const routes: Routes = [{ path: '', component: AssignPracticalExaminerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignPracticalExaminerRoutingModule { }
