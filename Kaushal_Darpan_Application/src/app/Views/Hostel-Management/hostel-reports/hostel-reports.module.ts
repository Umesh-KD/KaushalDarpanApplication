import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HostelReportsRoutingModule } from './hostel-reports-routing.module';
import { HostelReportsComponent } from './hostel-reports.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HostelReportsComponent
  ],
  imports: [
    CommonModule,
    HostelReportsRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class HostelReportsModule { }
