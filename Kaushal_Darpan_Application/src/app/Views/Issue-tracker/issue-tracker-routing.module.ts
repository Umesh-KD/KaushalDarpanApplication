import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueTrackerComponent } from './issue-tracker.component';

const routes: Routes = [{ path: '', component: IssueTrackerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssueTrackerRoutingModule { }
