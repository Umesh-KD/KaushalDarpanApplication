import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollegeWiseSeatMetrixRoutingModule } from './college-wise-seat-metrix-routing.module';
import { CollegeWiseSeatMetrixComponent } from './college-wise-seat-metrix.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    CollegeWiseSeatMetrixComponent
  ],
  imports: [
    CommonModule,
    CollegeWiseSeatMetrixRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class CollegeWiseSeatMetrixModule { }
