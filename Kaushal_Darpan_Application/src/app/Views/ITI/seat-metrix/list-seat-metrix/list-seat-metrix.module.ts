import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListSeatMetrixRoutingModule } from './list-seat-metrix-routing.module';
import { ListSeatMetrixComponent } from './list-seat-metrix.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ListSeatMetrixComponent
  ],
  imports: [
    CommonModule,
    ListSeatMetrixRoutingModule,    
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule, OTPModalModule
  ]
})
export class ListSeatMetrixModule { }
