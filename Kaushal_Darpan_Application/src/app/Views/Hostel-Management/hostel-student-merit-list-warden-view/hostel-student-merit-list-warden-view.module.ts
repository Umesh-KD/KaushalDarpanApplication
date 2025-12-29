import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HostelStudentMeritListWardenViewComponent } from './hostel-student-merit-list-warden-view.component';
import { HostelStudentMeritListWardenViewRoutingModule } from './hostel-student-merit-list-warden-view-routing.module';


@NgModule({
  declarations: [
    HostelStudentMeritListWardenViewComponent
  ],
  imports: [
    CommonModule,
    HostelStudentMeritListWardenViewRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class HostelStudentMeritListWardenViewModule { }
