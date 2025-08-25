import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainItiInstructorRoutingModule } from './main-iti-instructor-form-routing.module';
import { MainItiInstructorFormComponent } from './main-iti-instructor-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    MainItiInstructorFormComponent
  ],
  imports: [
    CommonModule,
    MainItiInstructorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // OTPModalModule

  ]
})
export class MainItiInstructorFormModule { }
