import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { itiAddNodelUserRoutingModule } from './iti-Add-Nodel-User-routing.module'; 
import { itiAddNodelUserComponent } from './iti-Add-Nodel-User.component';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    itiAddNodelUserComponent
  ],
  imports: [
    CommonModule,
    itiAddNodelUserRoutingModule,
    FormsModule,
    ReactiveFormsModule, OTPModalModule
  ]
})
export class itiAddNodelUserModule { }
