import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiDocumentScrutinyRoutingModule } from './iti-document-scrutiny-routing.module';
import { ItiDocumentScrutinyComponent } from './iti-document-scrutiny.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ItiDocumentScrutinyComponent
  ],
  imports: [
    CommonModule,
    ItiDocumentScrutinyRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ItiDocumentScrutinyModule { }
