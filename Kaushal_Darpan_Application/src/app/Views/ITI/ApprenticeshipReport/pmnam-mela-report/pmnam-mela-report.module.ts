import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { PMNAMMelaReportBeforeAfterRoutingModule } from './pmnam-mela-report-routing.module';
import { PmnamMelaReportComponent } from './pmnam-mela-report.component';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';



@NgModule({
  declarations: [
    PmnamMelaReportComponent
  ],
  imports: [
    CommonModule,
    PMNAMMelaReportBeforeAfterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class PmnamMelaReportModule { }
