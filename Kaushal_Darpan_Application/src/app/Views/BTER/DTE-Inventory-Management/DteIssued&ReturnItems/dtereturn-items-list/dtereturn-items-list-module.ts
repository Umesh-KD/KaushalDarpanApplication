import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { DteReturnItemsListRoutingModule } from './dtereturn-items-list.routing.module';
import { DteReturnItemsListComponent } from './dtereturn-items-list.component';


@NgModule({
  declarations: [
    DteReturnItemsListComponent
  ],
  imports: [
    CommonModule,
    DteReturnItemsListRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class DteReturnItemsListModule { }
