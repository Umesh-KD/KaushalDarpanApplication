import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DteEditeItemMasterRoutingModule } from './dteedite-item-master-routing.module';
import { DteEditeItemMasterComponent } from './dteedite-item-master.component';
import { TableSearchFilterModule } from '../../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DteEditeItemMasterComponent
  ],
  imports: [
    CommonModule,
    DteEditeItemMasterRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
  ]
})
export class DteEditeItemMasterModule { }
