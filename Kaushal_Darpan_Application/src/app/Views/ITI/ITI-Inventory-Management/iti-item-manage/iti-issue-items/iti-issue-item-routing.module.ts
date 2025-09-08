import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItiIssueItemComponent } from './iti-issue-item.component';

const routes: Routes = [{ path: '', component: AddItiIssueItemComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddItiIssueItemRoutingModule { }
