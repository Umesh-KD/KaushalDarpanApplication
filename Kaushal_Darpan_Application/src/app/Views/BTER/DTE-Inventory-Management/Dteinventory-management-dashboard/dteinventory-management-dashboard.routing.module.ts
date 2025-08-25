import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DTEInventoryManagementDashboardComponent } from './dteinventory-management-dashboard.component';





const routes: Routes = [{ path: '', component: DTEInventoryManagementDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DTEInventoryManagementDashboardRoutingModule { }
