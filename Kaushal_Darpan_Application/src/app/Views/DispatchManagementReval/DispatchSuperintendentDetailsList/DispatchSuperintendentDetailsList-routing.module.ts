import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DispatchSuperintendentDetailsListComponent } from './DispatchSuperintendentDetailsList.component';

const routes: Routes = [{ path: '', component: DispatchSuperintendentDetailsListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchSuperintendentDetailsListRoutingModule { }
