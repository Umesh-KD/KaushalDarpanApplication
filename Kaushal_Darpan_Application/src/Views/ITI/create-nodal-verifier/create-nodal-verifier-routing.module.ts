import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateNodalVerifierComponent } from './create-nodal-verifier.component';

const routes: Routes = [{ path: '', component: CreateNodalVerifierComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateNodalVerifierRoutingModule { }
