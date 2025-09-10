import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportedStudentReportRoutingModule } from './report-for-admin-routing.module';
import { ReportedStudentReportComponent } from './report-for-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ReportedStudentReportComponent
  ],
  imports: [
    CommonModule,
    ReportedStudentReportRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class ReportedStudentReportModule { }
