import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SetExamAttendanceComponent } from './set-exam-attendance.component';
import { SetExamAttendanceRoutingModule } from './set-exam-attendance-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    SetExamAttendanceComponent
  ],
  imports: [
    CommonModule,
    SetExamAttendanceRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    ScrollingModule, NgSelectModule, MaterialModule
  ], providers: [TableSearchFilterModule]
})
export class SetExamAttendanceModule { }
