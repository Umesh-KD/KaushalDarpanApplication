import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JailAdmissionApplyRoutingModule } from './jail-admission-apply-routing.module';
import { JailAdmissionApplyComponent } from './jail-admission-apply.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';


@NgModule({
  declarations: [
    JailAdmissionApplyComponent
  ],
  imports: [
    CommonModule,
    JailAdmissionApplyRoutingModule,
    FormsModule,
    ReactiveFormsModule
    , TableSearchFilterModule,
    StudentStatusHistoryModule
  ]
})
export class JailAdmissionApplyModule { }
