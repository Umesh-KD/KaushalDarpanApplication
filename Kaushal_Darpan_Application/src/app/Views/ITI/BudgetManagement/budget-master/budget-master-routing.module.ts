import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetMasterComponent } from './budget-master.component';

const routes: Routes = [{ path: '', component: BudgetMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetMasterRoutingModule { }
