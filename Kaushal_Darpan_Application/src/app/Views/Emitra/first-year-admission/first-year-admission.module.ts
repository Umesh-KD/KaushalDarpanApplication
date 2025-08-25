import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FirstYearAdmissionRoutingModule } from './first-year-admission-routing.module';
import { FirstYearAdmissionComponent } from './first-year-admission.component';


@NgModule({
  declarations: [
    FirstYearAdmissionComponent
  ],
  imports: [
    CommonModule,
    FirstYearAdmissionRoutingModule
  ]
})
export class FirstYearAdmissionModule { }
