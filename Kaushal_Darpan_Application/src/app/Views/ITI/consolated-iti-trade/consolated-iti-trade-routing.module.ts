import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsolatedItiTradeComponent } from './consolated-iti-trade.component';

const routes: Routes = [{ path: '', component: ConsolatedItiTradeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsolatedItiTradeRoutingModule { }
