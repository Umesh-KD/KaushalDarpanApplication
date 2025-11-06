import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SanctionOrderListComponent } from './sanction-order-list.component';

const routes: Routes = [{ path: '', component: SanctionOrderListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SanctionOrderListRoutingModule { }
