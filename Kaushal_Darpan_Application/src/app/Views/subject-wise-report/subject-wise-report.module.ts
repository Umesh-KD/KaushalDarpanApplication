import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectWiseReportRoutingModule } from './subject-wise-report-routing.module';
import { SubjectWiseReportComponent } from './subject-wise-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    SubjectWiseReportComponent
  ],
  imports: [
    CommonModule,
    SubjectWiseReportRoutingModule, FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class SubjectWiseReportModule { }
