import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from "../../Shared/loader/loader.module";
import { VerifyTimeTableComponent } from './verify-time-table.component';
import { VerifyTimeTableRoutingModule } from './verify-time-table-routing.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    VerifyTimeTableComponent,

  ],
  imports: [
    CommonModule,
    VerifyTimeTableRoutingModule,
    TableSearchFilterModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    OTPModalModule
  ]
})
export class VerifyTimeTableModule { }
