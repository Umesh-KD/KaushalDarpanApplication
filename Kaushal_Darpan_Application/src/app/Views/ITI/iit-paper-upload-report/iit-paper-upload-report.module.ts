import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IitPaperUploadReportRoutingModule } from './iit-paper-upload-report-routing.module';
import { IitPaperUploadReportComponent } from './iit-paper-upload-report.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    IitPaperUploadReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IitPaperUploadReportRoutingModule
  ]
})
export class IitPaperUploadReportModule { }
