import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBranchesMasterComponent } from './add-branches.component';


const routes: Routes = [{
  path: '', component: AddBranchesMasterComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBranchesRoutingModule
{ }
