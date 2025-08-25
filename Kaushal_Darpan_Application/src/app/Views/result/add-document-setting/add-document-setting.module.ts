import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddDocumentSettingRoutingModule } from './add-document-setting-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { AddDocumentSettingComponent } from './add-document-setting.component';


@NgModule({
  declarations: [
    AddDocumentSettingComponent
  ],
  imports: [
    CommonModule,
    AddDocumentSettingRoutingModule,
    LoaderModule,
    FormsModule,
    TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class AddDocumentSettingModule { }
