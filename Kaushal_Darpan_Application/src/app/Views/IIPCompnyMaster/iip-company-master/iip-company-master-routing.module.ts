import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IipCompanyMasterComponent } from './iip-company-master.component';

const routes: Routes = [{ path: '', component: IipCompanyMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IipCompanyMasterRoutingModule { }
