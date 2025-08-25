import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarksheetIssueDateComponent } from './marksheet-issue-date.component';

const routes: Routes = [{ path: '', component: MarksheetIssueDateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarksheetIssueDateRoutingModule { }
