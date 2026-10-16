import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { PlacementDynamicReportComponent } from './placement-dynamic-report.component';
import { PlacementDynamicReportRoutingModule } from './placement-dynamic-report.routing.module';
import { DataTableModule } from '../../../Common/data-table/data-table.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    PlacementDynamicReportComponent
  ],
  imports: [
    CommonModule,
    PlacementDynamicReportRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,NgSelectModule,DataTableModule
  ]
})
export class PlacementDynamicReportModule { }
