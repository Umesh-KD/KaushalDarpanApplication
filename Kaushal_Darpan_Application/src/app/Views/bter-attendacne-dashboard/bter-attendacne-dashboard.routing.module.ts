import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BterAttendanceDashboardComponent } from './bter-attendacne-dashboard.component';

const routes: Routes = [{ path: '', component: BterAttendanceDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterAttendanceDashboardRoutingModule { }
