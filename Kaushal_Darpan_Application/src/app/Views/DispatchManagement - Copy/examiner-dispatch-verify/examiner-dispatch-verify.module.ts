import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExaminerDispatchVerifyRoutingModule } from './examiner-dispatch-verify-routing.module';
import { ExaminerDispatchVerifyComponent } from './examiner-dispatch-verify.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ExaminerDispatchVerifyComponent
  ],
  imports: [
    CommonModule,
    ExaminerDispatchVerifyRoutingModule,
    FormsModule,
    TableSearchFilterModule, OTPModalModule
  ]
})
export class ExaminerDispatchVerifyModule { }
