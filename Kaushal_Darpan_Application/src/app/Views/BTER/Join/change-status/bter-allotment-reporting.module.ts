import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BterAllotmentReportingRoutingModule } from './bter-allotment-reporting-routing.module';
import { BterAllotmentReportingComponent } from './bter-allotment-reporting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BterAllotmentReportingComponent
  ],
  imports: [
    CommonModule,
    BterAllotmentReportingRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BterAllotmentReportingModule { }
