import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { RouterModule, Routes } from '@angular/router';
import { EnrolledStudentVerificationComponent } from './enrolled-student-verification.component';
import { OTPModalModule } from '../otpmodal/otpmodal.module';
import { EnrolledStudentVerificationRoutingModule } from './enrolled-student-verification-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    EnrolledStudentVerificationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    EnrolledStudentVerificationRoutingModule,
    OTPModalModule,
    MatTooltipModule
  ]
})
export class EnrolledStudentVerificationModule { }
