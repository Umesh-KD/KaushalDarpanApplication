import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIFeesPerYearListRoutingModule } from './itifees-per-year-list-routing.module';
import { ITIFeesPerYearListComponent } from './itifees-per-year-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ITIFeesPerYearListComponent
  ],
  imports: [
    CommonModule,
    ITIFeesPerYearListRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    OTPModalModule
  ]
})
export class ITIFeesPerYearListModule { }
