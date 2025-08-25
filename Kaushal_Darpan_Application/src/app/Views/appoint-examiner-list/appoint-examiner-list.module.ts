import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderModule } from '../Shared/loader/loader.module';
import { AppointExaminerListRoutingModule } from './appoint-examiner-list.routing.module';
import { AppointExaminerListComponent } from './appoint-examiner-list.component';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';




@NgModule({
  declarations: [
    AppointExaminerListComponent
  ],
  imports: [
    CommonModule,
    AppointExaminerListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    CommonModule,
    TableSearchFilterModule
  ]
})
export class AppointExaminerListModule { }
