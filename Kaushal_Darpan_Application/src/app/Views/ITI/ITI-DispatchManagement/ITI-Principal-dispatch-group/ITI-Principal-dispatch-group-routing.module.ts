import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIPrincipalDispatchGroupComponent } from './ITI-Principal-dispatch-group.component';

const routes: Routes = [{ path: '', component: ITIPrincipalDispatchGroupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIPrincipalDispatchGroupRoutingModule { }
