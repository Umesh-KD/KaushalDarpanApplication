import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRevalGroupCodeReceivedlistRoutingModule } from './AdminRevalGroupCodeReceived-list-routing.module';
import { AdminRevalGroupCodeReceivedlistComponent } from './AdminRevalGroupCodeReceived-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    AdminRevalGroupCodeReceivedlistComponent
  ],
  imports: [
    CommonModule,
    AdminRevalGroupCodeReceivedlistRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,  OTPModalModule
  ]
})
export class AdminRevalGroupCodeReceivedlistModule { }
