import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { Routes, RouterModule } from '@angular/router';
import { ITIAddRequestEquipmentsMappingComponent } from './iti-add-request-equipments-mapping.component';

const routes: Routes = [{ path: '', component: ITIAddRequestEquipmentsMappingComponent }];


@NgModule({
  declarations: [
    ITIAddRequestEquipmentsMappingComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, NgSelectModule
  ]
})
export class ITIAddRequestEquipmentsMappingModule { }
