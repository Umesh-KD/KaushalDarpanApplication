import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeatsDistributionsListRoutingModule } from './seats-distributions-list-routing.module';
import { SeatsDistributionsListComponent } from './seats-distributions-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';

@NgModule({
  declarations: [
    SeatsDistributionsListComponent
  ],
  imports: [
    CommonModule,
    SeatsDistributionsListRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class SeatsDistributionsListModule { }
