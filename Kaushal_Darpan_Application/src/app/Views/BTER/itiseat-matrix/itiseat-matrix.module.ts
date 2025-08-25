import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITISeatMatrixRoutingModule } from './itiseat-matrix-routing.module';
import { ITISeatMatrixComponent } from './itiseat-matrix.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ITISeatMatrixComponent
  ],
  imports: [
    CommonModule,
    ITISeatMatrixRoutingModule, FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
  ]
})
export class ITISeatMatrixModule { }
