import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeTableRoutingModule } from './time-table-routing.module';
import { TimeTableComponent } from './time-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from "../../Shared/loader/loader.module";
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    TimeTableComponent
  ],
  imports: [
    CommonModule,
    TimeTableRoutingModule,
    TableSearchFilterModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    OTPModalModule
  ]
})
export class TimeTableModule { }
