import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { dashboardIssueTrackerRoutingModule } from './dashboard-issue-tracker.routing.module';
import { dashboardIssueTrackerComponent } from './dashboard-issue-tracker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { LoaderModule } from '../Shared/loader/loader.module';
import { PlacementDashboardModule } from '../placement-dashboard/placement-dashboard.module';
import { PrincipleDashboardModule } from '../principle-dashboard/principle-dashboard.module';
import { StudentDashboardModule } from '../student-dashboard/student-dashboard.module';
import { StaffDashboardModule } from '../staff-dashboard/staff-dashboard.module';
import { AdminDashboardITIModule } from '../ITI/admin-dashboard-iti/admin-dashboard-iti.module'
import { CopyCheckerDashboardModule } from '../CopyChecker/copy-checker-dashboard/copy-checker-dashboard.module';

import { DTEDashboardModule } from '../dte-dashboard/dte-dashboard.module';
import { MaterialModule } from '../../material.module';
import { EmitraDashboardModule } from '../Emitra/emitra-dashboard/emitra-dashboard.module';
import { VerifierDashboardComponent } from '../verifier-dashboard/verifier-dashboard.component';
import { VerifierDashboardModule } from '../verifier-dashboard/verifier-dashboard.module';
import { CollegeDashboardModule } from '../college-dashboard/college-dashboard.module';

import { PrincipalDashboardITIModule } from '../ITI/principal-dashboard-iti/principal-dashboard-iti.module';


import { ITITeacherDashboardModule } from '../ITI/iti-teacher-dashboard/iti-teacher-dashboard.module';
import { HostelDashboardModule } from '../Hostel-Management/hostel-dashboard/hostel-dashboard.module';
import { ExaminerInchargeDashboardModule } from '../examiner-incharge-dashboard/examiner-incharge-dashboard.module'
import { GuestRoomDashboardModule } from '../GuestRoom-Management/guestroom-dashboard/guestroom-dashboard.module';
import { AdminDashboardSCVTModule } from '../ITI/admin-dashboard-scvt/admin-dashboard-scvt.module';
import { ItiExaminerDashboardModule } from '../ITI/Examination/ITI_Examiner/iti-examiner-dashboard/iti-examiner-dashboard.module';
import { RegistrarDashboardModule } from '../registrar-dashboard/registrar-dashboard.module';
import { SecretaryJDDashboardModule } from '../secretary-jd-dashboard/secretary-jd-dashboard.module';
import { SecretaryJdConfidentialDashboardModule } from '../secretary-jd-confidential-dashboard/secretary-jd-confidential-dashboard.module';
import { ITIRegistrarDashboardModule } from '../ITI/iti-registrar-dashboard/iti-registrar-dashboard.module';
import { ITISecretaryJDDashboardModule } from '../ITI/iti-secretary-jd-dashboard/secretary-jd-dashboard.module';
import { ITIPaperSetterProfessorDashboardModule } from '../ITI/itipapper-setter/itipaper-setter-professor-dashboard/itipaper-setter-professor-dashboard.module';
import { CollegeDashboardITIModule } from '../ITI/college-dashboard-iti/college-dashboard-iti.module';
import { BterDashboardModule } from '../BTER/bter-dashboard/bter-dashboard.module';
import { NodalDashboardModule } from '../BTER/nodal/nodal-dashboard/nodal-dashboard.module';
import { NodalVerifierDashboardModule } from '../BTER/nodal/verifier/verifier-dashboard/dte-nodal-dashboard.module';
import { AdminDashboardNcvtModule } from '../ITI/admin-dashboard-ncvt/admin-dashboard-ncvt.module';
import { ACPDashboardModule } from '../BTER/acp-dashboard/acp-dashboard.module';
import { IssuetrackerDashboardModule } from '../BTER/IssueTracker-dashboard/issuetracker-dashboard.module';




@NgModule({
  declarations: [
    dashboardIssueTrackerComponent,
  ],
  imports: [
    CommonModule,
    dashboardIssueTrackerRoutingModule,

  ], exports: [dashboardIssueTrackerComponent]
})
export class dashboardIssueTrackerModule { }
