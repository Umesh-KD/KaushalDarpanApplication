import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMinRequiredTradeItemsComponent } from './add-min-required-trade-items.component';

const routes: Routes = [{ path: '', component: AddMinRequiredTradeItemsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddMinRequiredTradeItemsRoutingModule { }
