import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffTrainingConsentRoutingModule } from './staff-training-consent-routing.module';
import { StaffTrainingConsentComponent } from './staff-training-consent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    StaffTrainingConsentComponent
  ],
  imports: [
    CommonModule,
    StaffTrainingConsentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class StaffTrainingConsentModule { }
