import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchGroupRevalListComponent } from './dispatch-group-reval-list.component';

const routes: Routes = [{ path: '', component: DispatchGroupRevalListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchGroupRevalListRoutingModule { }
