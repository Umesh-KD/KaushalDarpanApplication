import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddITIIssueItemComponent } from './iti-issue-item.component';

const routes: Routes = [{ path: '', component: AddITIIssueItemComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddITIIssueItemRoutingModule { }
