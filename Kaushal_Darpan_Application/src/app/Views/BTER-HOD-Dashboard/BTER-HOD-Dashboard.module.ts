import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderModule } from '../Shared/loader/loader.module';

import { BTERHODDashboardComponent } from './BTER-HOD-Dashboard.component';
import { BTERHODDashboardRoutingModule } from './BTER-HOD-Dashboard.routing.module';


@NgModule({
  declarations: [
    BTERHODDashboardComponent

  ],
  imports: [
    CommonModule,
    BTERHODDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ], exports: [BTERHODDashboardComponent]
})
export class BTERHODDashboardModule { }
