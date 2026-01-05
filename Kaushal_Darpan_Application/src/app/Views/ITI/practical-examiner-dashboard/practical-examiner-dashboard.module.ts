import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PracticalExaminerDashboardRoutingModule } from './practical-examiner-dashboard-routing.module';
import { PracticalExaminerDashboardComponent } from './practical-examiner-dashboard.component';


@NgModule({
  declarations: [
    PracticalExaminerDashboardComponent
  ],
  imports: [
    CommonModule,
    PracticalExaminerDashboardRoutingModule
  ],
  exports: [PracticalExaminerDashboardComponent]
})
export class PracticalExaminerDashboardModule { }



