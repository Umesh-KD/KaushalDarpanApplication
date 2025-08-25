import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentjanaadharReportRoutingModule } from './studentjanaadhar-report-routing.module';
import { StudentjanaadharReportComponent } from './studentjanaadhar-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    StudentjanaadharReportComponent
  ],
  imports: [
    CommonModule,
    StudentjanaadharReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    MaterialModule,
  ]
})
export class StudentjanaadharReportModule { }
