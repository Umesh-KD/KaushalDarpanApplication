import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabulationReportRoutingModule } from './tabulation-report-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabulationReportComponent } from './tabulation-report.component';


@NgModule({
  declarations: [
    TabulationReportComponent
  ],
  imports: [
    CommonModule,
    TabulationReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class TabulationReportModule { }
