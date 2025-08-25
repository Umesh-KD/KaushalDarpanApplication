import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIGovtEMServiceDetailsOfPersonalComponent } from './ITI-Govt-EM-ServiceDetailsOfPersonal.component';

const routes: Routes = [{ path: '', component: ITIGovtEMServiceDetailsOfPersonalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIGovtEMServiceDetailsOfPersonalRoutingModule { }
