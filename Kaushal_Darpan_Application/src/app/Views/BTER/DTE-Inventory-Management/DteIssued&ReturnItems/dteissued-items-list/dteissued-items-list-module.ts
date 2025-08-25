import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { DteIssuedItemsListComponent } from './dteissued-items-list.component';
import { DteIssuedItemsListRoutingModule } from './dteissued-items-list.routing.module';


@NgModule({
  declarations: [
    DteIssuedItemsListComponent
  ],
  imports: [
    CommonModule,
    DteIssuedItemsListRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class DteIssuedItemsListModule { }
