import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlacementDataReportRoutingModule } from './placement-data-report-routing.module';
import { PlacementDataReportComponent } from './placement-data-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    PlacementDataReportComponent
  ],
  imports: [
    CommonModule,
    PlacementDataReportRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, MaterialModule, RouterModule
  ]
})
export class PlacementDataReportModule { }
