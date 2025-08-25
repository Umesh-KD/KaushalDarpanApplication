import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { Routes, RouterModule } from '@angular/router';
import { ITIInventoryManagementDashboard } from './iti-inventory-management-dashboard.component';

const routes: Routes = [{ path: '', component: ITIInventoryManagementDashboard }];

@NgModule({
  declarations: [
    ITIInventoryManagementDashboard
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ], exports:[ITIInventoryManagementDashboard]
})
export class ITIInventoryManagementDashboardModule { }
