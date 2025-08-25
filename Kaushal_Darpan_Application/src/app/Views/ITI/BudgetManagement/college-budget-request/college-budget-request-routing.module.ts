import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeBudgetRequestComponent } from './college-budget-request.component';

const routes: Routes = [{ path: '', component: CollegeBudgetRequestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeBudgetRequestRoutingModule { }
