import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditApplicationFormRoutingModule } from './application-form-routing.module';
//import { ApplicationFormComponent } from './application-form.component';
//import { DTEOtherDetailsFormComponent } from '../other-details-form/other-details-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderModule } from '../../../Shared/loader/loader.module';
//import { DTEStudentJanAadharDetailComponent } from '../student-jan-aadhar-detail/student-jan-aadhar-detail.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditApplicationFormComponent } from './application-form.component';
import { EditOptionalFormComponent } from '../optional-form/edit-optional-form.component';


@NgModule({
  declarations: [
    EditApplicationFormComponent,
    EditOptionalFormComponent
    //PersonalDetailsComponent,
    //QualificationFormComponent
   // DTEOtherDetailsFormComponent,
   // DTEStudentJanAadharDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    EditApplicationFormRoutingModule,
    LoaderModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class EditApplicationFormModule { }
