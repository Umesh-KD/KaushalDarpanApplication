import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuaterWorkshopReportRoutingModule } from './quater-workshop-report-routing.module';
import { QuaterWorkshopReportComponent } from './quater-workshop-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    QuaterWorkshopReportComponent
  ],
  imports: [
    CommonModule,
    QuaterWorkshopReportRoutingModule,
    FormsModule,
    TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class QuaterWorkshopReportModule { }
