import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevaluationTabComponent } from './revaluation-tab.component';

const routes: Routes = [{ path: '', component: RevaluationTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevaluationTabRoutingModule { }
