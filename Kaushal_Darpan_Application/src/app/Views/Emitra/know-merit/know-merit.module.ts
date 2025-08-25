import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KnowMeritRoutingModule } from './know-merit-routing.module';
import { KnowMeritComponent } from './know-merit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    KnowMeritComponent
  ],
  imports: [
    CommonModule,
    KnowMeritRoutingModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class KnowMeritModule { }
