import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoomReportRoutingModule } from './guest-room-report-routing.module';
import { GuestRoomReportComponent } from './guest-room-report.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GuestRoomReportComponent
  ],
  imports: [
    CommonModule,
    GuestRoomReportRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class GuestRoomReportModule { }
