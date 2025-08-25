import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreviewFormRoutingModule } from './preview-form-routing.module';
import { PreviewFormComponent } from './preview-form.component';
import { DocumentFormRoutingModule } from '../document-form/document-form-routing.module';

import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PreviewFormComponent

  ],
  imports: [
    CommonModule,
    PreviewFormRoutingModule,
    TableSearchFilterModule,
    LoaderModule,
    FormsModule

  ]
})
export class PreviewFormModule { }
