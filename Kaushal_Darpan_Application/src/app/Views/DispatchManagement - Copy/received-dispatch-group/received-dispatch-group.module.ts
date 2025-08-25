import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceivedDispatchGroupRoutingModule } from './received-dispatch-group-routing.module';
import { ReceivedDispatchGroupComponent } from './received-dispatch-group.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ReceivedDispatchGroupComponent
  ],
  imports: [
    CommonModule,
    ReceivedDispatchGroupRoutingModule,
    FormsModule,
    TableSearchFilterModule, OTPModalModule
  ]
})
export class ReceivedDispatchGroupModule { }
