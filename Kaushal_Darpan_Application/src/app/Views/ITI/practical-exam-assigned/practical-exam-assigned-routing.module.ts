import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PracticalExamAssignedComponent } from './practical-exam-assigned.component';

const routes: Routes = [{ path: '', component: PracticalExamAssignedComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticalExamAssignedRoutingModule { }
