import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreKeeperDashboardRoutingModule } from './store-keeper-dashboard-routing.module';
import { StoreKeeperDashboardComponent } from './store-keeper-dashboard.component';


@NgModule({
  declarations: [
    StoreKeeperDashboardComponent
  ],
  imports: [
    CommonModule,
    StoreKeeperDashboardRoutingModule
  ], exports: [StoreKeeperDashboardComponent]
})
export class StoreKeeperDashboardModule { }
