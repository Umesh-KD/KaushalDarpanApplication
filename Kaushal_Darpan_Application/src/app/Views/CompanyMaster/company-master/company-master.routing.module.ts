import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompanyMasterComponent } from './company-master.component';





const routes: Routes = [{ path: '', component: CompanyMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyMasterListRoutingModule { }
