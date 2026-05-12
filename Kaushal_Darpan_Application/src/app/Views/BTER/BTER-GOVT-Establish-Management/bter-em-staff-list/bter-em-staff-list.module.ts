import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';
import { BTEREMStaffListComponent } from './bter-em-staff-list.component';
import { BTEREMStaffListRoutingModule } from './bter-em-staff-list-routing.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';
import { ViewStaffProfileModalModule } from '../view-staff-profile-modal/view-staff-profile-modal.model';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    BTEREMStaffListComponent,
  ],
  imports: [
    CommonModule,
    BTEREMStaffListRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LoaderModule, 
    TableSearchFilterModule,
    StudentStatusHistoryModule,
    OTPModalModule,
    ViewStaffProfileModalModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class BTEREMStaffListModule { }
