import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectAdmissionApplyRoutingModule } from './direct-admission-apply-routing.module';
import { DirectAdmissionApplyComponent } from './direct-admission-apply.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { StudentStatusHistoryModule } from '../../Student/student-status-history/student-status-history.module';


@NgModule({
  declarations: [
    DirectAdmissionApplyComponent
  ],
  imports: [
    CommonModule,
    DirectAdmissionApplyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StudentStatusHistoryModule,
    TableSearchFilterModule
  ]
})
export class DirectAdmissionApplyModule { }
