import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIGenerateAdmitCardRoutingModule } from './iti-generate-admit-card-routing.module';
import { ITIGenerateAdmitCardComponent } from './iti-generate-admit-card.component';


@NgModule({
  declarations: [
    ITIGenerateAdmitCardComponent
  ],
  imports: [
    CommonModule,
    ITIGenerateAdmitCardRoutingModule
  ]
})
export class ITIGenerateAdmitCardModule { }
