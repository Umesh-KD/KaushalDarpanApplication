import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExaminerDispatchRevalVerifyRoutingModule } from './examiner-dispatch-reval-verify-routing.module';
import { ExaminerDispatchRevalVerifyComponent } from './examiner-dispatch-reval-verify.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ExaminerDispatchRevalVerifyComponent
  ],
  imports: [
    CommonModule,
    ExaminerDispatchRevalVerifyRoutingModule,
    FormsModule,
    TableSearchFilterModule, OTPModalModule
  ]
})
export class ExaminerDispatchRevalVerifyModule { }
