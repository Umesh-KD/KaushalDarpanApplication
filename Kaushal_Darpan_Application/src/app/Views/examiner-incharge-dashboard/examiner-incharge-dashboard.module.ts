import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExaminerInchargeDashboardRoutingModule } from './examiner-incharge-dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { ExaminerInchargeComponent } from './examiner-incharge-dashboard.component';


@NgModule({
  declarations: [ExaminerInchargeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    ExaminerInchargeDashboardRoutingModule
  ],
  exports: [ExaminerInchargeComponent]
})
export class ExaminerInchargeDashboardModule { }
