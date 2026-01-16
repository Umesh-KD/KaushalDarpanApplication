import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BhandarFormRoutingModule } from './bhandar-form-routing.module';
import { BhandarFormComponent } from './bhandar-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BhandarFormComponent
  ],
  imports: [
    CommonModule,
    BhandarFormRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class BhandarFormModule { }
