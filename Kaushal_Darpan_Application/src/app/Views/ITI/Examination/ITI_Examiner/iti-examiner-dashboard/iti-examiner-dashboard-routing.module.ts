import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiExaminerDashboardComponent } from './iti-examiner-dashboard.component';

const routes: Routes = [{ path: '', component: ItiExaminerDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiExaminerDashboardRoutingModule { }
