import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SanctionOrderRoutingModule } from './SanctionOrder-routing.module';
import { SanctionOrderComponent } from './SanctionOrder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    SanctionOrderComponent
  ],
  imports: [
    CommonModule,
    SanctionOrderRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule,

  ]
})
export class SanctionOrderModule { }
