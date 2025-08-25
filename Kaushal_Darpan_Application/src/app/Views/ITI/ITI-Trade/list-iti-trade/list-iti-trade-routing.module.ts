import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListItiTradeComponent } from './list-iti-trade.component';

const routes: Routes = [{ path: '', component: ListItiTradeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListItiTradeRoutingModule { }
