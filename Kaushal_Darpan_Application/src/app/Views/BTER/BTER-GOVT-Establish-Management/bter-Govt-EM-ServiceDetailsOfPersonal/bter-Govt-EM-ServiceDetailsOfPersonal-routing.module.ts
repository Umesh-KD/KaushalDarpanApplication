import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { bterGovtEMServiceDetailsOfPersonalComponent } from './bter-Govt-EM-ServiceDetailsOfPersonal.component';

const routes: Routes = [{ path: '', component: bterGovtEMServiceDetailsOfPersonalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class bterGovtEMServiceDetailsOfPersonalRoutingModule { }
