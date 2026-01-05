import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvigilatorAttandanceReportRoutingModule } from './invigilator-attandance-report-routing.module';
import { InvigilatorAttandanceReportComponent } from './invigilator-attandance-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    InvigilatorAttandanceReportComponent
  ],
  imports: [
    CommonModule,
    InvigilatorAttandanceReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class InvigilatorAttandanceReportModule { }





  
