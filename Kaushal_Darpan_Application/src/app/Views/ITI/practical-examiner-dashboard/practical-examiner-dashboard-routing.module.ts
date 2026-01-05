import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PracticalExaminerDashboardComponent } from './practical-examiner-dashboard.component';

const routes: Routes = [{ path: '', component: PracticalExaminerDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticalExaminerDashboardRoutingModule { }
