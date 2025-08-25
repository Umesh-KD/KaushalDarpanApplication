import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DTEDashboardComponent } from './dte-dashboard.component';

const routes: Routes = [{ path: '', component: DTEDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DTEDashboardRoutingModule { }
