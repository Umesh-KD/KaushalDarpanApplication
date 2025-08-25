import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaperAutoSelectRoutingModule } from './paper-auto-select-routing.module';
import { PaperAutoSelectComponent } from './paper-auto-select.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    PaperAutoSelectComponent
  ],
  imports: [
    CommonModule,
    PaperAutoSelectRoutingModule,
     FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class PaperAutoSelectModule { }
