import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrincipalDispatchGroupRoutingModule } from './principal-dispatch-group-routing.module';
import { PrincipalDispatchGroupComponent } from './principal-dispatch-group.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    PrincipalDispatchGroupComponent
  ],
  imports: [
    CommonModule,
    PrincipalDispatchGroupRoutingModule,
    TableSearchFilterModule,
    FormsModule,
    ReactiveFormsModule,  OTPModalModule
  ]
})
export class PrincipalDispatchGroupModule { }
