import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDashboardRoutingModule } from './master-dashboard-routing.module';
import { MasterDashboardComponent } from './master-dashboard.component';


@NgModule({
  declarations: [
    MasterDashboardComponent
  ],
  imports: [
    CommonModule,
    MasterDashboardRoutingModule
  ]
})
export class MasterDashboardModule { }
