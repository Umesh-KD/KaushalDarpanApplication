import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { LoaderModule } from '../../../Shared/loader/loader.module';
import { ImageErrorDirective } from '../../../../Common/image-error.directive';
import { ITIDirectPreviewPrivateFormComponent } from './iti-direct-preview-private-form.component';
import { ITIDirectPreviewPrivateFormRoutingModule } from './iti-direct-preview-private-form-routing.module';



@NgModule({
  declarations: [
    ITIDirectPreviewPrivateFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ITIDirectPreviewPrivateFormRoutingModule,
    LoaderModule
  ],
   exports: [
    ITIDirectPreviewPrivateFormComponent
  ]
})
export class DirectPreviewFormTabModule { }
