import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeePaidByChallanComponent } from './fee-paid-by-challan.component';

const routes: Routes = [{ path: '', component: FeePaidByChallanComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeePaidByChallanRoutingModule { }
