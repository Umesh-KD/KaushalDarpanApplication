import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMCAllotmentReportRoutingModule } from './imc-allotment-report-routing.module';
import { IMCAllotmentReportComponent } from './imc-allotment-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    IMCAllotmentReportComponent
  ],
  imports: [
    CommonModule,
    IMCAllotmentReportRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class IMCAllotmentReportModule { }
