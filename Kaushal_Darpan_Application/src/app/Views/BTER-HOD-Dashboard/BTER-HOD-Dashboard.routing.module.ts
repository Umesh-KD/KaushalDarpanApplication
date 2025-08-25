import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BTERHODDashboardComponent } from './BTER-HOD-Dashboard.component';


const routes: Routes = [{ path: '', component: BTERHODDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BTERHODDashboardRoutingModule { }
