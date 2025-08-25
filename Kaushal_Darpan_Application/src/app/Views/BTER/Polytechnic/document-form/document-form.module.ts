import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentFormRoutingModule } from './document-form-routing.module';
import { DocumentFormComponent } from './document-form.component';
import { ImageErrorDirective } from '../../../Common/image-error.directive';
import { LoaderModule } from '../../Shared/loader/loader.module';



@NgModule({
  declarations: [
    DocumentFormComponent,
/*    ImageErrorDirective*/
  ],
  imports: [
    CommonModule,
    DocumentFormRoutingModule,
    LoaderModule
  ]
})
export class DocumentFormModule { }
