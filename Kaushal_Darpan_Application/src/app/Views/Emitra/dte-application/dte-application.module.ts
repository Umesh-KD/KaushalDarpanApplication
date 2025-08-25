import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { AllotStatusComponent } from './allot-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllotStatusRoutingModule } from '../allotment-status/allot-status-routing.module';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    AllotStatusRoutingModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class DTEApplicationModule { }
