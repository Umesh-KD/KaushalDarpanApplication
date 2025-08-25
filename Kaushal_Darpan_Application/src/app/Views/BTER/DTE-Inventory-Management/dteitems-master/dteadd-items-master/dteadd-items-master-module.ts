import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { DteAddItemsMasterRoutingModule } from './dteadd-items-master.routing.module';
import { DteAddItemsMasterComponent } from './dteadd-items-master.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    DteAddItemsMasterComponent
  ],
  imports: [
    CommonModule,
    DteAddItemsMasterRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule, NgSelectModule
  ]
})
export class DteAddItemsMasterModule { }
