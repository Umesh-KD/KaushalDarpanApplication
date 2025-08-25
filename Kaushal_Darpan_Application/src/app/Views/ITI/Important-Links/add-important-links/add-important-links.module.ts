import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddImportantLinksRoutingModule } from './add-important-links-routing.module';
import { AddImportantLinksComponent } from './add-important-links.component';


@NgModule({
  declarations: [
    AddImportantLinksComponent
  ],
  imports: [
    CommonModule,
    AddImportantLinksRoutingModule
  ]
})
export class AddImportantLinksModule { }
