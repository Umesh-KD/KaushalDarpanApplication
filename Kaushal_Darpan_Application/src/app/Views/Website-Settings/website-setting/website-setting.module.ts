import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { WebsiteSettingComponent } from './website-setting.component';
import { WebsiteSettingRoutingModule } from './website-setting-routing.module';


@NgModule({
  declarations: [
    WebsiteSettingComponent
  ],
  imports: [
    CommonModule,
    WebsiteSettingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class WebsiteSettingModule { }
