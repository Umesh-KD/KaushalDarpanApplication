import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprenticeshipDirectorNCVTDashboardRoutingModule } from './iti-ApprenticeshipDirectorNCVTDashboard-routing.module';
import { ApprenticeshipDirectorNCVTDashboardComponent } from './iti-ApprenticeshipDirectorNCVTDashboard.component';
 


@NgModule({
  declarations: [
    ApprenticeshipDirectorNCVTDashboardComponent
  ],
  imports: [
    CommonModule,
    ApprenticeshipDirectorNCVTDashboardRoutingModule
  ],
  exports: [ApprenticeshipDirectorNCVTDashboardComponent]
})
export class ApprenticeshipDirectorNCVTDashboardModule { }
