import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NodalCenterStatusRoutingModule } from './nodal-center-status-routing.module';
import { NodalCenterStatusComponent } from './nodal-center-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NodalCenterStatusComponent
  ],
  imports: [
    CommonModule,
    NodalCenterStatusRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NodalCenterStatusModule { }
