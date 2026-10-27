import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsolatedDashboardRoutingModule } from './consolated-dashboard-routing.module';
import { ConsolatedDashboardComponent } from './consolated-dashboard.component';


@NgModule({
  declarations: [
    ConsolatedDashboardComponent
  ],
  imports: [
    CommonModule,
    ConsolatedDashboardRoutingModule
  ],
  exports: [ConsolatedDashboardComponent]
})
export class ConsolatedDashboardModule { }
