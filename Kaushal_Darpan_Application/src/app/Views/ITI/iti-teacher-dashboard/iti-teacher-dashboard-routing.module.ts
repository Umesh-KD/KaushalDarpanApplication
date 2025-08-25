import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITITeacherDashboardComponent } from './iti-teacher-dashboard.component';

const routes: Routes = [{ path: '', component: ITITeacherDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITITeacherDashboardRoutingModule { }
