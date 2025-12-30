import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostelStudentMeritListWardenViewComponent } from './hostel-student-merit-list-warden-view.component';

const routes: Routes = [{ path: '', component: HostelStudentMeritListWardenViewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostelStudentMeritListWardenViewRoutingModule { }
