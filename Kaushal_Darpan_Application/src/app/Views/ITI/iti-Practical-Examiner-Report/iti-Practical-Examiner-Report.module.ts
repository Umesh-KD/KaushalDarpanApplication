import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { itiPracticalExaminerReportRoutingModule } from './iti-Practical-Examiner-Report-routing.module';
import { itiPracticalExaminerReportComponent } from './iti-Practical-Examiner-Report.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    itiPracticalExaminerReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    itiPracticalExaminerReportRoutingModule
  ]
})
export class itiPracticalExaminerReportModule { }
