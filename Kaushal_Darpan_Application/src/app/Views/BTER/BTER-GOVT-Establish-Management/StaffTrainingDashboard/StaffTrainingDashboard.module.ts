import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderModule } from '../../../Shared/loader/loader.module';

import { StaffTrainingDashboardComponent } from './StaffTrainingDashboard.component';
import { StaffTrainingDashboardRoutingModule } from './StaffTrainingDashboard.routing.module';


@NgModule({
  declarations: [
    StaffTrainingDashboardComponent

  ],
  imports: [
    CommonModule,
    StaffTrainingDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ], exports: [StaffTrainingDashboardComponent]
})
export class StaffTrainingDashboardModule { }
