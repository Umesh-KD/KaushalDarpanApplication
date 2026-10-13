import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiLeaveCreditRoutingModule } from './iti-leave-credit-routing.module';
import { ItiLeaveCreditComponent } from './iti-leave-credit.component';


@NgModule({
  declarations: [
    ItiLeaveCreditComponent
  ],
  imports: [
    CommonModule,
    ItiLeaveCreditRoutingModule
  ]
})
export class ItiLeaveCreditModule { }
