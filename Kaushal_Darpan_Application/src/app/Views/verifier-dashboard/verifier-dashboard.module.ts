import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifierDashboardRoutingModule } from './verifier-dashboard-routing.module';
import { VerifierDashboardComponent } from './verifier-dashboard.component';


@NgModule({
  declarations: [
    VerifierDashboardComponent
  ],
  imports: [
    CommonModule,
    VerifierDashboardRoutingModule
  ], exports: [VerifierDashboardComponent]
})
export class VerifierDashboardModule { }
