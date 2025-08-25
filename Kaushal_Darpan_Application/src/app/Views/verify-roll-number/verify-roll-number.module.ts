import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifyRollNumberRoutingModule } from './verify-roll-number-routing.module';
import { VerifyRollNumberComponent } from './verify-roll-number.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    VerifyRollNumberComponent
  ],
  imports: [
    CommonModule,
    VerifyRollNumberRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule

  ]
})
export class VerifyRollNumberModule { }
