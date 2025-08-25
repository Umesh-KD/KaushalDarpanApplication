import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SanctionOrderComponent } from './SanctionOrder.component';

const routes: Routes = [{ path: '', component: SanctionOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SanctionOrderRoutingModule { }
