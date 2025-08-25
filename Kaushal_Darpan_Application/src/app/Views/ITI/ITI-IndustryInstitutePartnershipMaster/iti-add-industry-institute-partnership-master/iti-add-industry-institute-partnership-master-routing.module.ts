import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIAddIndustryInstitutePartnershipMasterComponent } from './iti-add-industry-institute-partnership-master.component';

const routes: Routes = [{ path: '', component: ITIAddIndustryInstitutePartnershipMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIAddIndustryInstitutePartnershipMasterRoutingModule { }
