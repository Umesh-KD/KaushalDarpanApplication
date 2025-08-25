import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SCAExamAttendanceComponent } from './sca-exam-attendance.component';


const routes: Routes = [{ path: '', component: SCAExamAttendanceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SCAExamAttendanceRoutingModule { }
