import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IipDashboardRoutingModule } from './iip-dashboard-routing.module';
import { IipDashboardComponent } from './iip-dashboard.component';


@NgModule({
  declarations: [
    IipDashboardComponent
  ],
  imports: [
    CommonModule,
    IipDashboardRoutingModule
  ],
  exports: [IipDashboardComponent]
})
export class IipDashboardModule { }
