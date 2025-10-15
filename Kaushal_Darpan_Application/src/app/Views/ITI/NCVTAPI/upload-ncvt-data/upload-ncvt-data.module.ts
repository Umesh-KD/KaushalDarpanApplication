import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadNcvtDataRoutingModule } from './upload-ncvt-data-routing.module';
import { UploadNcvtDataComponent } from './upload-ncvt-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UploadNcvtDataComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UploadNcvtDataRoutingModule
  ]
})
export class UploadNcvtDataModule { }
