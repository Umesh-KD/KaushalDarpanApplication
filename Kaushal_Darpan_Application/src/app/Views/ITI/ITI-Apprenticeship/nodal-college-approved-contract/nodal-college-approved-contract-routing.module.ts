import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodalCollegeApprovedContractComponent } from './nodal-college-approved-contract.component';

const routes: Routes = [{ path: '', component: NodalCollegeApprovedContractComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NodalCollegeApprovedContractRoutingModule { }
