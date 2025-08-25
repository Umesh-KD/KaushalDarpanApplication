import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';
import { UnlockExamAttendanceComponent } from './unlock-exam-attendance.component';
import { UnlockExamAttendanceRoutingModule } from './unlock-exam-attendance-routing.module';


@NgModule({
  declarations: [
    UnlockExamAttendanceComponent
  ],
  imports: [
    CommonModule,
    UnlockExamAttendanceRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    ScrollingModule, NgSelectModule, MaterialModule
  ], providers: [TableSearchFilterModule]
})
export class UnlockExamAttendanceModule { }
