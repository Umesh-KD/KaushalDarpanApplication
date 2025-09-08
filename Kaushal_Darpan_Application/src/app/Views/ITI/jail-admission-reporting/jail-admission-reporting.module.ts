import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JailAdmissionReportingRoutingModule } from './jail-admission-reporting-routing.module';
import { JailAdmissionReportingComponent } from './jail-admission-reporting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    JailAdmissionReportingComponent
  ],
  imports: [
    CommonModule,
    JailAdmissionReportingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    OTPModalModule  
  ]
})
export class JailAdmissionReportingModule { }
