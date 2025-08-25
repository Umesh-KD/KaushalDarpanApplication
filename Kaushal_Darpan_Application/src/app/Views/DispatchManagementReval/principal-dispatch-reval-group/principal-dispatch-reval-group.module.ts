import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrincipalDispatchRevalGroupRoutingModule } from './principal-dispatch-reval-group-routing.module';
import { PrincipalDispatchRevalGroupComponent } from './principal-dispatch-reval-group.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    PrincipalDispatchRevalGroupComponent
  ],
  imports: [
    CommonModule,
    PrincipalDispatchRevalGroupRoutingModule,
    TableSearchFilterModule,
    FormsModule,
    ReactiveFormsModule,  OTPModalModule
  ]
})
export class PrincipalDispatchRevalGroupModule { }
