import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIExaminerDispatchVerifyRoutingModule } from './ITI-Examiner-Dispatch-Verify-routing.module';
import { ITIExaminerDispatchVerifyComponent } from './ITI-Examiner-Dispatch-Verify.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ITIExaminerDispatchVerifyComponent
  ],
  imports: [
    CommonModule,
    ITIExaminerDispatchVerifyRoutingModule,
    FormsModule,
    TableSearchFilterModule, OTPModalModule
  ]
})
export class ITIExaminerDispatchVerifyModule { }
