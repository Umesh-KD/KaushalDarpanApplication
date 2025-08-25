import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeBudgetListComponent } from './college-budget-list.component';

const routes: Routes = [{ path: '', component: CollegeBudgetListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeBudgetListRoutingModule { }
