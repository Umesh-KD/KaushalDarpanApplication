import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PracticalExaminerRelievingComponent } from './practical-examiner-relieving.component';

const routes: Routes = [{ path: '', component: PracticalExaminerRelievingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticalExaminerRelievingRoutingModule { }
