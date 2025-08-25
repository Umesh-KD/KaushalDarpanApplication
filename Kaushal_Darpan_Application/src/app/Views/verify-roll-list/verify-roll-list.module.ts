import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifyRollListRoutingModule } from './verify-roll-list-routing.module';
import { VerifyRollListComponent } from './verify-roll-list.component';
import { VerifyRollListPdfRoutingModule } from '../verify-roll-list-pdf/verify-roll-list-pdf-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    VerifyRollListComponent
  ],
  imports: [
    CommonModule,
    VerifyRollListRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class VerifyRollListModule { }
