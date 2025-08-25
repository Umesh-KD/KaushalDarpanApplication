import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HostelDashboardRoutingModule } from './hostel-dashboard-routing.module';
import { HostelDashboardComponent } from './hostel-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    HostelDashboardComponent
  ],
  imports: [
    CommonModule,
    HostelDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
  ],
  exports: [HostelDashboardComponent]
})
export class HostelDashboardModule { }
