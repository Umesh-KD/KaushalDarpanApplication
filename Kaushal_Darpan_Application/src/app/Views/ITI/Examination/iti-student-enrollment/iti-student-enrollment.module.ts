import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiStudentEnrollmentRoutingModule } from './iti-student-enrollment-routing.module';
import { ItiStudentEnrollmentComponent } from './iti-student-enrollment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ItiStudentEnrollmentComponent
  ],
  imports: [
    CommonModule,
    ItiStudentEnrollmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule
  ] 
})
export class ItiStudentEnrollmentModule { }
