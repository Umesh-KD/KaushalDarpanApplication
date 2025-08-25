import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIGovtEMZonalOfficeITIPrincipalMasterComponent } from './ITI-Govt-EM-ZonalOfficeITIPrincipalMaster.component';

const routes: Routes = [{ path: '', component: ITIGovtEMZonalOfficeITIPrincipalMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIGovtEMZonalOfficeITIPrincipalMasterRoutingModule { }
