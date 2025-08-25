import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NcvtPracticalexamAttendenceComponent } from './ncvt-practicalexam-attendence.component';

const routes: Routes = [{ path: '', component: NcvtPracticalexamAttendenceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NcvtPracticalexamAttendenceRoutingModule { }
