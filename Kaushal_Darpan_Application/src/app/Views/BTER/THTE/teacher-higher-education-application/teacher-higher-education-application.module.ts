import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { RouterModule, Routes } from '@angular/router';
import { TeacherHigherEducationApplicationComponent } from './teacher-higher-education-application.component';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';
import { TeacherHigherEducationApplicationRoutingModule } from './teacher-higher-education-application-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    TeacherHigherEducationApplicationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    TeacherHigherEducationApplicationRoutingModule,
    OTPModalModule,
    MatTooltipModule
  ]
})
export class TeacherHigherEducationApplicationModule { }
