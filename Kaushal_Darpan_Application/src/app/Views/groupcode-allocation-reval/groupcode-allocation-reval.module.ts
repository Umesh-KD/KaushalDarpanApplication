import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupcodeAllocationRevalRoutingModule } from './groupcode-allocation-reval-routing.module';
import { GroupcodeAllocationRevalComponent } from './groupcode-allocation-reval.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    GroupcodeAllocationRevalComponent
  ],
  imports: [
    CommonModule,
    GroupcodeAllocationRevalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class GroupcodeAllocationModule { }
