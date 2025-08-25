import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllotStatusRoutingModule } from './allot-status-routing.module';
//import { AllotStatusComponent } from './allot-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
   // AllotStatusComponent
  ],
  imports: [
    CommonModule,
    AllotStatusRoutingModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class AllotStatusModule { }
