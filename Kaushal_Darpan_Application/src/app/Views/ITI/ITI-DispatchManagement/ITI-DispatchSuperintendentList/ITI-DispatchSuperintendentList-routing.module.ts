import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIDispatchSuperintendentListComponent } from './ITI-DispatchSuperintendentList.component';

const routes: Routes = [{ path: '', component: ITIDispatchSuperintendentListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIDispatchSuperintendentListRoutingModule { }
