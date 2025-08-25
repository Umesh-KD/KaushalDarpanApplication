import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprenticeshipRegistrationReportRoutingModule } from './apprenticeship-registration-report-routing.module';
import { ApprenticeshipRegistrationReport } from './apprenticeship-registration-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../../material.module';

@NgModule({
  declarations: [
    ApprenticeshipRegistrationReport
  ],
  imports: [
    CommonModule,
    ApprenticeshipRegistrationReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    MaterialModule
  ]
})
export class ApprenticeshipRegistrationReportModule { }
