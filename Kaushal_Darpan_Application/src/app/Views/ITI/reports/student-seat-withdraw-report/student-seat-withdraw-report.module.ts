import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentSeatWithdrawReportRoutingModule } from './student-seat-withdraw-report-routing.module';
import { StudentSeatWithdrawReportComponent } from './student-seat-withdraw-report.component';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    StudentSeatWithdrawReportComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    CommonModule,
    StudentSeatWithdrawReportRoutingModule
  ]
})
export class StudentSeatWithdrawReportModule { }
