import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ConsumableItemAuctionComponent } from './consumable-item-auction.component';
import { ConsumableItemAuctionRoutingModule } from './consumable-item-auction-routing.module';

@NgModule({
  declarations: [
    ConsumableItemAuctionComponent
  ],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    ConsumableItemAuctionRoutingModule
  ]
})
export class ConsumableItemAuctionModule { }
