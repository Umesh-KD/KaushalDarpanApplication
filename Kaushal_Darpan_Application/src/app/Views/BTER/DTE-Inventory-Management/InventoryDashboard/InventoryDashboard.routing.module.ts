import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InventoryDashboardComponent } from './InventoryDashboard.component';


const routes: Routes = [{ path: '', component: InventoryDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryDashboardRoutingModule { }
