import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KnowMeritITIRoutingModule } from './know-merit-iti-routing.module';
import { KnowMeritITIComponent } from './know-merit-iti.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
/*    KnowMeritITIComponent*/
  ],
  imports: [
    CommonModule,
    KnowMeritITIRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class KnowMeritITIModule { }
