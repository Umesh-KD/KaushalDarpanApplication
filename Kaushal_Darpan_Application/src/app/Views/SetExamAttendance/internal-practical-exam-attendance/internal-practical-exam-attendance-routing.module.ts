import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalPracticalExamAttendanceComponent } from './internal-practical-exam-attendance.component';


const routes: Routes = [{ path: '', component: InternalPracticalExamAttendanceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalPracticalExamAttendanceRoutingModule { }
