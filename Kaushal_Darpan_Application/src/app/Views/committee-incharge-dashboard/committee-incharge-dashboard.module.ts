import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommitteeInchargeDashboardRoutingModule } from './committee-incharge-dashboard-routing.module';
import { CommitteeInchargeDashboardComponent } from './committee-incharge-dashboard.component';


@NgModule({
  declarations: [
    CommitteeInchargeDashboardComponent
  ],
  imports: [
    CommonModule,
    CommitteeInchargeDashboardRoutingModule
  ],
  exports: [CommitteeInchargeDashboardComponent]
})
export class CommitteeInchargeDashboardModule { }
