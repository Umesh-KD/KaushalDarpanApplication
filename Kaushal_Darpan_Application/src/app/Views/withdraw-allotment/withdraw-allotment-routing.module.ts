import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WithdrawAllotmentComponent } from './withdraw-allotment.component';

const routes: Routes = [{ path: '', component: WithdrawAllotmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WithdrawAllotmentRoutingModule { }
