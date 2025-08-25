import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserMenuRightsRoutingModule } from './user-menu-rights-routing.module';
import { UserMenuRightsComponent } from './user-menu-rights.component';
import { FormsModule } from '@angular/forms';
import { LoaderModule } from "../Shared/loader/loader.module";


@NgModule({
  declarations: [
    UserMenuRightsComponent
  ],
  imports: [
    CommonModule,
    UserMenuRightsRoutingModule,
    FormsModule,
    LoaderModule
  ]
})
export class UserMenuRightsModule { }
