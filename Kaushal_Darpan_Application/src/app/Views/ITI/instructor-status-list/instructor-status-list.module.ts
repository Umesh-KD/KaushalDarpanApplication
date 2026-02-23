import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructorStatusListRoutingModule } from './instructor-status-list-routing.module';
import { InstructorStatusListComponent } from './instructor-status-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { ItiInstructorFormModule } from '../ITI_Instructor/iti-instructor-form/iti-instructor-form.module';
import { ItiInstructorFormViewModule } from '../ITI_Instructor/iti-instructor-form-view/iti-instructor-form-view.module';
import { InstructorOptionFormModule } from '../instructor-option-form/instructor-option-form.module';
import { InstructorSelectchoiceModule } from '../instructor-selectchoice/instructor-selectchoice.module';


@NgModule({
  declarations: [
    InstructorStatusListComponent
  ],
  imports: [
    CommonModule,
    InstructorStatusListRoutingModule,
    FormsModule,
    OTPModalModule,
    TableSearchFilterModule,
    ReactiveFormsModule,
    ItiInstructorFormModule,
    ItiInstructorFormViewModule,
    InstructorOptionFormModule,
    InstructorSelectchoiceModule
  ]
})
export class InstructorStatusListModule { }
