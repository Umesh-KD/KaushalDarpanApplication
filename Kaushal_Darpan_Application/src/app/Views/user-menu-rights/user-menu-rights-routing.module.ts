import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserMenuRightsComponent } from './user-menu-rights.component';

const routes: Routes = [{ path: '', component: UserMenuRightsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMenuRightsRoutingModule { }
