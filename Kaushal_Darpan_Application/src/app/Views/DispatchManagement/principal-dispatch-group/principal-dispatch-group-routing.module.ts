import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalDispatchGroupComponent } from './principal-dispatch-group.component';

const routes: Routes = [{ path: '', component: PrincipalDispatchGroupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalDispatchGroupRoutingModule { }
