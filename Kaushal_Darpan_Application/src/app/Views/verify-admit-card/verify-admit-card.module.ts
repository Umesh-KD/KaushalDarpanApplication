import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifyAdmitCardRoutingModule } from './verify-admit-card-routing.module';
import { VerifyAdmitCardComponent } from './verify-admit-card.component';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VerifyAdmitCardComponent
  ],
  imports: [
    CommonModule,
    VerifyAdmitCardRoutingModule,
    TableSearchFilterModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class VerifyAdmitCardModule { }
