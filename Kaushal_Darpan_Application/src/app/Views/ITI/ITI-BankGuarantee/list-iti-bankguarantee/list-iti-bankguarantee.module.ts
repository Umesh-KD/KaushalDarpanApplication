import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { listitibankguaranteeRoutingModule } from './list-iti-bankguarantee-routing.module';
import { listitibankguaranteeComponent } from './list-iti-bankguarantee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    listitibankguaranteeComponent
  ],
  imports: [
    CommonModule,
    listitibankguaranteeRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
    , NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent
  ]
})
export class listitibankguaranteeModule { }
