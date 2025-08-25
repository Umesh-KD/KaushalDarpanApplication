import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCompanyMasterComponent } from './iticompany-master.component';






const routes: Routes = [{ path: '', component: ItiCompanyMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCompanyMasterListRoutingModule { }
