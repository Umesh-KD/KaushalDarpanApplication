import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleMenuRightsRoutingModule } from './role-menu-rights-routing.module';
import { RoleMenuRightsComponent } from './role-menu-rights.component';
import { FormsModule } from '@angular/forms';
import { LoaderModule } from "../Shared/loader/loader.module";


@NgModule({
  declarations: [
    RoleMenuRightsComponent
  ],
  imports: [
    CommonModule,
    RoleMenuRightsRoutingModule,
    FormsModule,
    LoaderModule
  ]
})
export class RoleMenuRightsModule { }
