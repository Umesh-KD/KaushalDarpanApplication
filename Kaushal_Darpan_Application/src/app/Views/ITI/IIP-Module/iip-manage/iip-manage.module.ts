import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ITIIIPManageComponent } from './iip-manage.component';
import { ITIIIPManageRoutingModule } from './iip-manage-routing.module';

@NgModule({
  declarations: [
    ITIIIPManageComponent
  ],
  imports: [
    CommonModule,
    ITIIIPManageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ITIIIPManageModule { }
