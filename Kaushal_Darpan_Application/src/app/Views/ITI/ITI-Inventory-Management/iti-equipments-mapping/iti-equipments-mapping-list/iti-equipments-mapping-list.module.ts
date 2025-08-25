import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { MaterialModule } from '../../../../../material.module';
import { Routes, RouterModule } from '@angular/router';
import { ITITradeEquipmentsMappingListComponent } from './iti-equipments-mapping-list.component';

const routes: Routes = [{ path: '', component: ITITradeEquipmentsMappingListComponent }];

@NgModule({
  declarations: [
    ITITradeEquipmentsMappingListComponent
  ],
  imports: [
    CommonModule, MaterialModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class ITITradeEquipmentsMappingListModule { }
