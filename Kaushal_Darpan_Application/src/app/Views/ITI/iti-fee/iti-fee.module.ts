import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiFeeRoutingModule } from './iti-fee-routing.module';
import { ITIFeeComponent } from './iti-fee.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ITIFeeComponent,
  ],
  imports: [
    CommonModule,
    ItiFeeRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    OTPModalModule
  ]
})
export class ItiFeeModule { }
