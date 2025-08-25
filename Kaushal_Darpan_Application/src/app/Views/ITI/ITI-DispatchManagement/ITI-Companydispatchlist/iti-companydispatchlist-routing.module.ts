import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITICompanydispatchlistComponent } from './iti-companydispatchlist.component';

const routes: Routes = [{ path: '', component: ITICompanydispatchlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITICompanydispatchlistRoutingModule { }
