import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllPostRoutingModule } from './all-post-routing.module';
import { AllPostComponent } from './all-post.component';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    AllPostComponent
  ],
  imports: [
    CommonModule,
    FormsModule ,
    AllPostRoutingModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class AllPostModule { }
