import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';

import { IIPEventConsentReportComponent } from './iip-event-consent-report.component';
import { IIPEventConsentReportRoutingModule } from './iip-event-consent-report-routing.module';

@NgModule({
  declarations: [
    IIPEventConsentReportComponent
  ],
  imports: [
    CommonModule,
    IIPEventConsentReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule, 
    TableSearchFilterModule
  ]
})
export class IIPEventConsentReportModule { }
