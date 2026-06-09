import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { StudentStatusHistoryModule } from '../../../Student/student-status-history/student-status-history.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { ViewStaffProfileModalModule } from '../view-staff-profile-modal/view-staff-profile-modal.model';
import { EstablishmentDashboardBTERComponent } from './establishment-dashboard-bter.component';
import { EstablishmentDashboardBTERRoutingModule } from './establishment-dashboard-bter-routing.module';


@NgModule({
  declarations: [
    EstablishmentDashboardBTERComponent,
  ],
  imports: [
    CommonModule,
    EstablishmentDashboardBTERRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LoaderModule, 
    TableSearchFilterModule,
    StudentStatusHistoryModule,
    NgMultiSelectDropDownModule.forRoot(),
    ViewStaffProfileModalModule
  ]
})
export class EstablishmentDashboardBTERModule { }
