import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListItiTradeRoutingModule } from './list-iti-trade-routing.module';
import { ListItiTradeComponent } from './list-iti-trade.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@NgModule({
  declarations: [
    ListItiTradeComponent
  ],
  imports: [
    CommonModule,
    ListItiTradeRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule, NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class ListItiTradeModule { }
