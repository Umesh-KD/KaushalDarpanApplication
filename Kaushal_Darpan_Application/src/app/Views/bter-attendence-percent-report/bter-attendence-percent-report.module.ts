import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BterAttendencePercentReportRoutingModule } from './bter-attendence-percent-report-routing.module';
import { BterAttendencePercentReportComponent } from './bter-attendence-percent-report.component';


@NgModule({
  declarations: [
    BterAttendencePercentReportComponent
  ],
  imports: [
    CommonModule,
    BterAttendencePercentReportRoutingModule
  ]
})
export class BterAttendencePercentReportModule { }
