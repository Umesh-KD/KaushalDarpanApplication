import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewContentListRoutingModule } from './view-content-list-routing.module';
import { ViewContentListComponent } from './view-content-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ViewContentListComponent
  ],
  imports: [
    CommonModule,
    ViewContentListRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,

  ]
})
export class ViewContentListModule { }
