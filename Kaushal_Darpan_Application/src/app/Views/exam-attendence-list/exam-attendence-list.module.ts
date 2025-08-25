import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamAttendenceListRoutingModule } from './exam-attendence-list-routing.module';
import { ExamAttendenceListComponent } from './exam-attendence-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ExamAttendenceListComponent
  ],
  imports: [
    CommonModule,
    ExamAttendenceListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ExamAttendenceListModule { }
