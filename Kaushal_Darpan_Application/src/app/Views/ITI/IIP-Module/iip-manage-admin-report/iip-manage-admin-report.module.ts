import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IIPManageAdminReportRoutingModule } from './iip-manage-admin-report-routing.module';
import { IIPManageAdminReportComponent } from './iip-manage-admin-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    IIPManageAdminReportComponent
  ],
  imports: [
    CommonModule,
    IIPManageAdminReportRoutingModule,
    //ITIIIPManageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class IIPManageAdminReportModule { }
