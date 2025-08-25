import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IMCAllocationListRoutingModule } from './imc-allocation-list-routing.module';
import { IMCAllocationListComponent } from './imc-allocation-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    IMCAllocationListComponent
  ],
  imports: [
    CommonModule,
    IMCAllocationListRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class IMCAllocationListModule { }
