import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeatIntakesRoutingModule } from './seat-intakes-routing.module';
import { SeatIntakesComponent } from './seat-intakes.component';


@NgModule({
  declarations: [
    SeatIntakesComponent
  ],
  imports: [
    CommonModule,
    SeatIntakesRoutingModule
  ]
})
export class SeatIntakesModule { }
