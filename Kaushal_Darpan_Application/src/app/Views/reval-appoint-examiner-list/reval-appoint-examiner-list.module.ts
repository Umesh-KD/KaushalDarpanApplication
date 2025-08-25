import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderModule } from '../Shared/loader/loader.module';
import { RevalAppointExaminerListRoutingModule } from './reval-appoint-examiner-list.routing.module';
import { RevalAppointExaminerListComponent } from './reval-appoint-examiner-list.component';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';




@NgModule({
  declarations: [
    RevalAppointExaminerListComponent
  ],
  imports: [
    CommonModule,
    RevalAppointExaminerListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    CommonModule,
    TableSearchFilterModule
  ]
})
export class RevalAppointExaminerListModule { }
