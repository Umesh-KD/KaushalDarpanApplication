import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIReceivedDispatchGroupComponent } from './iti-received-dispatch-group.component';

const routes: Routes = [{ path: '', component: ITIReceivedDispatchGroupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIReceivedDispatchGroupRoutingModule { }
