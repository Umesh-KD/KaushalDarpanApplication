import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchPrincipalGroupCodeListRoutingModule } from './DispatchPrincipalGroupCode-list-routing.module';
import { DispatchPrincipalGroupCodeListComponent } from './DispatchPrincipalGroupCode-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    DispatchPrincipalGroupCodeListComponent
  ],
  imports: [
    CommonModule,
    DispatchPrincipalGroupCodeListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,  OTPModalModule
  ]
})
export class DispatchPrincipalGroupCodeListModule { }
