import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { OrderAndCircularComponent } from './OrderAndCircular.component';
import { OrderAndCircularRoutingModule } from './OrderAndCircular-routing.module';


@NgModule({
  declarations: [
   OrderAndCircularComponent
  ],
  imports: [
    CommonModule,
    OrderAndCircularRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class OrderAndCircularModule { }
