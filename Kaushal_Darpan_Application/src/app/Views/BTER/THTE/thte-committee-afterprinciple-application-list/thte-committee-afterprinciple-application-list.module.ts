import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { THTECommitteeafterPrincipleApplicationListComponent } from './thte-committee-afterprinciple-application-list.component';
import { THTECommitteeafterPrincipleApplicationListRoutingModule } from './thte-committee-afterprinciple-application-list-routing.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';
import { ViewStaffProfileModalModule } from '../../BTER-GOVT-Establish-Management/view-staff-profile-modal/view-staff-profile-modal.model';


@NgModule({
  declarations: [
    THTECommitteeafterPrincipleApplicationListComponent
  ],
  imports: [
    CommonModule,
    THTECommitteeafterPrincipleApplicationListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule,
    OTPModalModule,
    ViewStaffProfileModalModule,
  ]
})
export class THTECommitteeafterPrincipleApplicationListModule { }
