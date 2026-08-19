import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmissionDynamicReportRoutingModule } from './admission-dynamic-report-routing.module';
import { AdmissionDynamicReportComponent } from './admission-dynamic-report.component';
import { routes } from '../../../routes';
import { RouterModule } from '@angular/router';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdmissionDynamicReportComponent
  ],
  imports: [
    CommonModule,
    AdmissionDynamicReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    RouterModule.forChild(routes)
  ]
})
export class AdmissionDynamicReportModule { }
