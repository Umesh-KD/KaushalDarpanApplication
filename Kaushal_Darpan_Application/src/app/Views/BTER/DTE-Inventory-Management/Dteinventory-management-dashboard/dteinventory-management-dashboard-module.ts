import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { DTEInventoryManagementDashboardRoutingModule } from './dteinventory-management-dashboard.routing.module';
import { DTEInventoryManagementDashboardComponent } from './dteinventory-management-dashboard.component';

@NgModule({
  declarations: [
    DTEInventoryManagementDashboardComponent
  ],
  imports: [
    CommonModule,
    DTEInventoryManagementDashboardRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class DTEInventoryManagementDashboardModule { }
