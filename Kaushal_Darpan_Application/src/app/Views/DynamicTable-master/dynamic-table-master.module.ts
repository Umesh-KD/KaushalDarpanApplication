import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { DynamicTableMasterComponent } from './dynamic-table-master.component';
import { DynamicTableMasterListRoutingModule } from './dynamic-table-master.routing.module';
import { DataTableModule } from '../../Common/data-table/data-table.module';

@NgModule({
  declarations: [
    DynamicTableMasterComponent
  ],
  imports: [
    CommonModule,
    DynamicTableMasterListRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,DataTableModule
  ]
})
export class DynamicTableMasterListModule { }
