import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

import { IIPEventConsentListComponent } from './iip-event-consent-list.component';
import { IIPEventConsentListRoutingModule } from './iip-event-consent-list-routing.module';

@NgModule({
  declarations: [
    IIPEventConsentListComponent
  ],
  imports: [
    CommonModule,
    IIPEventConsentListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule, 
    TableSearchFilterModule
  ]
})
export class IIPEventConsentListModule { }
