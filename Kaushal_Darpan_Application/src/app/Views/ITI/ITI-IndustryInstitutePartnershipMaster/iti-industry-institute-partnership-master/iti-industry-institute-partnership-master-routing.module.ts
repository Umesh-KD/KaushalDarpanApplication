import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIIndustryInstitutePartnershipMasterComponent } from './iti-industry-institute-partnership-master.component';

const routes: Routes = [{ path: '', component: ITIIndustryInstitutePartnershipMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIIndustryInstitutePartnershipMasterRoutingModule { }
