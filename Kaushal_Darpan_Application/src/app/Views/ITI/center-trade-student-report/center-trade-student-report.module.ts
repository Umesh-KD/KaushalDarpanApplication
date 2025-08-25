import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CenterTradeStudentReportRoutingModule } from './center-trade-student-report-routing.module';
import { CenterTradeStudentReportComponent } from './center-trade-student-report.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CenterTradeStudentReportComponent
  ],
  imports: [
    CommonModule,
    CenterTradeStudentReportRoutingModule,
    FormsModule
  ]
})
export class CenterTradeStudentReportModule { }
