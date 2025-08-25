import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiPromoteStudentRoutingModule } from './iti-promote-student-routing.module';
import { ItiPromoteStudentComponent } from './iti-promote-student.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ItiPromoteStudentComponent
  ],
  imports: [
    CommonModule,
    ItiPromoteStudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class ItiPromoteStudentModule { }
