import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentDetailsFormTabRoutingModule } from './document-details-form-tab-routing.module';
import { DocumentDetailsFormTabComponent } from './document-details-form-tab.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    DocumentDetailsFormTabComponent
  ],
  imports: [
    CommonModule,
    DocumentDetailsFormTabRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule
  ]
})
export class DocumentDetailsFormTabModule { }
