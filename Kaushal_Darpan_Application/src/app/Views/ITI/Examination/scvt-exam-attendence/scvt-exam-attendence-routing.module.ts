import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScvtExamAttendenceComponent } from './scvt-exam-attendence.component';

const routes: Routes = [{ path: '', component: ScvtExamAttendenceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScvtExamAttendenceRoutingModule { }
