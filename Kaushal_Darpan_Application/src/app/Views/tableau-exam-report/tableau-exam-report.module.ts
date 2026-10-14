import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableauExamReportRoutingModule } from './tableau-exam-report-routing.module';
import { TableauExamReportComponent } from './tableau-exam-report.component';


@NgModule({
  declarations: [
    TableauExamReportComponent
  ],
  imports: [
    CommonModule,
    TableauExamReportRoutingModule
  ]
})
export class TableauExamReportModule { }
