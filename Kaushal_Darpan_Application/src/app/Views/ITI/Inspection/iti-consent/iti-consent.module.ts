import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ITIConsentComponent } from './iti-consent.component';
import { ITIConsentRoutingModule } from './iti-consent-routing.module';

@NgModule({
  declarations: [
    ITIConsentComponent
  ],
  imports: [
    CommonModule,
    ITIConsentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ITIConsentModule { }
