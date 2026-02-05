import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { DTECommitteListComponent } from './dte-committe-list.component';
import { DTECommitteListRoutingModule } from './dte-committe-list-routing.module';

@NgModule({
  declarations: [
    DTECommitteListComponent
  ],
  imports: [
    CommonModule,
    DTECommitteListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class DTECommitteListModule { }
