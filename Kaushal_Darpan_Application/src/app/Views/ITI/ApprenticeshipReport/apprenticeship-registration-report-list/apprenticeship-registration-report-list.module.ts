import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprenticeshipRegistrationReportListRoutingModule } from './apprenticeship-registration-report-list-routing.module';
import { ApprenticeshipRegistrationReportList } from './apprenticeship-registration-report-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../../material.module';

@NgModule({
  declarations: [
    ApprenticeshipRegistrationReportList
  ],
  imports: [
    CommonModule,
    ApprenticeshipRegistrationReportListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    MaterialModule
  ]
})
export class ApprenticeshipRegistrationReportListModule { }
