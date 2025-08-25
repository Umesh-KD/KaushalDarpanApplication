import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExaminerReportRoutingModule } from './examiner-report-routing.module';
import { ExaminerReportComponent } from './examiner-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { CollegeMasterRoutingModule } from '../CollegeMaster/college-master/college-master-routing.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ExaminerReportComponent
  ],
  imports: [
    CommonModule,
    ExaminerReportRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule,
    CollegeMasterRoutingModule, TableSearchFilterModule
  ]
})
export class ExaminerReportModule { }
