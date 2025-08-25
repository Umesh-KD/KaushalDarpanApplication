import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarksheetIssueDateRoutingModule } from './marksheet-issue-date-routing.module';
import { MarksheetIssueDateComponent } from './marksheet-issue-date.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    MarksheetIssueDateComponent
  ],
  imports: [
    CommonModule,
    MarksheetIssueDateRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class MarksheetIssueDateModule { }
