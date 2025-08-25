import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AadharEsignRoutingModule } from './aadhar-esign-routing.module';
import { AadharEsignComponent } from './aadhar-esign.component';


@NgModule({
  declarations: [
    AadharEsignComponent
  ],
  imports: [
    CommonModule,
    AadharEsignRoutingModule
  ]
})
export class AadharEsignModule { }
