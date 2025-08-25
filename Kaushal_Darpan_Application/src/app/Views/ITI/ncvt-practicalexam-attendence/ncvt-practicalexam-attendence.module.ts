import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NcvtPracticalexamAttendenceRoutingModule } from './ncvt-practicalexam-attendence-routing.module';
import { NcvtPracticalexamAttendenceComponent } from './ncvt-practicalexam-attendence.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    NcvtPracticalexamAttendenceComponent
  ],
  imports: [
    CommonModule,
    NcvtPracticalexamAttendenceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule 
  ]
})
export class NcvtPracticalexamAttendenceModule { }
