import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIReceivedDispatchGroupRoutingModule } from './iti-received-dispatch-group-routing.module';
import { ITIReceivedDispatchGroupComponent } from './iti-received-dispatch-group.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ITIReceivedDispatchGroupComponent
  ],
  imports: [
    CommonModule,
    ITIReceivedDispatchGroupRoutingModule,
    FormsModule,
    TableSearchFilterModule, OTPModalModule
  ]
})
export class ITIReceivedDispatchGroupModule { }
