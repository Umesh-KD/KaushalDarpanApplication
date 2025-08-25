import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIAdminUserComponent } from './itiadmin-user.component';

const routes: Routes = [{ path: '', component: ITIAdminUserComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIAdminUserRoutingModule { }
