import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiCollegeReportRoutingModule } from './iti-college-report-routing.module';
import { ItiCollegeReportComponent } from './iti-college-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ItiCollegeReportComponent
  ],
  imports: [
    CommonModule,
    ItiCollegeReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OTPModalModule,
    NgSelectModule
  ]
})
export class ItiCollegeReportModule { }
