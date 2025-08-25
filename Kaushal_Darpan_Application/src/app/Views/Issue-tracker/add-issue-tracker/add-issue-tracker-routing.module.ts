import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddIssueTrackerComponent } from './add-issue-tracker.component';

const routes: Routes = [{ path: '', component: AddIssueTrackerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddIssueTrackerRoutingModule { }
