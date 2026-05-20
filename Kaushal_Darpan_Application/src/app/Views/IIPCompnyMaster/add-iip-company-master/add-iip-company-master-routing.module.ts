import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddIipCompanyMasterComponent } from './add-iip-company-master.component';

const routes: Routes = [{ path: '', component: AddIipCompanyMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddIipCompanyMasterRoutingModule { }
