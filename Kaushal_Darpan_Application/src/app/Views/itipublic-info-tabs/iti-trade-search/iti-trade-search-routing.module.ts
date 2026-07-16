import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiTradeSearchComponent } from './iti-trade-search.component';

const routes: Routes = [{ path: '', component: ItiTradeSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiTradeSearchRoutingModule { }
