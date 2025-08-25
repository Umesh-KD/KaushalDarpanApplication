import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayOutTestRoutingModule } from './lay-out-test-routing.module';
import { LayOutTestComponent } from './lay-out-test.component';


@NgModule({
  declarations: [
    LayOutTestComponent
  ],
  imports: [
    CommonModule,
    LayOutTestRoutingModule
  ]
})
export class LayOutTestModule { }
