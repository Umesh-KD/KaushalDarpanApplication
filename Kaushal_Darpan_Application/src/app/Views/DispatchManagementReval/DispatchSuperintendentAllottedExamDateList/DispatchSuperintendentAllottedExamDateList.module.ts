import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchSuperintendentAllottedExamDateListRoutingModule } from './DispatchSuperintendentAllottedExamDateList-routing.module';
import { DispatchSuperintendentAllottedExamDateListComponent } from './DispatchSuperintendentAllottedExamDateList.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    DispatchSuperintendentAllottedExamDateListComponent
  ],
  imports: [
    CommonModule,
    DispatchSuperintendentAllottedExamDateListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot(), OTPModalModule
  ]
})
export class DispatchSuperintendentAllottedExamDateListModule { }
