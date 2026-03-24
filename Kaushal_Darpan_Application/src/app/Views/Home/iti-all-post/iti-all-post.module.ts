import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllPostRoutingModule } from './iti-all-post-routing.module';
import { ITIAllPostComponent } from './iti-all-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    ITIAllPostComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AllPostRoutingModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class ITIAllPostModule { }
