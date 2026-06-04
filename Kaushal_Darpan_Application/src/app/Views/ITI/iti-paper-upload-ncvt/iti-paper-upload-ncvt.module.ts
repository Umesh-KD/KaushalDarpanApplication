import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiPaperUploadNcvtRoutingModule } from './iti-paper-upload-ncvt-routing.module';
import { ItiPaperUploadNcvtComponent } from './iti-paper-upload-ncvt.component';


@NgModule({
  declarations: [
    ItiPaperUploadNcvtComponent
  ],
  imports: [
    CommonModule,
    ItiPaperUploadNcvtRoutingModule
  ]
})
export class ItiPaperUploadNcvtModule { }
