import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetDistributeComponent } from './budget-distribute.component';

const routes: Routes = [{ path: '', component: BudgetDistributeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetDistributeRoutingModule { }
