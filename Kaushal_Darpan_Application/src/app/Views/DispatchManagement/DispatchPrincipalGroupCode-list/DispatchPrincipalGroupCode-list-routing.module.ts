import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DispatchPrincipalGroupCodeListComponent } from './DispatchPrincipalGroupCode-list.component';

const routes: Routes = [{ path: '', component: DispatchPrincipalGroupCodeListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchPrincipalGroupCodeListRoutingModule { }
