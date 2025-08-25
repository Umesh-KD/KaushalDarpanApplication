import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIDispatchSuperintendentListRoutingModule } from './ITI-DispatchSuperintendentList-routing.module';
import { ITIDispatchSuperintendentListComponent } from './ITI-DispatchSuperintendentList.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ITIDispatchSuperintendentListComponent
  ],
  imports: [
    CommonModule,
    ITIDispatchSuperintendentListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot(), OTPModalModule
  ]
})
export class ITIDispatchSuperintendentListModule { }
