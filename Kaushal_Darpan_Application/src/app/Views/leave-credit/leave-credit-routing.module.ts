import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveCreditComponent } from './leave-credit.component';

const routes: Routes = [{ path: '', component: LeaveCreditComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveCreditRoutingModule { }
