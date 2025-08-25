import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllPostRoutingModule } from './iti-all-post-routing.module';
import { ITIAllPostComponent } from './iti-all-post.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ITIAllPostComponent
  ],
  imports: [
    CommonModule,
    AllPostRoutingModule,
    ReactiveFormsModule
  ]
})
export class ITIAllPostModule { }
