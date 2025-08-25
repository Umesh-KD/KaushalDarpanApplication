import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WithdrawAllotmentRoutingModule } from './withdraw-allotment-routing.module';
import { WithdrawAllotmentComponent } from './withdraw-allotment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    WithdrawAllotmentComponent
  ],
  imports: [
    CommonModule,
    WithdrawAllotmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class WithdrawAllotmentModule { }
