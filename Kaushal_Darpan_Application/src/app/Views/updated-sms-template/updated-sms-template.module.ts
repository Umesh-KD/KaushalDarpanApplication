import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { LoaderModule } from '../Shared/loader/loader.module';
import { UpdatedSMSTemplateComponent } from './updated-sms-template.component';
import { UpdatedSMSTemplateRoutingModule } from './updated-sms-template-routing.module';


@NgModule({
  declarations: [
    UpdatedSMSTemplateComponent
  ],
  imports: [
    CommonModule,
    UpdatedSMSTemplateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule
  ]
})
export class UpdatedSMSTemplateModule { }
