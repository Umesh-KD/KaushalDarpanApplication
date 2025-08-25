import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITISearchRoutingModule } from './iti-search-routing.module';
import { ITISearchComponent } from './iti-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ITISearchComponent
  ],
  imports: [
    CommonModule,
    ITISearchRoutingModule,
    FormsModule,
    ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class ITISearchModule { }
