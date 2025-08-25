import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingStatusRoutingModule } from './iti-wise-reporting-status-routing.module';
import { ReportingStatusComponent } from './iti-wise-reporting-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ReportingStatusComponent
  ],
  imports: [
    CommonModule,
    ReportingStatusRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class ReportingStatusModule { }
