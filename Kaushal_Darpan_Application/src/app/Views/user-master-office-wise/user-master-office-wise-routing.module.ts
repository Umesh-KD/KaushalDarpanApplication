import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserMasterOfficeWiseComponent } from './user-master-office-wise.component';

const routes: Routes = [{ path: '', component: UserMasterOfficeWiseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMasterOfficeWiseRoutingModule { }
