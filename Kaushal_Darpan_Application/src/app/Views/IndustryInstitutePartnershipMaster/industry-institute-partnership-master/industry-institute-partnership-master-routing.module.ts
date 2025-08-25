import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndustryInstitutePartnershipMasterComponent } from './industry-institute-partnership-master.component';

const routes: Routes = [{ path: '', component: IndustryInstitutePartnershipMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustryInstitutePartnershipMasterRoutingModule { }
