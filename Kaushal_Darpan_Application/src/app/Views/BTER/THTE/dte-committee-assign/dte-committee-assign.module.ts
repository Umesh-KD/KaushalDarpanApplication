import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { RouterModule, Routes } from '@angular/router';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DTECommitteeAssignComponent } from './dte-committee-assign.component';
import { DTECommitteeAssignRoutingModule } from './dte-committee-assign-routing.module';
import { ViewStaffProfileModalModule } from '../../BTER-GOVT-Establish-Management/view-staff-profile-modal/view-staff-profile-modal.model';

@NgModule({
  declarations: [
    DTECommitteeAssignComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    DTECommitteeAssignRoutingModule,
    OTPModalModule,
    MatTooltipModule,
    ViewStaffProfileModalModule,
  ]
})
export class DTECommitteeAssignModule { }
