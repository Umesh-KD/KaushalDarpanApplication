import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { THTEApplicationDteListComponent } from './thte-application-dte-list.component';
import { THTEApplicationDteListRoutingModule } from './thte-application-dte-list-routing.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';
import { ViewStaffProfileModalModule } from '../../BTER-GOVT-Establish-Management/view-staff-profile-modal/view-staff-profile-modal.model';


@NgModule({
  declarations: [
    THTEApplicationDteListComponent
  ],
  imports: [
    CommonModule,
    THTEApplicationDteListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule,
    OTPModalModule,
    ViewStaffProfileModalModule,
  ]
})
export class THTEApplicationDteListModule { }
