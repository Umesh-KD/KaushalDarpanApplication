import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampusPostHistoryRoutingModule } from './campus-post-history-routing.module';
import { CampusPostHistoryComponent } from './campus-post-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    CampusPostHistoryComponent
  ],
  imports: [
    CommonModule,
    CampusPostHistoryRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
  ]
})
export class CampusPostHistoryModule { }
