import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolytechnicReportRoutingModule } from './polytechnic-report-routing.module';
import { PolytechnicReportComponent } from './polytechnic-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { CollegeMasterRoutingModule } from '../CollegeMaster/college-master/college-master-routing.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    PolytechnicReportComponent
  ],
  imports: [
    CommonModule,
    PolytechnicReportRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule,
    CollegeMasterRoutingModule, TableSearchFilterModule
  ]
})
export class PolytechnicReportModule { }
