import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignPracticalExaminerRoutingModule } from './assign-practical-examiner-routing.module';
import { AssignPracticalExaminerComponent } from './assign-practical-examiner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    AssignPracticalExaminerComponent
  ],
  imports: [
    CommonModule,
    AssignPracticalExaminerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    OTPModalModule
  ]
})
export class AssignPracticalExaminerModule { }
