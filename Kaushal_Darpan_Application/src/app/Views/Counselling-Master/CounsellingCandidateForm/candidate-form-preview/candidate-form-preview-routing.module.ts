import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateFormPreviewComponent } from './candidate-form-preview.component';

const routes: Routes = [{ path: '', component: CandidateFormPreviewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateFormPreviewRoutingModule { }
