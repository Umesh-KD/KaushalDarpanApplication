import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItiTradeComponent } from './add-iti-trade.component';

const routes: Routes = [{ path: '', component: AddItiTradeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddItiTradeRoutingModule { }
