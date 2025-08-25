import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIDispatchGroupListComponent } from './iti-dispatch-group-list.component';

const routes: Routes = [{ path: '', component: ITIDispatchGroupListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIDispatchGroupListRoutingModule { }
