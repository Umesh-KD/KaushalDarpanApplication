import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifyRollListPdfRoutingModule } from './verify-roll-list-pdf-routing.module';
import { VerifyRollListPdfComponent } from './verify-roll-list-pdf.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    VerifyRollListPdfComponent
  ],
  imports: [
    CommonModule,
    VerifyRollListPdfRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class VerifyRollListPdfModule { }
