import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IipDashboardRoutingModule } from './iip-dashboard-routing.module';
import { IipDashboardComponent } from './iip-dashboard.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    IipDashboardComponent
  ],
  imports: [
    CommonModule,
    IipDashboardRoutingModule,
    FormsModule
  ],
  exports: [IipDashboardComponent]
})
export class IipDashboardModule { }
