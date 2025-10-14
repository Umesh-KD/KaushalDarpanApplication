import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditCounsellingCandidateFormComponent } from './edit-counselling-candidate-form.component';





const routes: Routes = [{ path: '', component: EditCounsellingCandidateFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCounsellingCandidateFormRoutingModule { }
