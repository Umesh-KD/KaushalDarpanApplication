import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndustryInstitutePartnershipValidationComponent } from './industry-institute-partnership-validation.component';

const routes: Routes = [{ path: '', component: IndustryInstitutePartnershipValidationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustryInstitutePartnershipValidationRoutingModule { }
