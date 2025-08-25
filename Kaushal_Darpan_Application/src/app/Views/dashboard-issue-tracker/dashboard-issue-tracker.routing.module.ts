import { NgModule } from '@angular/core';
import { dashboardIssueTrackerComponent } from './dashboard-issue-tracker.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: dashboardIssueTrackerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class dashboardIssueTrackerRoutingModule { }
