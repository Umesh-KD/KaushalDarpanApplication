import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstitutejanaadharReportRoutingModule } from './institutejanaadhar-report-routing.module';
import { InstitutejanaadharReportComponent } from './institutejanaadhar-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    InstitutejanaadharReportComponent
  ],
  imports: [
    CommonModule,
    InstitutejanaadharReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    MaterialModule,
  ]
})
export class InstitutejanaadharReportModule { }
