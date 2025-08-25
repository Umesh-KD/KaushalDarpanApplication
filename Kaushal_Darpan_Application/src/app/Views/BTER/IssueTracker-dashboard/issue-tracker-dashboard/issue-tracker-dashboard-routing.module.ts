import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueTrackerDashboardComponent } from './issue-tracker-dashboard.component';

const routes: Routes = [{ path: '', component: IssueTrackerDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssueTrackerDashboardRoutingModule { }
