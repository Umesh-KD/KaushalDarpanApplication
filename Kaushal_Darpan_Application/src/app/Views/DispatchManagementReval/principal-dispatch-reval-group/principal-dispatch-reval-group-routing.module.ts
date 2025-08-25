import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalDispatchRevalGroupComponent } from './principal-dispatch-reval-group.component';

const routes: Routes = [{ path: '', component: PrincipalDispatchRevalGroupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalDispatchRevalGroupRoutingModule { }
