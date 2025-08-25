import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITITeacherDashboardRoutingModule } from './iti-teacher-dashboard-routing.module';
import { ITITeacherDashboardComponent } from './iti-teacher-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { PlacementDashboardModule } from '../../placement-dashboard/placement-dashboard.module';
import { PrincipleDashboardModule } from '../../principle-dashboard/principle-dashboard.module';
import { StudentDashboardModule } from '../../student-dashboard/student-dashboard.module';
import { StaffDashboardModule } from '../../staff-dashboard/staff-dashboard.module';
import { AdminDashboardITIModule } from '../../ITI/admin-dashboard-iti/admin-dashboard-iti.module'
import { CopyCheckerDashboardModule } from '../../CopyChecker/copy-checker-dashboard/copy-checker-dashboard.module';

import { DTEDashboardModule } from '../../dte-dashboard/dte-dashboard.module';
import { MaterialModule } from '../../../material.module';
import { EmitraDashboardModule } from '../../Emitra/emitra-dashboard/emitra-dashboard.module';
import { VerifierDashboardComponent } from '../../verifier-dashboard/verifier-dashboard.component';
import { VerifierDashboardModule } from '../../verifier-dashboard/verifier-dashboard.module';
import { CollegeDashboardModule } from '../../college-dashboard/college-dashboard.module';



@NgModule({
  declarations: [
    ITITeacherDashboardComponent
  ],
  imports: [
    CommonModule,
    ITITeacherDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    PlacementDashboardModule,
    PrincipleDashboardModule,
    StudentDashboardModule,
    StaffDashboardModule,
    AdminDashboardITIModule, CollegeDashboardModule,
    CopyCheckerDashboardModule,
    DTEDashboardModule,
    MaterialModule,
    EmitraDashboardModule,
    VerifierDashboardModule
  ],
  
  exports: [ITITeacherDashboardComponent]
})
export class ITITeacherDashboardModule { }
