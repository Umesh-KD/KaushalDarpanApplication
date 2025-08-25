import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { DteTradeEquipmentsMappingListComponent } from './dtetrade-equipments-mapping-list.component';
import { DteTradeEquipmentsMappingListRoutingModule } from './dtetrade-equipments-mapping-list.routing.module';
import { MaterialModule } from '../../../../../material.module';

@NgModule({
  declarations: [
    DteTradeEquipmentsMappingListComponent
  ],
  imports: [
    CommonModule, MaterialModule,
    DteTradeEquipmentsMappingListRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class DteTradeEquipmentsMappingListModule { }
