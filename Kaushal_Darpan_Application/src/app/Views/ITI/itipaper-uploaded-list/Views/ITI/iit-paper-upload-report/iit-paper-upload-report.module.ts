import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IitPaperUploadReportRoutingModule } from './iit-paper-upload-report-routing.module';
import { IitPaperUploadReportComponent } from './iit-paper-upload-report.component';


@NgModule({
  declarations: [
    IitPaperUploadReportComponent
  ],
  imports: [
    CommonModule,
    IitPaperUploadReportRoutingModule
  ]
})
export class IitPaperUploadReportModule { }
