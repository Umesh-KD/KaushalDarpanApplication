import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderModule } from '../../../Shared/loader/loader.module';

import { InventoryDashboardComponent } from './InventoryDashboard.component';
import { InventoryDashboardRoutingModule } from './InventoryDashboard.routing.module';


@NgModule({
  declarations: [
    InventoryDashboardComponent

  ],
  imports: [
    CommonModule,
    InventoryDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ], exports: [InventoryDashboardComponent]
})
export class InventoryDashboardModule { }
