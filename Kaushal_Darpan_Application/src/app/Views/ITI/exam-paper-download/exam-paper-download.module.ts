import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExamPaperDownloadRoutingModule } from './exam-paper-download-routing.module';
import { ExamPaperDownloadComponent } from './exam-paper-download.component';


@NgModule({
  declarations: [
    ExamPaperDownloadComponent
  ],
  imports: [
    CommonModule,
    ExamPaperDownloadRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ExamPaperDownloadModule { }
