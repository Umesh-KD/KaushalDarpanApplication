import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditOptionFormRoutingModule } from './edit-option-form-routing.module';
//import { AllotStatusComponent } from './allot-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
   // AllotStatusComponent
  ],
  imports: [
    CommonModule,
    EditOptionFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class EditOptionFormModule { }
