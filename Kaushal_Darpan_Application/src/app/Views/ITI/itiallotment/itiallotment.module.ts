import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIAllotmentRoutingModule } from './itiallotment-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { ITIAllotmentComponent } from './itiallotment.component';


@NgModule({
  declarations: [
    ITIAllotmentComponent
  ],
  imports: [
    CommonModule,
    ITIAllotmentRoutingModule, FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
  ]
})
export class ITIAllotmentModule { }
