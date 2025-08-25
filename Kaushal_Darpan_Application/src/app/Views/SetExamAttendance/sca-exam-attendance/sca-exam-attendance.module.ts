import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';
import { SCAExamAttendanceComponent } from './sca-exam-attendance.component';
import { SCAExamAttendanceRoutingModule } from './sca-exam-attendance-routing.module';


@NgModule({
  declarations: [
    SCAExamAttendanceComponent
  ],
  imports: [
    CommonModule,
    SCAExamAttendanceRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    ScrollingModule, NgSelectModule, MaterialModule
  ], providers: [TableSearchFilterModule]
})
export class SCAExamAttendanceModule { }
