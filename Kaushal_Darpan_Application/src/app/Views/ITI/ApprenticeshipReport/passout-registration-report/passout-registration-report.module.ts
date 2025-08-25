import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PassoutRegistrationReportRoutingModule } from './passout-registration-report-routing.module';
import { PassoutRegistrationReportComponent } from './passout-registration-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PassoutRegistrationReportComponent
  ],
  imports: [
    CommonModule,
    PassoutRegistrationReportRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PassoutRegistrationReportModule { }
