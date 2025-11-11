import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSanctionOrderComponent } from './add-sanction-order.component';

const routes: Routes = [{ path: '', component: AddSanctionOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSanctionOrderRoutingModule { }
