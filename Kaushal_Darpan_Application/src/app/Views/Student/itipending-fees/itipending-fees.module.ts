import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIPendingFeesRoutingModule } from './itipending-fees-routing.module';
import { ITIPendingFeesComponent } from './itipending-fees.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    ITIPendingFeesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    ITIPendingFeesRoutingModule
  ],



  exports: [ITIPendingFeesComponent]
})
export class ITIPendingFeesModule { }
