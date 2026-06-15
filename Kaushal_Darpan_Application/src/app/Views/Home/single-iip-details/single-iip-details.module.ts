import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SingleIIPDetailsRoutingModule } from './single-iip-details-routing.module';
import { SingleIIPDetailsComponent } from './single-iip-details.component';


@NgModule({
  declarations: [
   SingleIIPDetailsComponent
  ],
  imports: [
    CommonModule,
    SingleIIPDetailsRoutingModule
  ]
})
export class SingleIIPDetailsModule { }
