import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { DteAddIssuedItemsComponent } from './dteadd-issued-items.component';
import { DteAddIssuedItemsRoutingModule } from './dteadd-issued-items.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    DteAddIssuedItemsComponent
  ],
  imports: [
    CommonModule,
    DteAddIssuedItemsRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, NgSelectModule
  ]
})
export class DteAddIssuedItemsModule { }
