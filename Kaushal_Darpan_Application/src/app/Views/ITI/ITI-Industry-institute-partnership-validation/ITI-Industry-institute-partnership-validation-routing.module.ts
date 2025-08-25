import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIIndustryInstitutePartnershipValidationComponent } from './ITI-Industry-institute-partnership-validation.component';

const routes: Routes = [{ path: '', component: ITIIndustryInstitutePartnershipValidationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIIndustryInstitutePartnershipValidationRoutingModule { }
