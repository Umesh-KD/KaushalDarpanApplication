import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterTeacherDashboardComponent } from './bter-teacher-dashboard.component';

const routes: Routes = [{ path: '', component: BterTeacherDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterTeacherDashboardRoutingModule { }
