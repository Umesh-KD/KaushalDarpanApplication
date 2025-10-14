import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NcvtAdmissionStudentListRoutingModule } from './ncvt-admission-student-list-routing.module';
import { NcvtAdmissionStudentListComponent } from './ncvt-admission-student-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    NcvtAdmissionStudentListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    NcvtAdmissionStudentListRoutingModule
  ]
})
export class NcvtAdmissionStudentListModule { }
