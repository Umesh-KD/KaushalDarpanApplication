import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { RouterModule, Routes } from '@angular/router';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeacherHigherTechnicalEducationReportComponent } from './teacher-higher-technical-education-report.component';
import { TeacherHigherTechnicalEducationReportRoutingModule } from './teacher-higher-technical-education-report-routing.module';
import { ViewStaffProfileModalModule } from '../../BTER-GOVT-Establish-Management/view-staff-profile-modal/view-staff-profile-modal.model';

@NgModule({
  declarations: [
    TeacherHigherTechnicalEducationReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    TeacherHigherTechnicalEducationReportRoutingModule,
    OTPModalModule,
    MatTooltipModule,
    ViewStaffProfileModalModule,
  ]
})
export class TeacherHigherTechnicalEducationReportModule { }
