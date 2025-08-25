import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReuploadDocumentListRoutingModule } from './reupload-document-list-routing.module';
import { ReuploadDocumentListComponent } from './reupload-document-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    ReuploadDocumentListComponent
  ],
  imports: [
    CommonModule,
    ReuploadDocumentListRoutingModule,
    FormsModule, ReactiveFormsModule, TableSearchFilterModule, OTPModalModule
  ]
})
export class ReuploadDocumentListModule { }
