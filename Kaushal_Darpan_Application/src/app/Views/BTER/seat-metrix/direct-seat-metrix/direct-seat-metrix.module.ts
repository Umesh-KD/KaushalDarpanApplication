import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BTERSeatMetrixListRoutingModule } from './direct-seat-metrix-routing.module';
import { BTERSeatMetrixListComponent } from './direct-seat-metrix.component';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
   BTERSeatMetrixListComponent
  ],
  imports: [
    CommonModule,
    BTERSeatMetrixListRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule, OTPModalModule
  ]
})
export class BTERSeatMetrixListModule { }
