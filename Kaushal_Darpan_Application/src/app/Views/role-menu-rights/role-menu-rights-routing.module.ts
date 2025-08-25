import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleMenuRightsComponent } from './role-menu-rights.component';

const routes: Routes = [{ path: '', component: RoleMenuRightsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleMenuRightsRoutingModule { }
