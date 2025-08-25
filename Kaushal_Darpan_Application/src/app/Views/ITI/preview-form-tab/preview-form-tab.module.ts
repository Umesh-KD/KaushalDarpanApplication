import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreviewFormTabComponent } from './preview-form-tab.component';
import { PreviewFormTabRoutingModule } from './preview-form-tab-routing.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { ImageErrorDirective } from '../../../Common/image-error.directive';



@NgModule({
  declarations: [
    PreviewFormTabComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PreviewFormTabRoutingModule,
    LoaderModule
  ]
})
export class PreviewFormTabModule { }
