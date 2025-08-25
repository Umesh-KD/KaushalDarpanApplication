import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObserverReportRoutingModule } from './observer-report-routing.module';
import { ObserverReportComponent } from './observer-report.component';


@NgModule({
  declarations: [
    ObserverReportComponent
  ],
  imports: [
    CommonModule,
    ObserverReportRoutingModule
  ]
})
export class ObserverReportModule { }
