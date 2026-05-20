import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffTrainingConsentRoutingModule } from './staff-training-consent-routing.module';
import { StaffTrainingConsentComponent } from './staff-training-consent.component';


@NgModule({
  declarations: [
    StaffTrainingConsentComponent
  ],
  imports: [
    CommonModule,
    StaffTrainingConsentRoutingModule
  ]
})
export class StaffTrainingConsentModule { }
