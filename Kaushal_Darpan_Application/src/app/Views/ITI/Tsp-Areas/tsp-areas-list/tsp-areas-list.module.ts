import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TspAreasListRoutingModule } from './tsp-areas-list-routing.module';
import { TspAreasListComponent } from './tsp-areas-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    TspAreasListComponent
  ],
  imports: [
    CommonModule,
    TspAreasListRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class TspAreasListModule { }
