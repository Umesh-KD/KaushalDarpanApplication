import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDashboardITIRoutingModule } from './admin-dashboard-iti-routing.module';
import { AdminDashboardITIComponent } from './admin-dashboard-iti.component';
import { ItiFormsTableModule } from '../DashboardComponent/iti-forms-table/iti-forms-table.module';
import { ItiFormsPriorityListModule } from '../DashboardComponent/iti-forms-priority-list/iti-forms-priority-list.module';
import { PostPlanningDashboardITIModule } from '../post-planning-dashboard-iti/post-planning-dashboard-iti.module';


@NgModule({
  declarations: [
    AdminDashboardITIComponent
  ],
  imports: [
    CommonModule,
    AdminDashboardITIRoutingModule,
    ItiFormsTableModule,
    ItiFormsPriorityListModule,
    PostPlanningDashboardITIModule,
  ],
  exports: [AdminDashboardITIComponent]
})
export class AdminDashboardITIModule { }
