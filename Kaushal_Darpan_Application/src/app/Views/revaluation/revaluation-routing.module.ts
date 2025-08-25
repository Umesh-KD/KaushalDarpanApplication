import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevaluationComponent } from './revaluation.component';

const routes: Routes = [{ path: '', component: RevaluationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevaluationRoutingModule { }
