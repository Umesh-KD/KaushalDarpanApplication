import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentEnrollmentApprovalRejectRoutingModule } from './student-enrollment-approval-reject-routing.module';
import { StudentEnrollmentApprovalRejectComponent } from './student-enrollment-approval-reject.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';



@NgModule({
  declarations: [
    StudentEnrollmentApprovalRejectComponent
  ],
  imports: [
    CommonModule,
    StudentEnrollmentApprovalRejectRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
  ]
})
export class StudentEnrollmentApprovalRejectModule { }
