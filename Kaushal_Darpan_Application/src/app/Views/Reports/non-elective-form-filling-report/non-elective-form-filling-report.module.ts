import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NonElectiveFormFillingReportComponent } from './non-elective-form-filling-report.component';
import { NonElectiveFormFillingReportRoutingModule } from './non-elective-form-filling-report-routing.module';


@NgModule({
  declarations: [
    NonElectiveFormFillingReportComponent
  ],
  imports: [
    CommonModule,
    NonElectiveFormFillingReportRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class NonElectiveFormFillingReportModule { }
