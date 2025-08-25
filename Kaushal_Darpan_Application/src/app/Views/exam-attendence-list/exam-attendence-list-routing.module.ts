import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamAttendenceListComponent } from './exam-attendence-list.component';

const routes: Routes = [{ path: '', component: ExamAttendenceListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamAttendenceListRoutingModule { }
