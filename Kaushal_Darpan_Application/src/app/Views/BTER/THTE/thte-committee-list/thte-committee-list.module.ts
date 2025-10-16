import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { THTECommitteeListComponent } from './thte-committee-list.component';
import { THTECommitteeListRoutingModule } from './thte-committee-list-routing.module';

@NgModule({
  declarations: [
    THTECommitteeListComponent
  ],
  imports: [
    CommonModule,
    THTECommitteeListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class THTECommitteeListModule { }
