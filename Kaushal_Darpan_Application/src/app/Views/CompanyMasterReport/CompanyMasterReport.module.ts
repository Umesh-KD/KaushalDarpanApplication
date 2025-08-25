import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyMasterReportRoutingModule } from './CompanyMasterReport-routing.module';
import { CompanyMasterReportComponent } from './CompanyMasterReport.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    CompanyMasterReportComponent
  ],
  imports: [
    CommonModule,
    CompanyMasterReportRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class CompanyMasterReportModule { }
