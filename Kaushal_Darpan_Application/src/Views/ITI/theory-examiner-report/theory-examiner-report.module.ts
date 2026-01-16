import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TheoryExaminerReportRoutingModule } from './theory-examiner-report-routing.module';
import { TheoryExaminerReportComponent } from './theory-examiner-report.component';


@NgModule({
  declarations: [
    TheoryExaminerReportComponent
  ],
  imports: [
    CommonModule,
    TheoryExaminerReportRoutingModule
  ]
})
export class TheoryExaminerReportModule { }
