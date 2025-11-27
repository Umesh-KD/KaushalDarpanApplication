import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCollegeApprovedContractRptdetailsComponent } from './iti-college-approved-contract-rptdetails.component';

const routes: Routes = [{ path: '', component: ItiCollegeApprovedContractRptdetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCollegeApprovedContractRPTDetailsRoutingModule { }
