import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryItemReportRoutingModule } from './inventory-item-report-routing.module';
import { InventoryItemReportComponent } from './inventory-item-report.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from '../../../routes';


@NgModule({
  declarations: [
    InventoryItemReportComponent
  ],
  imports: [
    CommonModule,
    InventoryItemReportRoutingModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class InventoryItemReportModule { }
