import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchPrincipalRevalGroupCodeListRoutingModule } from './DispatchPrincipalRevalGroupCode-list-routing.module';
import { DispatchPrincipalRevalGroupCodeListComponent } from './DispatchPrincipalRevalGroupCode-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    DispatchPrincipalRevalGroupCodeListComponent
  ],
  imports: [
    CommonModule,
    DispatchPrincipalRevalGroupCodeListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,  OTPModalModule
  ]
})
export class DispatchPrincipalRevalGroupCodeListModule { }
