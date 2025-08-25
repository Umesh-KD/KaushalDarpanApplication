import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiStaffDashboardRoutingModule } from './iti-staff-dashboard-routing.module';
import { ItiStaffDashboardComponent } from './iti-staff-dashboard.component';


@NgModule({
  declarations: [
    ItiStaffDashboardComponent
  ],
  imports: [
    CommonModule,
    ItiStaffDashboardRoutingModule
  ],
  exports: [ItiStaffDashboardComponent]
})
export class ItiStaffDashboardModule { }
