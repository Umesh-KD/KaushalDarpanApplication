import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUuploadRoutingModule } from './file-uupload-routing.module';
import { FileUuploadComponent } from './file-uupload.component';


@NgModule({
  declarations: [
    FileUuploadComponent
  ],
  imports: [
    CommonModule,
    FileUuploadRoutingModule
  ]
})
export class FileUuploadModule { }
