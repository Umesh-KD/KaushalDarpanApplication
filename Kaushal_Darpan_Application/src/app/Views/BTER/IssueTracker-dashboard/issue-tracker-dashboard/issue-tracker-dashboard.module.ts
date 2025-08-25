import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssueTrackerDashboardRoutingModule } from './issue-tracker-dashboard-routing.module';
import { IssueTrackerDashboardComponent } from './issue-tracker-dashboard.component';


@NgModule({
  declarations: [
    IssueTrackerDashboardComponent
  ],
  imports: [
    CommonModule,
    IssueTrackerDashboardRoutingModule
  ]
})
export class IssueTrackerDashboardModule { }
