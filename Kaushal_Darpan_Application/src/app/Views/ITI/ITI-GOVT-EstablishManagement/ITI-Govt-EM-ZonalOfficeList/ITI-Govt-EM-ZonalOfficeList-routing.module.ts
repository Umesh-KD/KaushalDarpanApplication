import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIGovtEMZonalOfficeListComponent } from './ITI-Govt-EM-ZonalOfficeList.component';

const routes: Routes = [{ path: '', component: ITIGovtEMZonalOfficeListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIGovtEMZonalOfficeListRoutingModule { }
