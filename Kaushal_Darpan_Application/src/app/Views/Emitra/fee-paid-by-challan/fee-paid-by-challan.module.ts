import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeePaidByChallanRoutingModule } from './fee-paid-by-challan-routing.module';
import { FeePaidByChallanComponent } from './fee-paid-by-challan.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    FeePaidByChallanComponent
  ],
  imports: [
    CommonModule,
    FeePaidByChallanRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    TableSearchFilterModule
  ]
})
export class FeePaidByChallanModule { }
