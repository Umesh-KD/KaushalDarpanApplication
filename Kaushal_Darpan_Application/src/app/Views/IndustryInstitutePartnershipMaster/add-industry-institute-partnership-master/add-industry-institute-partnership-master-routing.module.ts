import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddIndustryInstitutePartnershipMasterComponent } from './add-industry-institute-partnership-master.component';

const routes: Routes = [{ path: '', component: AddIndustryInstitutePartnershipMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddIndustryInstitutePartnershipMasterRoutingModule { }
