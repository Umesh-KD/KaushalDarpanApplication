import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CenterSuperintendentStudentReportRoutingModule } from './CenterSuperintendentStudentReport-routing.module';
import { CenterSuperintendentStudentReportComponent } from './CenterSuperintendentStudentReport.component';
import { FormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';



@NgModule({
  declarations: [
    CenterSuperintendentStudentReportComponent
  ],
  imports: [
    CommonModule,
    CenterSuperintendentStudentReportRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class CenterSuperintendentStudentReportModule { }
