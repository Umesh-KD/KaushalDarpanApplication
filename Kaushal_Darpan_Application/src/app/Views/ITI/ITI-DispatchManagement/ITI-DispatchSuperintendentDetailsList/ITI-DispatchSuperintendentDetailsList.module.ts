import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIDispatchSuperintendentDetailsListRoutingModule } from './ITI-DispatchSuperintendentDetailsList-routing.module';
import { ITIDispatchSuperintendentDetailsListComponent } from './ITI-DispatchSuperintendentDetailsList.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ITIDispatchSuperintendentDetailsListComponent
  ],
  imports: [
    CommonModule,
    ITIDispatchSuperintendentDetailsListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot(), OTPModalModule
  ]
})
export class ITIDispatchSuperintendentDetailsListModule { }
