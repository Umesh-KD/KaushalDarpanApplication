import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { THTEDTECommitteeComponent } from './thte-dte-committee.component';
import { THTEDTECommitteeRoutingModule } from './thte-dte-committee-routing.module';

@NgModule({
  declarations: [
    THTEDTECommitteeComponent
  ],
  imports: [
    CommonModule,
    THTEDTECommitteeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class THTEDTECommitteeModule { }
