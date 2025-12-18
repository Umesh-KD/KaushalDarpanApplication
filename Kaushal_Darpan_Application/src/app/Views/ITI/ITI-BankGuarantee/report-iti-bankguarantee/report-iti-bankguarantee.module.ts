import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { reportitibankguaranteeRoutingModule } from './report-iti-bankguarantee-routing.module';
import { reportitibankguaranteeComponent } from './report-iti-bankguarantee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
@NgModule({
  declarations: [
    reportitibankguaranteeComponent
  ],
  imports: [
    CommonModule,
    reportitibankguaranteeRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class reportitibankguaranteeModule { }
