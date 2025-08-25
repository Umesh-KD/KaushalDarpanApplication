import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BterEstablishManagementReportRoutingModule } from './bter-establish-management-report-routing.module';
import { BterEstablishManagementReportComponent } from './bter-establish-management-report.component';


@NgModule({
  declarations: [
    BterEstablishManagementReportComponent
  ],
  imports: [
    CommonModule,
    BterEstablishManagementReportRoutingModule
  ]
})
export class BterEstablishManagementReportModule { }
