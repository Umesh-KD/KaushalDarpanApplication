import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarksheetLetterRoutingModule } from './marksheet-letter-routing.module';
import { MarksheetLetterComponent } from './marksheet-letter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';



@NgModule({
  declarations: [
    MarksheetLetterComponent
  ],
  imports: [
    CommonModule,
    MarksheetLetterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class MarksheetLetterModule { }


