import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlacementDashboardComponent } from './placement-dashboard.component';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { PlacementDashboardRoutingModule } from './placement-dashboard.routing.module';


@NgModule({
  declarations: [
    PlacementDashboardComponent
  ],
  imports: [
    CommonModule,
    PlacementDashboardRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
  ],
  exports:[PlacementDashboardComponent]
})
export class PlacementDashboardModule { }
