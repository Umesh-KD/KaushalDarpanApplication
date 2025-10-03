import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadApplicationFormRoutingModule } from './download-application-form.routing.module';
import { DownloadApplicationFormComponent } from './download-application-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
/*    KnowMeritITIComponent*/
  ],
  imports: [
    CommonModule,
    DownloadApplicationFormRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DownloadApplicationFormModule { }
