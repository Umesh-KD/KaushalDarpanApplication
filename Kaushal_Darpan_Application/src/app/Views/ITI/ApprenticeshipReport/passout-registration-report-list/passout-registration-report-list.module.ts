import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PassoutRegistrationReportListRoutingModule } from './passout-registration-report-list-routing.module';
import { PassoutRegistrationReportListComponent } from './passout-registration-report-list.component';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../material.module';

@NgModule({
  declarations: [
    PassoutRegistrationReportListComponent
  ],
  imports: [
    CommonModule,
    PassoutRegistrationReportListRoutingModule,
    TableSearchFilterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class PassoutRegistrationReportListModule { }
