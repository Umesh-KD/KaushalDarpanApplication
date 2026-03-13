import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUuploadRoutingModule } from './file-uupload-routing.module';
import { FileUuploadComponent } from './file-uupload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    FileUuploadComponent
  ],
  imports: [
    CommonModule,
    FileUuploadRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class FileUuploadModule { }
