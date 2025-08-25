import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetRequestStatusComponent } from './budget-request-status.component';

const routes: Routes = [{ path: '', component: BudgetRequestStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRequestStatusRoutingModule { }
