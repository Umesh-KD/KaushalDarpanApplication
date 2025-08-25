import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrarDashboardRoutingModule } from './registrar-dashboard-routing.module';
import { RegistrarDashboardComponent } from './registrar-dashboard.component';


@NgModule({
  declarations: [
    RegistrarDashboardComponent
  ],
  imports: [
    CommonModule,
    RegistrarDashboardRoutingModule
  ],
    exports: [RegistrarDashboardComponent]
})
export class RegistrarDashboardModule { }
