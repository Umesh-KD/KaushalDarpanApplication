import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryDashboardRoutingModule } from './inventory-dashboard-routing.module';
import { InventoryDashboardComponent } from './inventory-dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InventoryDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InventoryDashboardRoutingModule,
    HighchartsChartModule
  ]
})
export class InventoryDashboardModule { }
