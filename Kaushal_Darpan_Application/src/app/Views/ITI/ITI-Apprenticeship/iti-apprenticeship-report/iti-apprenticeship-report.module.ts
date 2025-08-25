import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ITIApprenticeshipReportComponent } from './iti-apprenticeship-report.component';
import { ITIApprenticeshipReportRoutingModule } from './iti-apprenticeship-report-routing.module';

@NgModule({
  declarations: [
    ITIApprenticeshipReportComponent
  ],
  imports: [
    CommonModule,
    ITIApprenticeshipReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ITIApprenticeshipReportModule { }
