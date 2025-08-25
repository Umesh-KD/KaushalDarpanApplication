import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRequestDteTradeEquipmentsMappingComponent } from './add-request-dte-trade-equipments-mapping.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: AddRequestDteTradeEquipmentsMappingComponent }];


@NgModule({
  declarations: [
    AddRequestDteTradeEquipmentsMappingComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, NgSelectModule
  ]
})
export class AddRequestDteTradeEquipmentsMappingModule { }
