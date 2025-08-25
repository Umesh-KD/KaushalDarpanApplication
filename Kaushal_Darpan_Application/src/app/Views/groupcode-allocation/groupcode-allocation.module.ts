import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupcodeAllocationRoutingModule } from './groupcode-allocation-routing.module';
import { GroupcodeAllocationComponent } from './groupcode-allocation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    GroupcodeAllocationComponent
  ],
  imports: [
    CommonModule,
    GroupcodeAllocationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class GroupcodeAllocationModule { }
