import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIGovtEMSanctionedPostBasedInstituteComponent } from './ITI-Govt-EM-SanctionedPostBasedInstitute.component';

const routes: Routes = [{ path: '', component: ITIGovtEMSanctionedPostBasedInstituteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIGovtEMSanctionedPostBasedInstituteRoutingModule { }
