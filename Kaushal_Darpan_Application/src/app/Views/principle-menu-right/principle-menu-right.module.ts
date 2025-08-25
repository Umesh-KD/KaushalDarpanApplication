import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrincipleMenuRightRoutingModule } from './principle-menu-right-routing.module';
import { PrincipleMenuRightComponent } from './principle-menu-right.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PrincipleMenuRightComponent
  ],
  imports: [
    CommonModule,
    PrincipleMenuRightRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PrincipleMenuRightModule { }
