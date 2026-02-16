import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollegeTradeMasterRoutingModule } from './college-trade-master-routing.module';
import { CollegeTradeMasterComponent } from './college-trade-master.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule } from '@angular/forms';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    CollegeTradeMasterComponent
  ],
  imports: [
    CommonModule,
    CollegeTradeMasterRoutingModule,
    TableSearchFilterModule,
    LoaderModule,
    FormsModule,
    NgMultiSelectDropDownModule .forRoot(),
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class CollegeTradeMasterModule { }
