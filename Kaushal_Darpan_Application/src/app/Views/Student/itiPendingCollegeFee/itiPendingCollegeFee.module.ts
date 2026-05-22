import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { itiPendingCollegeFeeRoutingModule } from './itiPendingCollegeFee-routing.module';
import { itiPendingCollegeFeeComponent } from './itiPendingCollegeFee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    itiPendingCollegeFeeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    itiPendingCollegeFeeRoutingModule
  ],



  exports: [itiPendingCollegeFeeComponent]
})
export class itiPendingCollegeFeeModule { }
