import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentPaperReportRoutingModule } from './student-paper-report-routing.module';
import { StudentPaperReportComponent } from './student-paper-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StudentPaperReportComponent
  ],
  imports: [
    CommonModule,
    StudentPaperReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    
  ]
})
export class StudentPaperReportModule { }
