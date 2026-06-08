import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { PostPlanningDashboardITIComponent } from './post-planning-dashboard-iti.component';
import { PostPlanningDashboardITIRoutingModule } from './post-planning-dashboard-iti-routing.module';


@NgModule({
  declarations: [
    PostPlanningDashboardITIComponent
  ],
  imports: [
    CommonModule,
    PostPlanningDashboardITIRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(), 
    OTPModalModule
  ],
  exports: [PostPlanningDashboardITIComponent]
})
export class PostPlanningDashboardITIModule { }
