import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { IipEventConsentListPublicComponent } from './iip-event-consent-list-public.component';
import { IipEventConsentListPublicRoutingModule } from './iip-event-consent-list-public-routing.module';
import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [
    IipEventConsentListPublicComponent
  ],
  imports: [
    CommonModule,
    IipEventConsentListPublicRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule, 
    TableSearchFilterModule,
    MaterialModule
  ]
})
export class IipEventConsentListPublicModule { }
