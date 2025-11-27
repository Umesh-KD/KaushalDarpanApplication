import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCollegeApprovedContractRPTComponent } from './iti-college-approved-contract-rpt.component';

const routes: Routes = [{ path: '', component: ItiCollegeApprovedContractRPTComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCollegeApprovedContractRPTRoutingModule { }
