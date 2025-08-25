import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { HighlightsComponent } from './highlights.component';
import { HighlightsRoutingModule } from './highlights-routing.module';


@NgModule({
  declarations: [
    HighlightsComponent
  ],
  imports: [
    CommonModule,
    HighlightsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class HighlightsModule { }
