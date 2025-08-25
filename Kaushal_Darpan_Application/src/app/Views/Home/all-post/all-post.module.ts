import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllPostRoutingModule } from './all-post-routing.module';
import { AllPostComponent } from './all-post.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AllPostComponent
  ],
  imports: [
    CommonModule,
    FormsModule ,
    AllPostRoutingModule
  ]
})
export class AllPostModule { }
