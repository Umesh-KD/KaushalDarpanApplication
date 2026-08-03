import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignalRDashboardRoutingModule } from './signal-r-dashboard-routing.module';
import { SignalRDashboardComponent } from './signal-r-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    SignalRDashboardComponent
  ],
  imports: [
    CommonModule,
    SignalRDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class SignalRDashboardModule { }
