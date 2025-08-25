import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IIPListRoutingModule } from './iip-list-routing.module';
import { IIPListComponent } from './iip-list.component';


@NgModule({
  declarations: [
    IIPListComponent
  ],
  imports: [
    CommonModule,
    IIPListRoutingModule
  ]
})
export class IIPListModule { }
