import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIGovtEMSanctionedPostBasedInstituteListComponent } from './ITI-Govt-EM-SanctionedPostBasedInstituteList.component';

const routes: Routes = [{ path: '', component: ITIGovtEMSanctionedPostBasedInstituteListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIGovtEMSanctionedPostBasedInstituteListRoutingModule { }
