import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIPlanDocumentRoutingModule } from './itiplan-document-routing.module';
import { ITIPlanDocumentComponent } from './itiplan-document.component';


@NgModule({
  declarations: [
    ITIPlanDocumentComponent
  ],
  imports: [
    CommonModule,
    ITIPlanDocumentRoutingModule
  ]
})
export class ITIPlanDocumentModule { }
