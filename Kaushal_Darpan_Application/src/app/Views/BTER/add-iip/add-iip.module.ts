import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddIIPRoutingModule } from './add-iip-routing.module';
import { AddIIPComponent } from './add-iip.component';


@NgModule({
  declarations: [
    AddIIPComponent
  ],
  imports: [
    CommonModule,
    AddIIPRoutingModule
  ]
})
export class AddIIPModule { }
