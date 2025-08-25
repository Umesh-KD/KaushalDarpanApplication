import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentSettingRoutingModule } from './document-setting-routing.module';
import { DocumentSettingComponent } from './document-setting.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    DocumentSettingComponent
  ],
  imports: [
    CommonModule,
    DocumentSettingRoutingModule,
    LoaderModule,
    FormsModule,
    TableSearchFilterModule,
    ReactiveFormsModule
  ]
})
export class DocumentSettingModule { }
