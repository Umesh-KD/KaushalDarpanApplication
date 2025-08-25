import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { DteEquipmentsMasterComponent } from './dteequipments-master.component';
import { DteEquipmentsMasterRoutingModule } from './dteequipments-master.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    DteEquipmentsMasterComponent
  ],
  imports: [
    CommonModule,
    DteEquipmentsMasterRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, NgSelectModule
  ]
})
export class DteEquipmentsMasterModule { }
