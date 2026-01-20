import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointInstructorListComponent } from './appoint-instructor-list.component';

const routes: Routes = [{ path: '', component: AppointInstructorListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointInstructorListRoutingModule { }
