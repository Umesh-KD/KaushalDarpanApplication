import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

import { AddStudentRoutingModule } from './add-student-routing.module';
import { AddStudentComponent } from './add-student.component';


@NgModule({
  declarations: [
    AddStudentComponent
  ],
  imports: [
    CommonModule,
    AddStudentRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class AddStudentModule { }
