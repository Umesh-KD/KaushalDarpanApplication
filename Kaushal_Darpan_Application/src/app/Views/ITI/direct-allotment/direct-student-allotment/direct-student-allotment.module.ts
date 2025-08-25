import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifyStudentAllotRoutingModule } from './direct-student-allotment-routing.module';
import { VerifyStudentAllotComponent } from './direct-student-allotment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';

@NgModule({
  declarations: [
    VerifyStudentAllotComponent
  ],
  imports: [
    CommonModule,
    VerifyStudentAllotRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule, OTPModalModule
  ]
})
export class VerifyStudentAllotModule { }
