import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { DTEEquipmentVerificationsMappingListComponent } from './DTEEquipmentVerifications-mapping-list.component';
import { DTEEquipmentVerificationsMappingListRoutingModule } from './DTEEquipmentVerifications-mapping-list.routing.module';

@NgModule({
  declarations: [
    DTEEquipmentVerificationsMappingListComponent
  ],
  imports: [
    CommonModule,
    DTEEquipmentVerificationsMappingListRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class DTEEquipmentVerificationsMappingListModule { }
