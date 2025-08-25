import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlacementDashboardComponent } from './placement-dashboard.component';

const routes: Routes = [{ path: '', component: PlacementDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementDashboardRoutingModule { }
