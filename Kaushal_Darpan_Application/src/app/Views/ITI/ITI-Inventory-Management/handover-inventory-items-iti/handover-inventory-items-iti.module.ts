import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { HandoverInventoryItemsITIComponent } from './handover-inventory-items-iti.component';
import { HandoverInventoryItemsITIRoutingModule } from './handover-inventory-items-iti-routing.module';

@NgModule({
  declarations: [
    HandoverInventoryItemsITIComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LoaderModule, 
    TableSearchFilterModule,
    HandoverInventoryItemsITIRoutingModule
  ]
})
export class HandoverInventoryItemsITIModule { }
