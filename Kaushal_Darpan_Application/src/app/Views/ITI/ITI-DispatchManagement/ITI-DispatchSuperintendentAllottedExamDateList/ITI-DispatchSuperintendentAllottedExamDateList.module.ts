import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIDispatchSuperintendentAllottedExamDateListRoutingModule } from './ITI-DispatchSuperintendentAllottedExamDateList-routing.module';
import { ITIDispatchSuperintendentAllottedExamDateListComponent } from './ITI-DispatchSuperintendentAllottedExamDateList.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ITIDispatchSuperintendentAllottedExamDateListComponent
  ],
  imports: [
    CommonModule,
    ITIDispatchSuperintendentAllottedExamDateListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot(), OTPModalModule
  ]
})
export class ITIDispatchSuperintendentAllottedExamDateListModule { }
