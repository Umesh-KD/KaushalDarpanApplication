import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingFeesRoutingModule } from './pending-fees-routing.module';
import { PendingFeesComponent } from './pending-fees.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    PendingFeesComponent
  ],
  imports: [
    CommonModule,
    PendingFeesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ],
  exports: [PendingFeesComponent]
})
export class PendingFeesModule { }
