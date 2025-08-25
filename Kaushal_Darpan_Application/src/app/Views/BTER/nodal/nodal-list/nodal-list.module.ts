import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NodalListComponent } from './nodal-list.component';
import { NodalListRoutingModule } from './nodal-list-routing.module';



@NgModule({
  declarations: [
    NodalListComponent
  ],
  imports: [
    CommonModule,
    NodalListRoutingModule,
    FormsModule,
    LoaderModule,
    TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class NodalListModule { }
