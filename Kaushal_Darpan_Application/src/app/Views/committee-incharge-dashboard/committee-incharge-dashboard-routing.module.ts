import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommitteeInchargeDashboardComponent } from './committee-incharge-dashboard.component';

const routes: Routes = [{ path: '', component: CommitteeInchargeDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommitteeInchargeDashboardRoutingModule { }
