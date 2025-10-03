import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllotedCandidateListComponent } from './alloted-candidate-list.component';

const routes: Routes = [{ path: '', component: AllotedCandidateListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotedCandidateListRoutingModule { }
