import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReuploadDocumentRoutingModule } from './reupload-document-routing.module';
import { ReuploadDocumentComponent } from './reupload-document.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ReuploadDocumentComponent
  ],
  imports: [
    CommonModule,
    ReuploadDocumentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OTPModalModule

  ]
})
export class ReuploadDocumentModule { }
