import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuctionListRoutingModule } from './auction-list-routing.module';
import { AuctionListComponent } from './auction-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AuctionListComponent
  ],
  imports: [
    CommonModule,
    AuctionListRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class AuctionListModule { }
