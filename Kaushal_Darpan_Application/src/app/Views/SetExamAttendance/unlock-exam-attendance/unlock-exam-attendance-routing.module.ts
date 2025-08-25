import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnlockExamAttendanceComponent } from './unlock-exam-attendance.component';


const routes: Routes = [{ path: '', component: UnlockExamAttendanceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnlockExamAttendanceRoutingModule { }
