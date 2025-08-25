import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchSuperintendentListRoutingModule } from './DispatchSuperintendentList-routing.module';
import { DispatchSuperintendentListComponent } from './DispatchSuperintendentList.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    DispatchSuperintendentListComponent
  ],
  imports: [
    CommonModule,
    DispatchSuperintendentListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot(), OTPModalModule
  ]
})
export class DispatchSuperintendentListModule { }
