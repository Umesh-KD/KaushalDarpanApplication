import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { BterInternalSlidingComponent } from './bter-internal-sliding.component';
import { BterInternalSlidingRoutingModule } from './bter-internal-sliding-routing.module';

@NgModule({
  declarations: [
    BterInternalSlidingComponent
  ],
  imports: [
    CommonModule,
    BterInternalSlidingRoutingModule, FormsModule,
    ReactiveFormsModule, LoaderModule, TableSearchFilterModule
  ]
})
export class BterInternalSlidingModule { }
