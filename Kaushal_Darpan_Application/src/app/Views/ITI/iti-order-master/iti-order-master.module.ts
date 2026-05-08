import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiOrderMasterRoutingModule } from './iti-order-master-routing.module';
import { ItiOrderMasterComponent } from './iti-order-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ItiOrderMasterComponent
  ],
  imports: [
    CommonModule,
    ItiOrderMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ItiOrderMasterModule { }
