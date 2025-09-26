import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CousellingCandidateFormTabComponent } from './couselling-candidate-form-tab.component';

const routes: Routes = [{ path: '', component: CousellingCandidateFormTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CousellingCandidateFormTabRoutingModule { }
