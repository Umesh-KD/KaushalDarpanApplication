import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllotmentReportingRoutingModule } from './allotment-reporting-routing.module';
import { AllotmentReportingComponent } from './allotment-reporting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    AllotmentReportingComponent
  ],
  imports: [
    CommonModule,
    AllotmentReportingRoutingModule,
    FormsModule,
    ReactiveFormsModule, OTPModalModule
  ]
})
export class AllotmentReportingModule { }
