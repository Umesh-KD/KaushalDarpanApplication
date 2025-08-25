import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherWiseReportRoutingModule } from './teacher-wise-report-routing.module';
import { TeacherWiseReportComponent } from './teacher-wise-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    TeacherWiseReportComponent
  ],
  imports: [
    CommonModule,
    TeacherWiseReportRoutingModule,FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class TeacherWiseReportModule { }
