import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';
import { RenumerationFeeSetterComponent } from './renumeration-fee-setter.component';
import { RenumerationFeeSetterRoutingModule } from './renumeration-fee-setter-routing.module';


@NgModule({
  declarations: [
    RenumerationFeeSetterComponent
  ],
  imports: [
    CommonModule,
    RenumerationFeeSetterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class RenumerationFeeSetterModule { }
