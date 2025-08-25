import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiCollegeReportRoutingModule } from './iti-college-report-routing.module';
import { ItiCollegeReportComponent } from './iti-college-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ItiCollegeReportComponent
  ],
  imports: [
    CommonModule,
    ItiCollegeReportRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ItiCollegeReportModule { }
