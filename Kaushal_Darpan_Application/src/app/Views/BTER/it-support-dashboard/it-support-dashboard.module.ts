import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITSupportDashboardRoutingModule } from './it-support-dashboard-routing.module';
import { ITSupportDashboardComponent } from './it-support-dashboard.component';


@NgModule({
  declarations: [
    ITSupportDashboardComponent
  ],
  imports: [
    CommonModule,
    ITSupportDashboardRoutingModule
  ],
  exports: [ITSupportDashboardComponent]
})
export class ITSupportDashboardModule { }
