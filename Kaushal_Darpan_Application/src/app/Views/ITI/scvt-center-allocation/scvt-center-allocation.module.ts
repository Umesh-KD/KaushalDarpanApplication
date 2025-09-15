import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScvtCenterAllocationRoutingModule } from './scvt-center-allocation-routing.module';
import { ScvtCenterAllocationComponent } from './scvt-center-allocation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ScvtCenterAllocationComponent
  ],
  imports: [
    CommonModule,
    ScvtCenterAllocationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    TableSearchFilterModule
  ]
})
export class ScvtCenterAllocationModule { }
