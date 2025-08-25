import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIPendingFeesRoutingModule } from './itipending-fees-routing.module';
import { ITIPendingFeesComponent } from './itipending-fees.component';


@NgModule({
  declarations: [
    ITIPendingFeesComponent
  ],
  imports: [
    CommonModule,
    ITIPendingFeesRoutingModule
  ],
  exports: [ITIPendingFeesComponent]
})
export class ITIPendingFeesModule { }
