import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointexaminerreportComponent } from './iti-appoint-examiner-report.component';

const routes: Routes = [{ path: '', component: AppointexaminerreportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointexaminerreportRoutingModule { }
