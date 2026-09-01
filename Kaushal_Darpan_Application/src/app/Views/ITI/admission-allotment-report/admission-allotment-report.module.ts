import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AdmissionAllotmentReportComponent } from './admission-allotment-report.component';
import { AdmissionAllotmentReportRoutingModule } from './admission-allotment-report.routing.module';
import { DataTableModule } from '../../../Common/data-table/data-table.module';

@NgModule({
  declarations: [
    AdmissionAllotmentReportComponent
  ],
  imports: [
    CommonModule,
    AdmissionAllotmentReportRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,DataTableModule
  ]
})
export class AdmissionAllotmentReportModule { }
