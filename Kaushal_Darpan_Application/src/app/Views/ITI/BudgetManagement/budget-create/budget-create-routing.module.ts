import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetCreateComponent } from './budget-create.component';

const routes: Routes = [{ path: '', component: BudgetCreateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetCreateRoutingModule { }
