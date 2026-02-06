import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveBalanceComponent } from './leave-balance.component';

const routes: Routes = [{ path: '', component: LeaveBalanceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveBalanceRoutingModule { }
