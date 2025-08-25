import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StaffDashboardComponent } from './staff-dashboard.component';
import { LoaderModule } from '../Shared/loader/loader.module';
import { StaffDashboardRoutingModule } from './staff-dashboard.routing.module';


@NgModule({
  declarations: [
    StaffDashboardComponent
  ],
  imports: [
    CommonModule,
    StaffDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ], exports: [StaffDashboardComponent]
})
export class StaffDashboardModule { }
