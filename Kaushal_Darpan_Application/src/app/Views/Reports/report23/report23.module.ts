import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { Report23Component } from './report23.component';
import { Report23RoutingModule } from './report23-routing.module';


@NgModule({
  declarations: [
    Report23Component
  ],
  imports: [
    CommonModule,
    Report23RoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class Report23Module { }
