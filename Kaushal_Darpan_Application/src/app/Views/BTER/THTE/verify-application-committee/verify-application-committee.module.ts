import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';
import { VerifyApplicationCommitteeComponent } from './verify-application-committee.component';
import { VerifyApplicationCommitteeRoutingModule } from './verify-application-committee-routing.module';
import { ViewStaffProfileModalModule } from '../../BTER-GOVT-Establish-Management/view-staff-profile-modal/view-staff-profile-modal.model';


@NgModule({
  declarations: [
    VerifyApplicationCommitteeComponent
  ],
  imports: [
    CommonModule,
    VerifyApplicationCommitteeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule,
    OTPModalModule,
    ViewStaffProfileModalModule,
  ]
})
export class VerifyApplicationCommitteeModule { }
