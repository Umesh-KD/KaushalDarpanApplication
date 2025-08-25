import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddSeatMetrixRoutingModule } from './add-seat-metrix-routing.module';
import { AddSeatMetrixComponent } from './add-seat-metrix.component';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddSeatMetrixComponent
  ],
  imports: [
    CommonModule,MaterialModule,
    AddSeatMetrixRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class AddSeatMetrixModule { }
