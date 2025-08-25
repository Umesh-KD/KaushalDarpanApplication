import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TheoryExamReportRoutingModule } from './theory-exam-report-routing.module';
import { TheoryExamReportComponent } from './theory-exam-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    TheoryExamReportComponent
  ],
  imports: [
    CommonModule,
    TheoryExamReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class TheoryExamReportModule { }
