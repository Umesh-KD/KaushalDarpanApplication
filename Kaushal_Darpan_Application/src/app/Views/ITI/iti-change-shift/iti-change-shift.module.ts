import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiChangeShiftRoutingModule } from './iti-change-shift-routing.module';
import { ItiChangeShiftComponent } from './iti-change-shift.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ItiChangeShiftComponent
  ],
  imports: [
    CommonModule,
    ItiChangeShiftRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class ItiChangeShiftModule { }
