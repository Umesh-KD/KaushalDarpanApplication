import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NodalDashboardITIRoutingModule } from './nodal-dashboard-iti-routing.module';
import { NodalDashboardITIComponent } from './nodal-dashboard-iti.component';


@NgModule({
  declarations: [
    NodalDashboardITIComponent
  ],
  imports: [
    CommonModule,
    NodalDashboardITIRoutingModule
  ]
})
export class NodalDashboardITIModule { }
