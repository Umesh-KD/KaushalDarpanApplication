import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListPublicInfoRoutingModule } from './list-public-info-routing.module';
import { ListPublicInfoComponent } from './list-public-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    ListPublicInfoComponent
  ],
  imports: [
    CommonModule,
    ListPublicInfoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ListPublicInfoModule { }
