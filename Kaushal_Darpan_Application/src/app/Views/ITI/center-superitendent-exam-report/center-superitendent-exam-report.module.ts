import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CenterSuperitendentExamReportRoutingModule } from './center-superitendent-exam-report-routing.module';
import { CenterSuperitendentExamReportComponent } from './center-superitendent-exam-report.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CenterSuperitendentExamReportComponent
  ],
  imports: [
    CommonModule,
    CenterSuperitendentExamReportRoutingModule,
    ReactiveFormsModule
  ]
})
export class CenterSuperitendentExamReportModule { }
