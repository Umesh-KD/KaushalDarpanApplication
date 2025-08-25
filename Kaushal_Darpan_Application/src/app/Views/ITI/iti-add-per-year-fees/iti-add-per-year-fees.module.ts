import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiAddPerYearFeesRoutingModule } from './iti-add-per-year-fees-routing.module';
import { ItiAddPerYearFeesComponent } from './iti-add-per-year-fees.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ItiAddPerYearFeesComponent
  ],
  imports: [
    CommonModule,
    ItiAddPerYearFeesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    OTPModalModule
  ]
})
export class ItiAddPerYearFeesModule { }
