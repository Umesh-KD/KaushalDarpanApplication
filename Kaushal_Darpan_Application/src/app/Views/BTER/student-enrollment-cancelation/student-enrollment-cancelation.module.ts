import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentEnrollmentCancelationRoutingModule } from './student-enrollment-cancelation-routing.module';
import { StudentEnrollmentCancelationComponent } from './student-enrollment-cancelation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    StudentEnrollmentCancelationComponent
  ],
  imports: [
    CommonModule,
    StudentEnrollmentCancelationRoutingModule,
    LoaderModule,
    FormsModule, TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class StudentEnrollmentCancelationModule { }
