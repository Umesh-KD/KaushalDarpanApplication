import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewVerifyRollListRoutingModule } from './view-verify-roll-list-routing.module';
import { ViewVerifyRollListComponent } from './view-verify-roll-list.component';
import { VerifyRollListPdfRoutingModule } from '../verify-roll-list-pdf/verify-roll-list-pdf-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ViewVerifyRollListComponent
  ],
  imports: [
    CommonModule,
    ViewVerifyRollListRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class ViewVerifyRollListModule { }
