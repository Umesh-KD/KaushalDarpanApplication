import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDashboardNcvtRoutingModule } from './admin-dashboard-ncvt-routing.module';
import { AdminDashboardNcvtComponent } from './admin-dashboard-ncvt.component';
 


@NgModule({
  declarations: [
    AdminDashboardNcvtComponent
  ],
  imports: [
    CommonModule,
    AdminDashboardNcvtRoutingModule
  ],
  exports: [AdminDashboardNcvtComponent]
})
export class AdminDashboardNcvtModule { }
