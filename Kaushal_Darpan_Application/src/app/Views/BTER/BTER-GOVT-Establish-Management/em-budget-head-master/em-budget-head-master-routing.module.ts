import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EMBudgetHeadMasterComponent } from './em-budget-head-master.component';

const routes: Routes = [{ path: '', component: EMBudgetHeadMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EMBudgetHeadMasterRoutingModule { }
