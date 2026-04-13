import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRequestListTransferComponent } from './user-request-list-transfer.component';

const routes: Routes = [{ path: '', component: UserRequestListTransferComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRequestListTransferRoutingModule { }
