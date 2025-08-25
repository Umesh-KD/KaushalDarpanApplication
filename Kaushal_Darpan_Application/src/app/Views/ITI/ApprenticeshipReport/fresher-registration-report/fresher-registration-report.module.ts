import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { fresherRegistrationReportRoutingModule } from './fresher-registration-report-routing.module';
import { fresherRegistrationReportComponent } from './fresher-registration-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    fresherRegistrationReportComponent
  ],
  imports: [
    CommonModule,
    fresherRegistrationReportRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class fresherRegistrationReportModule { }
