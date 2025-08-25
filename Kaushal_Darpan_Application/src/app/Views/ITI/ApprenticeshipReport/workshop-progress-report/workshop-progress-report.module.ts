import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkshopProgressReportRoutingModule } from './workshop-progress-report-routing.module';
import { WorkshopProgressReportComponent } from './workshop-progress-report.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../../material.module';


@NgModule({
  declarations: [
    WorkshopProgressReportComponent
  ],
  imports: [
    CommonModule,
    WorkshopProgressReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    TableSearchFilterModule,
    MaterialModule
  ]
})
export class WorkshopProgressReportModule { }
