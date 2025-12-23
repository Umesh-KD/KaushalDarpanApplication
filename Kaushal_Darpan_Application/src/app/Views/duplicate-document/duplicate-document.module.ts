import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { DuplicateDocumentComponent } from './duplicate-document.component';
import { DuplicateDocumentRoutingModule } from './duplicate-document.routing.module';

@NgModule({
  declarations: [
    DuplicateDocumentComponent
  ],
  imports: [
    CommonModule,
    DuplicateDocumentRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class DuplicateDocumentModule { }
