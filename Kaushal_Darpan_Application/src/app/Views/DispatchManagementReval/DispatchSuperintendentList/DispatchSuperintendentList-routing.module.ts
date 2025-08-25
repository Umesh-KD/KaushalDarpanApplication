import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchSuperintendentListComponent } from './DispatchSuperintendentList.component';

const routes: Routes = [{ path: '', component: DispatchSuperintendentListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchSuperintendentListRoutingModule { }
