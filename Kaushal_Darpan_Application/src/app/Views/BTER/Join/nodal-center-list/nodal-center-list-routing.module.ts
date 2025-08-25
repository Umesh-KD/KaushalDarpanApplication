import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodalCenterListComponent } from './nodal-center-list.component';

const routes: Routes = [{ path: '', component: NodalCenterListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NodalCenterListRoutingModule { }
