import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ITIConsentUpdateComponent } from './iti-consent-update.component';
import { ITIConsentUpdateRoutingModule } from './iti-consent-update-routing.module';
import { OTPModalModule } from '../../../otpmodal/otpmodal.module';

@NgModule({
  declarations: [
    ITIConsentUpdateComponent
  ],
  imports: [
    CommonModule,
    ITIConsentUpdateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    OTPModalModule
  ]
})
export class ITIConsentUpdateModule { }
