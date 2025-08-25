import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DispatchPrincipalGroupCodeFormComponent } from './DispatchPrincipalGroupCode-form.component';

const routes: Routes = [{ path: '', component: DispatchPrincipalGroupCodeFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchPrincipalGroupCodeFormRoutingModule { }
