import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetExamAttendanceComponent } from './set-exam-attendance.component';


const routes: Routes = [{ path: '', component: SetExamAttendanceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetExamAttendanceRoutingModule { }
