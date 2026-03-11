import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumableItemAuctionComponent } from './consumable-item-auction.component';

const routes: Routes = [{ path: '', component: ConsumableItemAuctionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumableItemAuctionRoutingModule { }
