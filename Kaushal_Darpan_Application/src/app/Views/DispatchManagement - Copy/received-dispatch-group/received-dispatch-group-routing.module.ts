import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceivedDispatchGroupComponent } from './received-dispatch-group.component';

const routes: Routes = [{ path: '', component: ReceivedDispatchGroupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceivedDispatchGroupRoutingModule { }
