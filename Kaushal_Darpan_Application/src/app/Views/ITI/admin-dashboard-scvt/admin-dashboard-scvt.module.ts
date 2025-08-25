import { NgModule } from '@angular/core';


import { AdminDashboardSCVTRoutingModule } from './admin-dashboard-scvt-routing.module';
import { AdminDashboardSCVTComponent } from './admin-dashboard-scvt.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    AdminDashboardSCVTComponent
  ],
  imports: [
    CommonModule,
    AdminDashboardSCVTRoutingModule
    
  ],
  exports: [AdminDashboardSCVTComponent]
})

export class AdminDashboardSCVTModule { }


