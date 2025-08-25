import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiExaminerDashboardComponent } from './iti-examiner-dashboard.component';
import { ItiExaminerDashboardRoutingModule } from './iti-examiner-dashboard-routing.module';


@NgModule({
  declarations: [
    ItiExaminerDashboardComponent
  ],
  imports: [
    CommonModule,
    ItiExaminerDashboardRoutingModule
  ], exports: [ItiExaminerDashboardComponent]
})
export class ItiExaminerDashboardModule { }
