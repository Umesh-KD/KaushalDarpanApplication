import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchResultRoutingModule } from './search-result-routing.module';
import { SearchResultComponent } from './search-result.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    SearchResultComponent
  ],
  imports: [
    CommonModule,
    FormsModule ,
    SearchResultRoutingModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class SearchResultModule { }
