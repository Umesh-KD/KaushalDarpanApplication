import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ITIInspectionDashboardComponent } from './inspection-dashboard.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ITIInspectionDashboardRoutingModule } from './inspection-dashboard.routing.module';


@NgModule({
  declarations: [
    ITIInspectionDashboardComponent
  ],
  imports: [
    CommonModule,
    ITIInspectionDashboardRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
  ],
  exports:[ITIInspectionDashboardComponent]
})
export class ITIInspectionDashboardModule { }
