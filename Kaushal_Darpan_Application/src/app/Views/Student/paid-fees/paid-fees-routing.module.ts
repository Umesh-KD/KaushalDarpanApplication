import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaidFeesComponent } from './paid-fees.component';

const routes: Routes = [{ path: '', component: PaidFeesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidFeesRoutingModule { }
