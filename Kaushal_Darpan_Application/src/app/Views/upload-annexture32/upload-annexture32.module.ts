import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadAnnexture32RoutingModule } from './upload-annexture32-routing.module';
import { UploadAnnexture32Component } from './upload-annexture32.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UploadAnnexture32Component
  ],
  imports: [
    CommonModule,
    UploadAnnexture32RoutingModule,
    FormsModule

  ]
})
export class UploadAnnexture32Module { }
