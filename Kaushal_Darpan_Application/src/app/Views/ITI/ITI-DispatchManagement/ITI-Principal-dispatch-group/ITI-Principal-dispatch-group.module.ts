import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIPrincipalDispatchGroupRoutingModule } from './ITI-Principal-dispatch-group-routing.module';
import { ITIPrincipalDispatchGroupComponent } from './ITI-Principal-dispatch-group.component';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ITIPrincipalDispatchGroupComponent
  ],
  imports: [
    CommonModule,
    ITIPrincipalDispatchGroupRoutingModule,
    TableSearchFilterModule,
    FormsModule,
    ReactiveFormsModule,  OTPModalModule
  ]
})
export class ITIPrincipalDispatchGroupModule { }
