import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorrectionMeritRoutingModule } from './merit-correction-routing.module';
import { CorrectionMeritComponent } from './merit-correction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    CorrectionMeritRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OTPModalModule
  ]
})
export class CorrectionMeritModule { }
