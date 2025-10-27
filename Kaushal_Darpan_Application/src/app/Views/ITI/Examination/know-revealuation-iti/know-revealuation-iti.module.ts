import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KnowRevealuationITIRoutingModule } from './know-revealuation-iti-routing.module';
import { KnowRevealuationITIComponent } from './know-revealuation-iti.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    KnowRevealuationITIComponent
  ],
  imports: [
    CommonModule,
    KnowRevealuationITIRoutingModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class KnowRevealuationITIModule { }
