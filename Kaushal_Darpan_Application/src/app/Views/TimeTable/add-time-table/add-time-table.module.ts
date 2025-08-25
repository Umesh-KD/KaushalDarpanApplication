import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddTimeTableRoutingModule } from './add-time-table-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddTimeTableComponent } from './add-time-table.component';


@NgModule({
  declarations: [
    AddTimeTableComponent
  ],
  imports: [
    CommonModule,
    AddTimeTableRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot()

  ]
})
export class AddTimeTableModule { }
