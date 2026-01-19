import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointexaminerreportRoutingModule } from './iti-appoint-examiner-report-routing.module';
import { AppointexaminerreportComponent } from './iti-appoint-examiner-report.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [
    AppointexaminerreportComponent
  ],
  imports: [
    CommonModule,
    AppointexaminerreportRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule,
    MaterialModule,
    NgxMatSelectSearchModule

  ]
})
export class AppointexaminerreportModule { }
