import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DteStocksItemsListComponent } from './dtestocks-items-list.component';






const routes: Routes = [{ path: '', component: DteStocksItemsListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DteStocksItemsListRoutingModule { }
