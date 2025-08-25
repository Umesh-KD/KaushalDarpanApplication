import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplyNowRoutingModule } from './apply-now-routing.module';
import { ApplyNowComponent } from './apply-now.component';


@NgModule({
  declarations: [
    ApplyNowComponent
  ],
  imports: [
    CommonModule,
    ApplyNowRoutingModule
  ]
})
export class ApplyNowModule { }
