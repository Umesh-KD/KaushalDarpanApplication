import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { AddDteTradeEquipmentsMappingRoutingModule } from './adddte-trade-equipments-mapping..routing.module';
import { AddDteTradeEquipmentsMappingComponent } from './adddte-trade-equipments-mapping.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AddDteTradeEquipmentsMappingComponent
  ],
  imports: [
    CommonModule,
    AddDteTradeEquipmentsMappingRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, NgSelectModule
  ]
})
export class AddDteTradeEquipmentsMappingModule { }
