import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NodalWorkshopReportRoutingModule } from './nodal-workshop-report-routing.module';
import { NodalWorkshopReportComponent } from './nodal-workshop-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    NodalWorkshopReportComponent
  ],
  imports: [
    CommonModule,
    NodalWorkshopReportRoutingModule,
    FormsModule,
    ReactiveFormsModule, TableSearchFilterModule
  ]
})
export class NodalWorkshopReportModule { }
