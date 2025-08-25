import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITICollageTradeComponent } from './iti-collage-trade.component';

const routes: Routes = [{ path: '', component: ITICollageTradeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITICollageTradeRoutingModule { }
