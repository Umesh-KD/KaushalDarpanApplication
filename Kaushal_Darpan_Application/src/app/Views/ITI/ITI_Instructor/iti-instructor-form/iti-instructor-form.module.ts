import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiInstructorRoutingModule } from './iti-instructor-form-routing.module';
import { ItiInstructorFormComponent } from './iti-instructor-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JanAadharDetailModule } from '../../../new-jan-aadhar/new-jan-aadhar.module';
// import { OTPModalModule } from '../../../otpmodal/otpmodal.module';
@NgModule({
  declarations: [
    ItiInstructorFormComponent
  ],
  imports: [
    CommonModule,
    ItiInstructorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // OTPModalModule,
    JanAadharDetailModule

  ], exports: [ItiInstructorFormComponent]
})
export class ItiInstructorFormModule { }
