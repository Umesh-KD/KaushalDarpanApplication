import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterGovtEMSanctionedPostBasedInstituteListComponent } from './Bter-Govt-EM-SanctionedPostBasedInstituteList.component';

const routes: Routes = [{ path: '', component: BterGovtEMSanctionedPostBasedInstituteListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterGovtEMSanctionedPostBasedInstituteListRoutingModule { }
