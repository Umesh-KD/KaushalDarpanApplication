import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIGovtEMZonalOfficeMasterComponent } from './ITI-Govt-EM-ZonalOfficeMaster.component';

const routes: Routes = [{ path: '', component: ITIGovtEMZonalOfficeMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIGovtEMZonalOfficeMasterRoutingModule { }
