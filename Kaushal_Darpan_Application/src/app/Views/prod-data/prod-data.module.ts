import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';
import { ProdDataComponent } from './prod-data.component';
import { ProdDataRoutingModule } from './prod-data-routing.module';


@NgModule({
  declarations: [
    ProdDataComponent
  ],
  imports: [
    CommonModule,
    ProdDataRoutingModule,
    FormsModule,
    ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class ProdDataModule { }
