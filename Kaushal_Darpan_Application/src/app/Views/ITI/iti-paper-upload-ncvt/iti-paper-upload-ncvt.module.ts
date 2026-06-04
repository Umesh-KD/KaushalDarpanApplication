import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiPaperUploadNcvtRoutingModule } from './iti-paper-upload-ncvt-routing.module';
import { ItiPaperUploadNcvtComponent } from './iti-paper-upload-ncvt.component';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from '../../../routes';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ClipboardModule } from '@angular/cdk/clipboard';


@NgModule({
  declarations: [
    ItiPaperUploadNcvtComponent
  ],
  imports: [
    CommonModule,
    ItiPaperUploadNcvtRoutingModule,
    CommonModule, MaterialModule, ReactiveFormsModule, FormsModule,
    RouterModule.forChild(routes),
    NgMultiSelectDropDownModule.forRoot(),
    ClipboardModule
  ]
})
export class ItiPaperUploadNcvtModule { }
