import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddGroupCenterRoutingModule } from './add-group-center-routing.module';
import { AddGroupCenterComponent } from './add-group-center.component';


@NgModule({
  declarations: [
    AddGroupCenterComponent
  ],
  imports: [
    CommonModule,
    AddGroupCenterRoutingModule
  ]
})
export class AddGroupCenterModule { }
