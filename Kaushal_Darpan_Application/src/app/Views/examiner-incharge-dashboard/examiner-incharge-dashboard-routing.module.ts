import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExaminerInchargeComponent } from './examiner-incharge-dashboard.component';

const routes: Routes = [{ path: '', component: ExaminerInchargeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExaminerInchargeDashboardRoutingModule { }
