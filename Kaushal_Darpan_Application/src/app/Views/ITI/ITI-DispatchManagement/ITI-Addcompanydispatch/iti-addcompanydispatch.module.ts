import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIAddcompanydispatchRoutingModule } from './iti-addcompanydispatch-routing.module';
import { ITIAddcompanydispatchComponent } from './iti-addcompanydispatch.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ITIAddcompanydispatchComponent
  ],
  imports: [
    CommonModule,
    ITIAddcompanydispatchRoutingModule,
       FormsModule,
    LoaderModule,
    ReactiveFormsModule, OTPModalModule
  ]
})
export class ITIAddcompanydispatchModule { }
