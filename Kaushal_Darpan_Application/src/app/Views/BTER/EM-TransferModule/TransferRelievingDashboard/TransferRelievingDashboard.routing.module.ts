import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransferRelievingDashboardComponent } from './TransferRelievingDashboard.component';


const routes: Routes = [{ path: '', component: TransferRelievingDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRelievingDashboardRoutingModule { }
