import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectApplicationFormRoutingModule } from './direct-application-form-routing.module';
import { DirectApplicationFormComponent } from './direct-application-form.component';
import { DirectDTEOtherDetailsFormComponent } from '../direct-other-details-form/direct-other-details-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderModule } from '../../../Shared/loader/loader.module';
import { DirectDTEStudentJanAadharDetailComponent } from '../direct-student-jan-aadhar-detail/direct-student-jan-aadhar-detail.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DirectAddressFormComponent } from '../direct-address-form/direct-address-form.component';
import { DirectQualificationFormComponent } from '../direct-qualification-form/direct-qualification-form.component';
import { DirectPreviewFormComponent } from '../direct-preview-form/direct-preview-form.component';
import { DirectDocumentFormComponent } from '../direct-document-form/direct-document-form.component';
import { DirectOptionalFormComponent } from '../direct-optional-form/direct-optional-form.component';


@NgModule({
  declarations: [
    DirectApplicationFormComponent,
    DirectAddressFormComponent,
    DirectQualificationFormComponent,
    DirectDTEOtherDetailsFormComponent,
    DirectDTEStudentJanAadharDetailComponent,
    DirectPreviewFormComponent,
    DirectDocumentFormComponent,
    DirectOptionalFormComponent
  ],
  imports: [
    CommonModule,
   FormsModule,ReactiveFormsModule,
    DirectApplicationFormRoutingModule,   
    LoaderModule,    
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class DirectApplicationFormModule { }
