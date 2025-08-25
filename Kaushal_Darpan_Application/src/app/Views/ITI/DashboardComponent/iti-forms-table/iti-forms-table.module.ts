import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ItiFormsTableComponent } from './iti-forms-table.component';
import { ItiFormsTableRoutingModule } from './iti-forms-table-routing.module';

@NgModule({
  declarations: [
    ItiFormsTableComponent
  ],
  imports: [
    CommonModule,
    ItiFormsTableRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ],
  exports: [ItiFormsTableComponent] 
})
export class ItiFormsTableModule { }
