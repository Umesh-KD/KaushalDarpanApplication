import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { InventoryDashboardReportComponent } from './InventoryDashboardReport.component';
import { InventoryDashboardReportRoutingModule } from './InventoryDashboardReport.routing.module';
import { MaterialModule } from '../../../../../material.module';

@NgModule({
  declarations: [
    InventoryDashboardReportComponent
  ],
  imports: [
    CommonModule, MaterialModule,
    InventoryDashboardReportRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class InventoryDashboardReportModule { }
