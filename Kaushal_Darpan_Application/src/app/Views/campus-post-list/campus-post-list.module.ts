import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampusPostListRoutingModule } from './campus-post-list-routing.module';
import { CampusPostListComponent } from './campus-post-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    CampusPostListComponent
  ],
  imports: [
    CommonModule,
    CampusPostListRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, NgSelectModule

  ]
})
export class CampusPostListModule { }
