import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiInstructorViewRoutingModule } from './iti-instructor-form-view-routing.module';
import { ItiInstructorFormViewComponent } from './iti-instructor-form-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { OTPModalModule } from '../../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ItiInstructorFormViewComponent
  ],
  imports: [
    CommonModule,
    ItiInstructorViewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // OTPModalModule

  ]
})
export class ItiInstructorFormViewModule { }
