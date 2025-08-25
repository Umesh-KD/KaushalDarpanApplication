import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItiCompanyMasterComponent } from './additi-company-master.component';





const routes: Routes = [{ path: '', component: AddItiCompanyMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCompanyMasterRoutingModule { }
