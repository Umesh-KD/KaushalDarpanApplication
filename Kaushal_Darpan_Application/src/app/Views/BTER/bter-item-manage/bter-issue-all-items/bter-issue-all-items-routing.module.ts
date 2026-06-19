import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBterIssueItemComponent } from './bter-issue-all-items.component';

const routes: Routes = [{ path: '', component: AddBterIssueItemComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBterIssueItemRoutingModule { }
