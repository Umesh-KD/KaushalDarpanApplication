import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticDashboardComponent } from './analytic-dashboard.component';

const routes: Routes = [{ path: '', component: AnalyticDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticDashboardRoutingModule { }
