import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetUCHeadComponent } from './budget-uc-head.component';

const routes: Routes = [{ path: '', component: BudgetUCHeadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetUCHeadRoutingModule { }
