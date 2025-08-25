import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreKeeperDashboardComponent } from './store-keeper-dashboard.component';

const routes: Routes = [{ path: '', component: StoreKeeperDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreKeeperDashboardRoutingModule { }
