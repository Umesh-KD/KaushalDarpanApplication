import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRequestListRoutingModule } from './student-request-list-routing.module';
import { StudentRequestListComponent } from './student-request-list.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StudentRequestListComponent
  ],
  imports: [
    CommonModule,
    StudentRequestListRoutingModule,
    FormsModule, ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class StudentRequestListModule { }
