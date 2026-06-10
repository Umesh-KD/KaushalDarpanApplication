import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmissionMasterDashboardRoutingModule } from './admission-master-dashboard-routing.module';
import { AdmissionMasterDashboardComponent } from './admission-master-dashboard.component';


@NgModule({
  declarations: [
    AdmissionMasterDashboardComponent
  ],
  imports: [
    CommonModule,
    AdmissionMasterDashboardRoutingModule
  ]
})
export class AdmissionMasterDashboardModule { }
