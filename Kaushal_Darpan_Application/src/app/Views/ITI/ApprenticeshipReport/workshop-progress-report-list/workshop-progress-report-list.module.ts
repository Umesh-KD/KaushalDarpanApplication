import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkshopProgressReportListRoutingModule } from './workshop-progress-report-list-routing.module';
import { WorkshopProgressReportListComponent } from './workshop-progress-report-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../../material.module';

@NgModule({
  declarations: [
    WorkshopProgressReportListComponent
  ],
  imports: [
    CommonModule,
    WorkshopProgressReportListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    MaterialModule
  ]
})
export class WorkshopProgressReportListModule { }
