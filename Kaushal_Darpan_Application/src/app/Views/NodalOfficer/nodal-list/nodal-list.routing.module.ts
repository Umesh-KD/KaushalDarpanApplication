import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NodalListComponent } from './nodal-list.component';





const routes: Routes = [{ path: '', component: NodalListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NodalListRoutingModule { }
