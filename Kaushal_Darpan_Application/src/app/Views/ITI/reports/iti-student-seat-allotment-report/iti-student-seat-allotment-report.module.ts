import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiStudentSeatAllotmentReportRoutingModule } from './iti-student-seat-allotment-report-routing.module';
import { ItiStudentSeatAllotmentReportComponent } from './iti-student-seat-allotment-report.component';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ItiStudentSeatAllotmentReportComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ItiStudentSeatAllotmentReportRoutingModule,
    TableSearchFilterModule
  ]
})
export class ItiStudentSeatAllotmentReportModule { }
