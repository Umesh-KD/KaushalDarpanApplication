import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

import { HrMasterComponent } from './hr-master.component';
import { HrmasterRoutingModule } from './hr-master.routing.module';

@NgModule({
  declarations: [
    HrMasterComponent
  ],
  imports: [
    CommonModule,
    HrmasterRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class HrmasterModule { }
