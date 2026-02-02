import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MinRequiredTradeItemsComponent } from './min-required-trade-items.component';

const routes: Routes = [{ path: '', component: MinRequiredTradeItemsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MinRequiredTradeItemsRoutingModule { }
