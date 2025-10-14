import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { RouterModule, Routes } from '@angular/router';
import { TeacherHigherEducationApplicationVerificationComponent } from './teacher-higher-education-application-Verification.component';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';
import { TeacherHigherEducationApplicationVerificationRoutingModule } from './teacher-higher-education-application-Verification-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    TeacherHigherEducationApplicationVerificationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    TeacherHigherEducationApplicationVerificationRoutingModule,
    OTPModalModule,
    MatTooltipModule
  ]
})
export class TeacherHigherEducationApplicationVerificationModule { }
