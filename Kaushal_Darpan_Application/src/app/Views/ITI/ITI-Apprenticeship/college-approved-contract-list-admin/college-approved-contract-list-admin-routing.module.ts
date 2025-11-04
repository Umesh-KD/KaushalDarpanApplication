import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeApprovedContractListAdminComponent } from './college-approved-contract-list-admin.component';

const routes: Routes = [{ path: '', component: CollegeApprovedContractListAdminComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeApprovedContractListAdminRoutingModule { }
