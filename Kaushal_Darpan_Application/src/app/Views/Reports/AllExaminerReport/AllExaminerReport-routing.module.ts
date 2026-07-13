import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllExaminerReportComponent } from './AllExaminerReport.component';

const routes: Routes = [{ path: '', component: AllExaminerReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllExaminerReportRoutingModule { }
