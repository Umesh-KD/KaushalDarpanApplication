import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ITIInspectionReportComponent } from './iti-inspection-report.component';
import { ITIInspectionReportRoutingModule } from './iti-inspection-report-routing.module';

@NgModule({
  declarations: [
    ITIInspectionReportComponent
  ],
  imports: [
    CommonModule,
    ITIInspectionReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ITIInspectionReportModule { }
