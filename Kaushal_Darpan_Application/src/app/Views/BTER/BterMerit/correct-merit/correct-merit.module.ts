import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorrectMeritRoutingModule } from './correct-merit-routing.module';
import { CorrectMeritComponent } from './correct-merit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    CorrectMeritComponent
  ],
  imports: [
    CommonModule,
    CorrectMeritRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class CorrectMeritModule { }
