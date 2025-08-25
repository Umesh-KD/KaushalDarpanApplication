import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {DispatchSuperintendentDetailsListRoutingModule } from './DispatchSuperintendentDetailsList-routing.module';
import { DispatchSuperintendentDetailsListComponent } from './DispatchSuperintendentDetailsList.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
   DispatchSuperintendentDetailsListComponent
  ],
  imports: [
    CommonModule,
    DispatchSuperintendentDetailsListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot(), OTPModalModule
  ]
})
export class DispatchSuperintendentDetailsListModule { }
