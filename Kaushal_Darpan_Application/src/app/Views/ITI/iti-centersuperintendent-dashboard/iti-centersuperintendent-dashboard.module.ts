import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiCentersuperintendentDashboardRoutingModule } from './iti-centersuperintendent-dashboard-routing.module';
import { ItiCentersuperintendentDashboardComponent } from './iti-centersuperintendent-dashboard.component';


@NgModule({
  declarations: [
    ItiCentersuperintendentDashboardComponent
  ],
  imports: [
    CommonModule,
    ItiCentersuperintendentDashboardRoutingModule
  ],
  exports: [ItiCentersuperintendentDashboardComponent]
})
export class ItiCentersuperintendentDashboardModule { }
