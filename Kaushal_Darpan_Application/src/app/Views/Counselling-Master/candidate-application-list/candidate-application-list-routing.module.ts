import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateApplicationListComponent } from './candidate-application-list.component';

const routes: Routes = [{ path: '', component: CandidateApplicationListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateApplicationListRoutingModule { }
